import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicSourceExtensions = new Set([".html", ".ts", ".tsx"]);

function collectPublicSources(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(path, entry.name);
    if (entry.isDirectory()) return collectPublicSources(fullPath);
    return publicSourceExtensions.has(extname(entry.name)) ? [fullPath] : [];
  });
}

const files = [join(root, "index.html"), ...collectPublicSources(join(root, "src"))];
const failures = [];

const prohibitedClaims = [
  { label: "unsupported end-to-end encryption claim", pattern: /end[ -]?to[ -]?end encrypt|\be2ee\b/i },
  { label: "unsupported claim that the service cannot read notes", pattern: /\b(?:we|luv)(?:\s+service)?\s+(?:can(?:no|'|’)?t|cannot)\s+read\b/i },
  { label: "unsupported couple-only readability claim", pattern: /\bonly (?:be )?read(?:able)? by (?:you|your partner)\b/i },
  { label: "unsupported on-device-only encryption claim", pattern: /encrypt(?:ed|ion)?[^.\n]{0,80}(?:on|before leaving) (?:the |your )?(?:device|phone)/i },
  { label: "stale luv.app email address", pattern: /[a-z0-9._%+-]+@luv\.app\b/i },
  { label: "stale advertising SDK disclosure", pattern: /\b(?:TikTok|Facebook|Meta)\b/ },
  { label: "stale advertising identifier or ATT prompt disclosure", pattern: /\b(?:IDFA|ATT)\b|Advertising Identifier|App Tracking Transparency prompt/i },
  { label: "unsupported no-tracking marketing claim", pattern: /\bno tracking\b/i },
];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const rule of prohibitedClaims) {
    if (rule.pattern.test(source)) {
      failures.push(`${relative(root, file)}: ${rule.label}`);
    }
  }
}

const privacyPath = join(root, "src/app/components/Privacy.tsx");
const privacy = readFileSync(privacyPath, "utf8");
const requiredPrivacyFacts = [
  "encrypted in transit and at rest",
  "processes and stores note content",
  "Supabase",
  "Apple",
  "PostHog",
  "does not include advertising SDKs",
  "does not request tracking permission",
  "do not send note content to analytics providers or advertising networks",
  "support@luvnote.app",
];

for (const fact of requiredPrivacyFacts) {
  if (!privacy.includes(fact)) {
    failures.push(`src/app/components/Privacy.tsx: missing required disclosure: ${fact}`);
  }
}

if (failures.length > 0) {
  console.error("Release-trust contract failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Release-trust contract passed across ${files.length} public source files.`);
