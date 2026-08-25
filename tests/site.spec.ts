import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

const BASE_ORIGIN = "http://127.0.0.1:4177";
const SUPABASE_ORIGIN = "https://fkfyhsbhsobxmiiidtrn.supabase.co";
const LEGACY_AUTH_KEY = "sb-fkfyhsbhsobxmiiidtrn-auth-token";

const routeExpectations = [
  ["/", 200, "Luv — Notes on Their Lock Screen", "https://luvnote.app/", "index,follow"],
  ["/how-it-works", 200, "How Luv Works — From Your Note to Their Widget", "https://luvnote.app/how-it-works", "index,follow"],
  ["/privacy", 200, "Privacy Policy — Luv", "https://luvnote.app/privacy", "index,follow"],
  ["/terms", 200, "Terms of Service — Luv", "https://luvnote.app/terms", "index,follow"],
  ["/support", 200, "Support — Luv", "https://luvnote.app/support", "index,follow"],
  ["/connect?code=ABCDEFGH", 200, "Connect on Luv", "https://luvnote.app/connect", "noindex,nofollow"],
  ["/c/ABCDEFGH", 200, "Connect on Luv", "https://luvnote.app/connect", "noindex,nofollow"],
  ["/forgot", 200, "Request a Password Reset — Luv", "https://luvnote.app/forgot", "noindex,nofollow"],
  ["/reset", 200, "Reset Password — Luv", "https://luvnote.app/reset", "noindex,nofollow"],
  ["/does-not-exist", 404, "Page Not Found — Luv", null, "noindex,nofollow"],
] as const;

function encodeJSON(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

const userID = "11111111-1111-4111-8111-111111111111";
const now = Math.floor(Date.now() / 1000);
const accessToken = [
  encodeJSON({ alg: "HS256", typ: "JWT" }),
  encodeJSON({
    sub: userID,
    aud: "authenticated",
    role: "authenticated",
    email: "browser-test@example.com",
    iat: now,
    exp: now + 3600,
  }),
  "browser-test-signature",
].join(".");

const recoveryHash = new URLSearchParams({
  access_token: accessToken,
  refresh_token: "browser-test-refresh-token",
  expires_in: "3600",
  expires_at: String(now + 3600),
  token_type: "bearer",
  type: "recovery",
}).toString();

const authUser = {
  id: userID,
  aud: "authenticated",
  role: "authenticated",
  email: "browser-test@example.com",
  email_confirmed_at: new Date().toISOString(),
  phone: "",
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

async function installExternalGuard(context: BrowserContext) {
  const externalRequests: string[] = [];
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === BASE_ORIGIN) {
      await route.continue();
      return;
    }
    externalRequests.push(`${route.request().method()} ${url.href}`);
    await route.abort("blockedbyclient");
  });
  return externalRequests;
}

type RecoveryMockOptions = {
  abortUpdate?: boolean;
  failComponentGetUser?: boolean;
  failSignOut?: boolean;
  userDelayMs?: number;
};

async function installRecoveryMock(context: BrowserContext, options: RecoveryMockOptions = {}) {
  const requests: string[] = [];
  const unexpectedExternal: string[] = [];
  const unexpectedSupabase: string[] = [];
  const submittedPasswords: string[] = [];
  let userGetCount = 0;

  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === BASE_ORIGIN) {
      await route.continue();
      return;
    }
    if (url.origin !== SUPABASE_ORIGIN) {
      unexpectedExternal.push(`${request.method()} ${url.href}`);
      await route.abort("blockedbyclient");
      return;
    }

    requests.push(`${request.method()} ${url.pathname}${url.search}`);
    const corsHeaders = {
      "access-control-allow-origin": BASE_ORIGIN,
      "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
      "access-control-allow-methods": "GET, POST, PUT, OPTIONS",
    };
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    if (url.pathname === "/auth/v1/user" && request.method() === "GET") {
      userGetCount += 1;
      if (options.userDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, options.userDelayMs));
      }
      if (options.failComponentGetUser && userGetCount >= 2) {
        await route.fulfill({
          status: 500,
          headers: corsHeaders,
          contentType: "application/json",
          body: JSON.stringify({ message: "browser-test getUser failure" }),
        });
        return;
      }
      await route.fulfill({ status: 200, headers: corsHeaders, contentType: "application/json", body: JSON.stringify(authUser) });
      return;
    }
    if (url.pathname === "/auth/v1/user" && request.method() === "PUT") {
      const body = request.postDataJSON() as { password?: string } | null;
      submittedPasswords.push(body?.password ?? "");
      if (options.abortUpdate) {
        await route.abort("connectionfailed");
        return;
      }
      await route.fulfill({ status: 200, headers: corsHeaders, contentType: "application/json", body: JSON.stringify(authUser) });
      return;
    }
    if (url.pathname === "/auth/v1/logout" && request.method() === "POST") {
      await route.fulfill({
        status: options.failSignOut ? 500 : 204,
        headers: corsHeaders,
        contentType: "application/json",
        body: options.failSignOut ? JSON.stringify({ message: "browser-test signout failure" }) : "",
      });
      return;
    }

    unexpectedSupabase.push(`${request.method()} ${url.pathname}${url.search}`);
    await route.fulfill({
      status: 503,
      headers: corsHeaders,
      contentType: "application/json",
      body: JSON.stringify({ message: "unmocked Supabase request" }),
    });
  });

  return {
    requests,
    submittedPasswords,
    unexpectedExternal,
    unexpectedSupabase,
    get userGetCount() {
      return userGetCount;
    },
  };
}

async function expectNoAuthArtifacts(page: Page) {
  const artifacts = await page.evaluate((legacyKey) => {
    const keys = [legacyKey, `${legacyKey}-code-verifier`, `${legacyKey}-user`];
    return keys.filter((key) => localStorage.getItem(key) !== null || sessionStorage.getItem(key) !== null);
  }, LEGACY_AUTH_KEY);
  expect(artifacts).toEqual([]);
}

test("direct routes, refreshed routes, metadata, 404, and headers are production-shaped", async ({ page, context }) => {
  const externalRequests = await installExternalGuard(context);

  for (const [path, status, title, canonical, robots] of routeExpectations) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${path} direct status`).toBe(status);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", robots);
    if (canonical) {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    } else {
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    }
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);

    const refreshed = await page.reload({ waitUntil: "domcontentloaded" });
    expect(refreshed?.status(), `${path} reload status`).toBe(status);
    await expect(page).toHaveTitle(title);
  }

  const home = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(home?.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(home?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(home?.headers()["permissions-policy"]).toBe("camera=(), geolocation=(), microphone=(), payment=()");
  const vercelConfig = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8")) as {
    headers: Array<{ headers: Array<{ key: string; value: string }> }>;
  };
  const productionCSP = vercelConfig.headers[0].headers.find((header) => header.key === "Content-Security-Policy")?.value;
  expect(productionCSP).toContain("upgrade-insecure-requests");
  expect(externalRequests).toEqual([]);
});

test("public contact links route to the verified support inbox", async ({ page, context }) => {
  const externalRequests = await installExternalGuard(context);

  for (const path of ["/support", "/privacy", "/terms"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const mailtoLinks = await page.locator('a[href^="mailto:"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    );
    expect(mailtoLinks.length, `${path} has a public contact path`).toBeGreaterThan(0);
    for (const href of mailtoLinks) {
      expect(href, `${path} uses the verified inbox`).toMatch(/^mailto:support@luvnote\.app(?:\?|$)/);
    }
  }

  expect(externalRequests).toEqual([]);
});

test("invite routes match the native parser and require explicit copy, open, or install choices", async ({ page, context }) => {
  const externalRequests = await installExternalGuard(context);
  await context.addInitScript(() => {
    const target = window as typeof window & { __clipboardWrites?: string[] };
    target.__clipboardWrites = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          target.__clipboardWrites?.push(value);
        },
      },
    });
  });

  await page.goto("/connect?code=abcdefgh", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("ABCDEFGH", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => (window as typeof window & { __clipboardWrites?: string[] }).__clipboardWrites)).toEqual([]);
  await expect(page.getByText("Nothing is copied and nothing opens until you choose it.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open in luv app" })).toHaveAttribute("href", "luv://connect?code=ABCDEFGH");
  await expect(page.getByRole("link", { name: "Download on the App Store" })).toHaveAttribute("href", "https://apps.apple.com/app/id6763015481");
  await page.getByRole("button", { name: "Copy code" }).click();
  await expect(page.getByRole("button", { name: "Code copied" })).toBeVisible();
  expect(await page.evaluate(() => (window as typeof window & { __clipboardWrites?: string[] }).__clipboardWrites)).toEqual(["ABCDEFGH"]);

  for (const path of [
    "/c/ABCDEFGH#fragment",
    "/c/ABCDEFGH?extra=1",
    "/connect?code=ABCDEFGH&extra=1",
    "/connect?code=ABCD0FGH",
  ]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Invite not recognized" })).toBeVisible();
  }
  expect(externalRequests).toEqual([]);
});

test("password recovery is one-shot, memory-only, and uses the shared 8-character policy", async ({ page, context }) => {
  const mock = await installRecoveryMock(context);

  // Seed an old website token from a route that has not loaded the lazy Auth
  // client. Moving from / to /reset is a real document navigation in both
  // engines; a same-path hash navigation would correctly retain the singleton.
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate((legacyKey) => {
    localStorage.setItem(legacyKey, "stale-local-session");
    sessionStorage.setItem(`${legacyKey}-code-verifier`, "stale-verifier");
  }, LEGACY_AUTH_KEY);

  await page.goto(`/reset#${recoveryHash}`, { waitUntil: "domcontentloaded" });
  const password = page.locator("#reset-password");
  const confirmation = page.locator("#reset-confirm-password");
  await expect(password).toBeVisible();
  await expect(page).toHaveURL(`${BASE_ORIGIN}/reset`);
  await expectNoAuthArtifacts(page);

  await password.fill("aaaaaaa");
  await confirmation.fill("aaaaaaa");
  await page.getByRole("button", { name: "Update password" }).click();
  expect(await password.evaluate((input) => (input as HTMLInputElement).validity.tooShort)).toBe(true);
  expect(mock.submittedPasswords).toEqual([]);

  await password.fill("       A1");
  await confirmation.fill("       A1");
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByRole("alert")).toHaveText("Use at least 8 characters.");
  expect(mock.submittedPasswords).toEqual([]);

  const nonCompositionPassword = "!!!!!!!!";
  await password.fill(nonCompositionPassword);
  await confirmation.fill(nonCompositionPassword);
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByRole("status")).toContainText("recovery session was closed");
  expect(mock.submittedPasswords).toEqual([nonCompositionPassword]);
  await expectNoAuthArtifacts(page);
  expect(mock.unexpectedExternal).toEqual([]);
  expect(mock.unexpectedSupabase).toEqual([]);
});

test("sign-out failure still destroys the recovery session before showing success", async ({ page, context }) => {
  const mock = await installRecoveryMock(context, { failSignOut: true });
  await page.goto(`/reset#${recoveryHash}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#reset-password")).toBeVisible();
  await page.locator("#reset-password").fill("!!!!!!!!");
  await page.locator("#reset-confirm-password").fill("!!!!!!!!");
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByRole("status")).toContainText("browser no longer holds the recovery session");
  await expect(page).toHaveURL(`${BASE_ORIGIN}/reset`);
  await expectNoAuthArtifacts(page);
  expect(mock.submittedPasswords).toEqual(["!!!!!!!!"]);
  expect(mock.requests.some((request) => request.startsWith("POST /auth/v1/logout"))).toBe(true);
  expect(mock.unexpectedExternal).toEqual([]);
  expect(mock.unexpectedSupabase).toEqual([]);
});

test("an ambiguous password-update network failure invalidates the one-shot link", async ({ page, context }) => {
  const mock = await installRecoveryMock(context, { abortUpdate: true });
  await page.goto(`/reset#${recoveryHash}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#reset-password")).toBeVisible();
  await page.locator("#reset-password").fill("!!!!!!!!");
  await page.locator("#reset-confirm-password").fill("!!!!!!!!");
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByRole("heading", { name: "This reset link is not active" })).toBeVisible({ timeout: 15_000 });
  await expect(page).toHaveURL(`${BASE_ORIGIN}/reset`);
  await expectNoAuthArtifacts(page);
  expect(mock.submittedPasswords.length).toBeGreaterThan(0);
  expect(mock.unexpectedExternal).toEqual([]);
  expect(mock.unexpectedSupabase).toEqual([]);
});

test("failed server verification and unusable PKCE-shaped URLs fail closed", async ({ page, context }) => {
  const mock = await installRecoveryMock(context, { failComponentGetUser: true });
  await page.goto(`/reset#${recoveryHash}`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "This reset link is not active" })).toBeVisible({ timeout: 15_000 });
  await expect(page).toHaveURL(`${BASE_ORIGIN}/reset`);
  await expectNoAuthArtifacts(page);
  expect(mock.userGetCount).toBeGreaterThanOrEqual(2);

  const requestsBeforePKCE = mock.requests.length;
  await page.goto("/reset?code=not-a-usable-pkce-code&type=recovery", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "This reset link is not active" })).toBeVisible();
  expect(mock.requests.length).toBe(requestsBeforePKCE);
  expect(mock.unexpectedExternal).toEqual([]);
  expect(mock.unexpectedSupabase).toEqual([]);
});

test("Reduce Motion keeps content visible, removes the reset spinner animation, and preserves keyboard semantics", async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const mock = await installRecoveryMock(context, { userDelayMs: 700 });

  await page.goto(`/reset#${recoveryHash}`, { waitUntil: "domcontentloaded" });
  const verifying = page.getByText("Verifying reset link…");
  await expect(verifying).toBeVisible();
  const spinnerAnimation = await verifying.locator("xpath=preceding-sibling::div[1]").evaluate((element) => getComputedStyle(element).animationName);
  expect(spinnerAnimation).toBe("none");
  await expect(page.locator("#reset-password")).toBeVisible();

  await page.goto("/support", { waitUntil: "domcontentloaded" });
  const faqButton = page.getByRole("button", { name: "How do I connect with my partner?" });
  await faqButton.focus();
  await faqButton.press("Enter");
  const faqRegion = page.getByRole("region", { name: "How do I connect with my partner?" });
  await expect(faqRegion).toBeVisible();
  expect(await faqRegion.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  await faqButton.press("Space");
  await expect(faqRegion).toHaveCount(0);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  const privacyLink = page.getByRole("link", { name: "privacy", exact: true });
  await privacyLink.focus();
  const focusStyle = await privacyLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(focusStyle.outlineStyle).toBe("solid");
  expect(focusStyle.outlineWidth).toBe("2px");
  expect(mock.unexpectedExternal).toEqual([]);
  expect(mock.unexpectedSupabase).toEqual([]);
});

test("mobile and desktop routes have no horizontal overflow", async ({ page, context }) => {
  const externalRequests = await installExternalGuard(context);
  const paths = ["/", "/how-it-works", "/privacy", "/terms", "/support", "/connect?code=ABCDEFGH", "/forgot", "/reset", "/missing"];

  for (const viewport of [{ width: 320, height: 568 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const path of paths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main")).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} at ${viewport.width}px`).toBeLessThanOrEqual(1);
    }
  }
  expect(externalRequests).toEqual([]);
});
