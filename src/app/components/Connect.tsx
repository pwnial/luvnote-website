import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import "../../styles/cinematic.css";

const APP_STORE_URL = "https://apps.apple.com/app/id6763015481";
const INVITE_CODE_PATTERN = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/;

function normalizedInviteCode(raw: string | null | undefined) {
  const candidate = (raw ?? "").trim().toUpperCase();
  return INVITE_CODE_PATTERN.test(candidate) ? candidate : null;
}

export function Connect() {
  const { code: pathCode } = useParams<{ code?: string }>();
  const [searchParams] = useSearchParams();
  const queryEntries = Array.from(searchParams.entries());
  const isPathInvite = pathCode !== undefined;
  const hasValidInviteShape = isPathInvite
    ? queryEntries.length === 0
    : queryEntries.length === 0
      || (queryEntries.length === 1 && queryEntries[0][0] === "code");
  const rawCode = pathCode ?? (queryEntries.length === 1 && queryEntries[0][0] === "code" ? queryEntries[0][1] : "");
  const code = normalizedInviteCode(rawCode);
  const hasInvalidCode = !hasValidInviteShape || (rawCode.trim().length > 0 && code === null);

  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function copyCode() {
    if (!code) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const copyField = document.createElement("textarea");
        copyField.value = code;
        copyField.setAttribute("readonly", "");
        copyField.style.position = "fixed";
        copyField.style.opacity = "0";
        document.body.appendChild(copyField);
        copyField.select();
        const copied = document.execCommand("copy");
        copyField.remove();
        if (!copied) throw new Error("Clipboard copy was blocked");
      }
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("failed");
    }
  }

  function manualOpenApp() {
    if (!code) return;
    window.location.href = `luv://connect?code=${encodeURIComponent(code)}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="cinematic-theme min-h-screen relative overflow-hidden"
    >
      {/* Soft rose radial glow behind the title */}
      <div
        className="pointer-events-none fixed left-1/2 top-[28%] z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{ background: "rgba(211,134,155,0.09)" }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Clean back-link — text wordmark, no gif */}
        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute top-8 left-6 font-mono text-[12px] lowercase tracking-wide text-[#ebdbb2]/45 hover:text-[#fbf1c7] transition-colors"
        >
          ← luv
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-md w-full text-center"
        >
          <h1 className="font-sans font-black tracking-tight text-4xl md:text-5xl leading-[1.05] mb-4 text-silver-matte">
            {hasInvalidCode ? "Invite not recognized" : "Connect on luv"}
          </h1>

          <p className="text-[15px] text-[#ebdbb2]/70 mb-9 leading-relaxed max-w-sm mx-auto">
            {hasInvalidCode
              ? "This link does not contain a valid eight-character Luv code. Ask your person to share a fresh invite from the app."
              : code
                ? "Keep this code with you while you open or install Luv. Nothing is copied and nothing opens until you choose it."
                : "Get the app to start sending quiet love notes to your connected person."}
          </p>

          {code && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="surface-panel w-full mb-5 px-6 py-6 rounded-3xl"
            >
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-[#928374]">Your connection code</span>
              <span className="block select-all font-sans font-bold text-3xl md:text-4xl tracking-[0.25em] text-[#fbf1c7]" aria-label={`Connection code ${code.split("").join(" ")}`}>
                {code}
              </span>
            </motion.div>
          )}

          {code && (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
              onClick={copyCode}
              className="btn-modern-dark w-full mb-3 px-8 py-4 rounded-[1.25rem] text-[15px] font-medium flex items-center justify-center gap-2"
              aria-describedby="invite-copy-status"
            >
              {copyState === "copied" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copyState === "copied" ? "Code copied" : "Copy code"}
            </motion.button>
          )}

          {code && (
            <p id="invite-copy-status" aria-live="polite" className="mb-5 min-h-5 text-xs leading-relaxed text-[#928374]">
              {copyState === "failed"
                ? "Clipboard access was blocked. Press and hold the code above to copy it."
                : copyState === "copied"
                  ? "Copied. In Luv, tap Paste Code when the app asks for your invite."
                  : "Luv reads a copied code only after you tap Paste Code in the app."}
            </p>
          )}

          {code && (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={manualOpenApp}
              className="btn-modern-light w-full mb-4 px-8 py-4 rounded-[1.25rem] text-[15px] font-semibold"
            >
              Open in luv app
            </motion.button>
          )}

          {/* App Store is an explicit choice. Invite codes survive visually on
              this page; the app itself only reads the clipboard after Paste. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.26 }}
          >
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={code
                ? "inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-[1.15rem] border border-[#ebdbb2]/15 text-[#ebdbb2] hover:border-[#d3869b]/40 transition-colors"
                : "btn-modern-light inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem]"}
              aria-label="Download on the App Store"
            >
              <svg
                viewBox="0 0 384 512"
                className="w-7 h-7 shrink-0"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              <span className="flex flex-col items-start leading-none text-left">
                <span className="font-mono text-[10px] uppercase tracking-wide opacity-70">
                  Download on the
                </span>
                <span className="font-sans font-bold text-lg tracking-tight">
                  {code ? "Install luv" : "App Store"}
                </span>
              </span>
            </a>
          </motion.div>

          <div className="cinematic-divider max-w-[600px] mx-auto mt-12 mb-6" />

          <div className="font-mono text-[11px] uppercase tracking-wide text-[#928374]">
            iOS 18.5+ · Free to start · No in-app ads
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
