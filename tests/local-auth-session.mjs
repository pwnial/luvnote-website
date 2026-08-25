import { chromium, webkit } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer as createProbeServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_AUTH_ORIGIN = "http://127.0.0.1:57321";
const WEBSITE_ORIGIN = "http://127.0.0.1:3000";
const PRODUCTION_AUTH_ORIGIN = "https://fkfyhsbhsobxmiiidtrn.supabase.co";
const repoRoot = fileURLToPath(new URL("../", import.meta.url));

function requireSafeEnvironment() {
  if (process.env.LUV_AUTOMATION !== "1") throw new Error("LUV_AUTOMATION must be exactly 1");
  if (process.env.LUV_BACKEND_ENV !== "local") throw new Error("LUV_BACKEND_ENV must be exactly local");
  if (process.env.LUV_VISUAL_AUDIT_REQUIRED !== "1") throw new Error("The visual-audit safety marker is missing");
  if (process.env.LUV_SUPABASE_URL !== EXPECTED_AUTH_ORIGIN) throw new Error("Refusing a non-loopback Supabase URL");
  if (!process.env.LUV_SUPABASE_KEY?.startsWith("sb_publishable_")) throw new Error("A local publishable key is required");
  if (!process.env.LUV_TEST_ACCOUNT_EMAIL || !process.env.LUV_TEST_ACCOUNT_PASSWORD) {
    throw new Error("The disposable visual-audit account is required");
  }
}

function waitForExit(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`Child process failed (${code ?? signal})`));
    });
  });
}

function requireAvailableWebsitePort() {
  return new Promise((resolve, reject) => {
    const probe = createProbeServer();
    probe.once("error", () => reject(new Error("Loopback port 3000 is already in use")));
    probe.listen(3000, "127.0.0.1", () => probe.close(resolve));
  });
}

async function waitForWebsite() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(WEBSITE_ORIGIN);
      if (response.ok) return;
    } catch {
      // The server may still be binding its loopback port.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("The loopback website did not start");
}

async function authRequest(path, { body, method = "POST", token } = {}) {
  const key = process.env.LUV_SUPABASE_KEY;
  const response = await fetch(`${EXPECTED_AUTH_ORIGIN}/auth/v1${path}`, {
    method,
    headers: {
      apikey: key,
      authorization: `Bearer ${token ?? key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // Some successful Auth endpoints have no JSON body.
  }
  return { response, payload };
}

function sessionFrom(payload) {
  return payload?.session ?? payload;
}

requireSafeEnvironment();
const buildDirectory = await mkdtemp(join(tmpdir(), "luv-local-auth-build-"));
let server = null;
const browsers = [];

try {
  const build = spawn(
    process.execPath,
    [join(repoRoot, "node_modules/vite/bin/vite.js"), "build", "--outDir", buildDirectory, "--emptyOutDir"],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        VITE_SUPABASE_URL: EXPECTED_AUTH_ORIGIN,
        VITE_SUPABASE_KEY: process.env.LUV_SUPABASE_KEY,
      },
      stdio: "inherit",
    },
  );
  await waitForExit(build);

  await requireAvailableWebsitePort();
  server = spawn(
    process.execPath,
    [
      join(repoRoot, "tests/static-server.mjs"),
      "--port", "3000",
      "--root", buildDirectory,
      "--spa",
      "--connect-origin", EXPECTED_AUTH_ORIGIN,
    ],
    { cwd: repoRoot, stdio: "inherit" },
  );
  await waitForWebsite();

  const results = [];
  for (const [engineName, engine] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await engine.launch({ headless: true });
    browsers.push(browser);
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const email = process.env.LUV_TEST_ACCOUNT_EMAIL;
    const originalPassword = process.env.LUV_TEST_ACCOUNT_PASSWORD;
    const updatedPassword = `After9-${suffix}`;

    const originalLogin = await authRequest("/token?grant_type=password", { body: { email, password: originalPassword } });
    if (!originalLogin.response.ok) throw new Error(`${engineName}: fixture login failed with ${originalLogin.response.status}`);
    const session = sessionFrom(originalLogin.payload);
    if (!session?.access_token || !session?.refresh_token) throw new Error(`${engineName}: fixture login returned no session`);

    // The minimal visual-audit stack intentionally excludes Mailpit. This
    // checks whether GoTrue accepted the real recovery request; the separate
    // browser step starts from an actual local Auth session and validates the
    // website's post-link update/sign-out behavior without inventing tokens.
    const recoveryRequest = await authRequest(`/recover?redirect_to=${encodeURIComponent(`${WEBSITE_ORIGIN}/reset`)}`, {
      body: { email, gotrue_meta_security: {} },
    });

    let updatedSession = null;
    try {
      const context = await browser.newContext();
      const productionRequests = [];
      await context.route(`${PRODUCTION_AUTH_ORIGIN}/**`, async (route) => {
        productionRequests.push(route.request().url());
        await route.abort("blockedbyclient");
      });
      const page = await context.newPage();
      const hash = new URLSearchParams({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: String(session.expires_in ?? 3600),
        token_type: "bearer",
        type: "recovery",
      });
      await page.goto(`${WEBSITE_ORIGIN}/reset#${hash}`, { waitUntil: "domcontentloaded" });
      await page.locator("#reset-password").waitFor({ state: "visible", timeout: 10_000 });
      if (page.url() !== `${WEBSITE_ORIGIN}/reset`) throw new Error(`${engineName}: recovery credentials remained in the URL`);

      await page.locator("#reset-password").fill(updatedPassword);
      await page.locator("#reset-confirm-password").fill(updatedPassword);
      await page.getByRole("button", { name: "Update password" }).click();
      await page.getByRole("status").filter({ hasText: "recovery session was closed" }).waitFor({ timeout: 10_000 });

      const storedAuthKeys = await page.evaluate(() => [localStorage, sessionStorage]
        .flatMap((storage) => Array.from({ length: storage.length }, (_, index) => storage.key(index)))
        .filter((key) => key?.startsWith("sb-") && key.endsWith("-auth-token")));
      if (storedAuthKeys.length > 0) throw new Error(`${engineName}: an Auth session persisted in browser storage`);
      if (productionRequests.length > 0) throw new Error(`${engineName}: the local test attempted a production Auth request`);
      await context.close();

      const oldLogin = await authRequest("/token?grant_type=password", { body: { email, password: originalPassword } });
      const newLogin = await authRequest("/token?grant_type=password", { body: { email, password: updatedPassword } });
      updatedSession = sessionFrom(newLogin.payload);
      if (oldLogin.response.ok) throw new Error(`${engineName}: the original password still authenticated`);
      if (!newLogin.response.ok || !updatedSession?.access_token) {
        throw new Error(`${engineName}: the updated password did not authenticate`);
      }

      results.push({
        engine: engineName,
        browserRecoverySession: "passed",
        oldPasswordRejected: true,
        updatedPasswordAccepted: true,
        recoveryRequestStatus: recoveryRequest.response.status,
        productionRequests: 0,
      });
    } finally {
      if (!updatedSession?.access_token) {
        const recoveryLogin = await authRequest("/token?grant_type=password", { body: { email, password: updatedPassword } });
        updatedSession = sessionFrom(recoveryLogin.payload);
      }
      if (updatedSession?.access_token) {
        const restore = await authRequest("/user", {
          method: "PUT",
          token: updatedSession.access_token,
          body: { password: originalPassword },
        });
        if (!restore.response.ok) throw new Error(`${engineName}: fixture password restoration failed`);
      }
      const restoredLogin = await authRequest("/token?grant_type=password", { body: { email, password: originalPassword } });
      if (!restoredLogin.response.ok) throw new Error(`${engineName}: fixture password was not restored`);
    }
  }

  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
} finally {
  await Promise.allSettled(browsers.map((browser) => browser.close()));
  if (server) {
    server.kill("SIGTERM");
    await Promise.race([waitForExit(server).catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 2_000))]);
  }
  await rm(buildDirectory, { recursive: true, force: true });
}
