import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/app/id6763015481";
const APP_OPEN_TIMEOUT_MS = 2500;

export function Connect() {
  const [searchParams] = useSearchParams();
  const code = (searchParams.get("code") ?? "").toUpperCase().trim();

  const [copied, setCopied] = useState(false);
  const [stage, setStage] = useState<"trying-app" | "fallback">("fallback");

  useEffect(() => {
    if (!code) return;

    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isIOS) return;

    setStage("trying-app");

    // Attempt to open the iOS app via custom URL scheme.
    // If the app is installed, iOS handles `luv://` and the page goes to background.
    // If not, the page stays foreground and the timer below redirects to the App Store.
    window.location.href = `luv://connect?code=${encodeURIComponent(code)}`;

    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        // Page never went to background → app didn't open → send them to install it.
        window.location.href = APP_STORE_URL;
      }
    }, APP_OPEN_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [code]);

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — user can still type the code manually.
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
      className="text-white min-h-screen font-mono relative"
    >
      <div className="fixed inset-0 z-0 bg-[#282828]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-md w-full text-center"
        >
          <img
            src="/heart-love-gruvbox.gif"
            alt=""
            className="w-20 h-20 mx-auto mb-8"
            style={{ imageRendering: "pixelated" }}
          />

          <h1 className="text-3xl md:text-4xl text-[#ebdbb2] mb-3 leading-tight">
            {stage === "trying-app" ? "Opening luv…" : "Connect on luv"}
          </h1>

          {stage === "trying-app" ? (
            <p className="text-sm text-[#928374] mb-10 leading-relaxed">
              If the app doesn't open, we'll send you to the App Store.
            </p>
          ) : (
            <p className="text-sm text-[#a89984] mb-10 leading-relaxed">
              {code
                ? "Get the app and enter this code to connect:"
                : "Get the app to start sending love notes."}
            </p>
          )}

          {code && (
            <button
              onClick={copyCode}
              className="w-full mb-6 px-6 py-5 bg-[#3c3836] border border-[#504945] rounded-2xl flex items-center justify-between gap-4 hover:border-[#ebdbb2]/30 transition-colors group"
              aria-label="Copy connection code"
            >
              <span className="text-2xl tracking-[0.35em] text-[#ebdbb2]">
                {code}
              </span>
              {copied ? (
                <span className="text-xs text-[#b8bb26] flex items-center gap-2 whitespace-nowrap">
                  <Check className="w-4 h-4" /> Copied
                </span>
              ) : (
                <span className="text-xs text-[#928374] flex items-center gap-2 whitespace-nowrap group-hover:text-[#a89984] transition-colors">
                  <Copy className="w-4 h-4" /> Copy
                </span>
              )}
            </button>
          )}

          {code && (
            <button
              onClick={manualOpenApp}
              className="w-full mb-4 px-6 py-3 bg-[#b8bb26] text-[#282828] text-sm rounded-xl hover:bg-[#98971a] transition-colors font-medium"
            >
              Open in luv app
            </button>
          )}

          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2"
          >
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on the App Store"
              className="h-12"
            />
          </a>

          <div className="mt-12 text-xs text-[#928374]">
            iOS 18.5+ · Free · No ads
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
