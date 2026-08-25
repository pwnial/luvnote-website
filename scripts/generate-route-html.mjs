import { readFile, writeFile } from "node:fs/promises";

const DIST_INDEX = new URL("../dist/index.html", import.meta.url);
const METADATA_FILE = new URL("../src/app/route-metadata.json", import.meta.url);
const SITE_ORIGIN = "https://luvnote.app";

const outputFiles = {
  "/how-it-works": "how-it-works.html",
  "/privacy": "privacy.html",
  "/terms": "terms.html",
  "/support": "support.html",
  "/connect": "connect.html",
  "/forgot": "forgot.html",
  "/reset": "reset.html",
  "__not_found__": "404.html",
};

const escapeHTML = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Could not find ${label} in dist/index.html`);
  return html.replace(pattern, replacement);
}

function replaceMeta(html, attribute, key, content) {
  const pattern = new RegExp(`<meta ${attribute}="${key}" content="[^"]*" \\/>`);
  return replaceRequired(
    html,
    pattern,
    `<meta ${attribute}="${key}" content="${escapeHTML(content)}" />`,
    `${attribute} metadata for ${key}`,
  );
}

function renderRouteHTML(baseHTML, metadata) {
  let html = replaceRequired(
    baseHTML,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHTML(metadata.title)}</title>`,
    "document title",
  );
  html = replaceMeta(html, "name", "description", metadata.description);
  html = replaceMeta(html, "name", "robots", metadata.robots);
  html = replaceMeta(html, "property", "og:title", metadata.title);
  html = replaceMeta(html, "property", "og:description", metadata.description);
  html = replaceMeta(html, "name", "twitter:title", metadata.title);
  html = replaceMeta(html, "name", "twitter:description", metadata.description);

  if (metadata.canonicalPath) {
    const canonical = `${SITE_ORIGIN}${metadata.canonicalPath}`;
    html = replaceRequired(
      html,
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${canonical}" />`,
      "canonical link",
    );
    html = replaceMeta(html, "property", "og:url", canonical);
  } else {
    html = replaceRequired(html, /^\s*<link rel="canonical"[^>]*>\s*$/m, "", "canonical link");
    html = replaceRequired(html, /^\s*<meta property="og:url"[^>]*>\s*$/m, "", "Open Graph URL");
  }

  return html;
}

const [baseHTML, rawMetadata] = await Promise.all([
  readFile(DIST_INDEX, "utf8"),
  readFile(METADATA_FILE, "utf8"),
]);
const metadata = JSON.parse(rawMetadata);

for (const [route, filename] of Object.entries(outputFiles)) {
  if (!metadata[route]) throw new Error(`Missing metadata for ${route}`);
  const output = new URL(`../dist/${filename}`, import.meta.url);
  await writeFile(output, renderRouteHTML(baseHTML, metadata[route]), "utf8");
}

console.log(`Generated ${Object.keys(outputFiles).length} route-specific HTML files.`);
