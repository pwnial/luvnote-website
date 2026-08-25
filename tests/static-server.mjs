import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootFlag = process.argv.indexOf("--root");
const root = rootFlag >= 0
  ? resolve(process.argv[rootFlag + 1])
  : fileURLToPath(new URL("../dist/", import.meta.url));
const portFlag = process.argv.indexOf("--port");
const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : 4177);
const spaFallback = process.argv.includes("--spa");
const connectOriginFlag = process.argv.indexOf("--connect-origin");
const connectOrigin = connectOriginFlag >= 0
  ? process.argv[connectOriginFlag + 1]
  : "https://fkfyhsbhsobxmiiidtrn.supabase.co";

if (connectOriginFlag >= 0 && connectOrigin !== "http://127.0.0.1:57321") {
  throw new Error("The test server accepts only the guarded visual-audit Auth origin");
}

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
]);

const securityHeaders = {
  // Production's Vercel header also adds upgrade-insecure-requests. Omit only
  // that directive on this HTTP loopback server: WebKit would otherwise
  // upgrade the test assets to HTTPS and test a blank page, not the app.
  "Content-Security-Policy": `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' ${connectOrigin}${connectOrigin.startsWith("https:") ? ` ${connectOrigin.replace("https:", "wss:")}` : ""}`,
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000",
};

const routeFiles = new Map([
  ["/", "index.html"],
  ["/how-it-works", "how-it-works.html"],
  ["/privacy", "privacy.html"],
  ["/terms", "terms.html"],
  ["/support", "support.html"],
  ["/connect", "connect.html"],
  ["/forgot", "forgot.html"],
  ["/reset", "reset.html"],
]);

function resolveRequest(pathname) {
  if (routeFiles.has(pathname)) return { file: spaFallback ? "index.html" : routeFiles.get(pathname), status: 200 };
  if (/^\/c\/[^/]+$/.test(pathname)) return { file: spaFallback ? "index.html" : "connect.html", status: 200 };
  if (pathname === "/.well-known/apple-app-site-association") {
    return { file: ".well-known/apple-app-site-association", status: 200, type: "application/json; charset=utf-8" };
  }

  const filePath = normalize(pathname).replace(/^\/+/, "");
  if (filePath.startsWith("assets/") || /^(?:apple-touch-icon|favicon(?:-[^/]+)?|heart-love-gruvbox|icon-[^/]+)\.(?:png|gif|ico)$/.test(filePath)) {
    return { file: filePath, status: 200 };
  }
  return { file: "404.html", status: 404 };
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  if (url.pathname === "/cinematic" || url.pathname === "/old") {
    response.writeHead(308, { ...securityHeaders, Location: "/" });
    response.end();
    return;
  }

  const resolved = resolveRequest(url.pathname);
  try {
    const body = await readFile(join(root, resolved.file));
    response.writeHead(resolved.status, {
      ...securityHeaders,
      "Content-Type": resolved.type ?? contentTypes.get(extname(resolved.file)) ?? "application/octet-stream",
    });
    response.end(body);
  } catch {
    const body = await readFile(join(root, "404.html"));
    response.writeHead(404, { ...securityHeaders, "Content-Type": "text/html; charset=utf-8" });
    response.end(body);
  }
});

server.listen(port, "127.0.0.1");

function close() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
