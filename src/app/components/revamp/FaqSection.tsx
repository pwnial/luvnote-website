import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Plus } from "lucide-react";

const FAQS = [
  {
    q: "How does the widget update work?",
    a: "Luv stores the note, then requests a silent background refresh on your partner's iPhone. Apple and iOS control background delivery and widget scheduling, so the update may be delayed until the app or widget refreshes.",
  },
  {
    q: "How are notes protected?",
    a: "Notes are encrypted in transit and stored in Supabase so Luv can deliver them. They are not end-to-end encrypted, which means Luv's backend and authorized service providers can technically process stored note content.",
  },
  {
    q: "Does it work with Android?",
    a: "No. Luv currently requires an iPhone running iOS 18.5 or later.",
  },
  {
    q: "How much does it cost?",
    a: "Luv is free to download and includes limited note sending. Premium is offered through Weekly and Monthly subscriptions or a one-time Lifetime purchase, and unlocks unlimited daily notes, shared streaks, and scheduled surprises. Apple shows the exact price and any eligible trial before purchase.",
  },
  {
    q: "Can I connect with more than one person?",
    a: "Luv is designed for couples — one connection at a time. This keeps the experience intimate and focused on your relationship.",
  },
  {
    q: "What if we both send at the same time?",
    a: "Both notes can be stored at the same time. Each person's app or widget will show the latest note it successfully retrieves on its next refresh.",
  },
];

const EASE = [0.25, 0.1, 0.25, 1] as const;
const BACK_OUT = [0.34, 1.56, 0.64, 1] as const;

export function FaqSection() {
  const [reduced, setReduced] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // Single reveal helper so every animated block reads from one source of truth.
  const reveal = (delay = 0, y = 40, blur = 8) =>
    reduced
      ? {
          initial: false as const,
        }
      : {
          initial: { opacity: 0, y, filter: `blur(${blur}px)` },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, margin: "-12%" },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  const rowReveal = (i: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 28, filter: "blur(8px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, margin: "-10%" },
          transition: { duration: 0.7, ease: EASE, delay: i * 0.07 },
        };

  const dividerAnim = reduced
    ? { initial: false as const }
    : {
        initial: { opacity: 0, scaleX: 0 },
        whileInView: { opacity: 1, scaleX: 1 },
        viewport: { once: true, margin: "-12%" },
        transition: { duration: 0.9, ease: EASE, delay: 0.1 },
      };

  return (
    <section className="relative py-28 md:py-32 px-6">
      {/* Background texture layers */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-theme opacity-[0.35]" />
        <div className="film-grain absolute inset-0" />
        <div
          className="absolute left-1/2 top-[14%] -translate-x-1/2 w-[640px] h-[640px] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, #d3869b 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* HEADER */}
        <motion.div {...reveal(0)}>
          <div className="flex items-center justify-center gap-2 mb-5">
            <HelpCircle className="w-3.5 h-3.5 text-[#d3869b]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#a89984]">
              Support
            </span>
          </div>
          <h2 className="text-silver-matte text-center text-4xl md:text-6xl font-bold tracking-tighter leading-[1.04]">
            Common questions
          </h2>
          <p className="text-center text-[#928374] text-base md:text-lg max-w-[440px] mx-auto leading-relaxed mt-5">
            Everything you need to know before you and your person start.
          </p>
        </motion.div>

        <motion.div
          className="cinematic-divider max-w-[600px] mx-auto mt-10"
          style={{ transformOrigin: "center" }}
          {...dividerAnim}
        />

        {/* ACCORDION */}
        <div className="max-w-[800px] mx-auto mt-16 md:mt-20">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            return (
              <motion.div
                key={item.q}
                {...rowReveal(i)}
                className={`border-b border-[rgba(235,219,178,0.1)]${
                  i === 0 ? " border-t border-[rgba(235,219,178,0.1)]" : ""
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group w-full flex items-center justify-between gap-6 text-left py-7 md:py-8"
                >
                  <span className="text-[#fbf1c7] text-lg md:text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-[#d3869b]">
                    {item.q}
                  </span>
                  <span className="shrink-0 grid place-items-center w-9 h-9 rounded-full border border-[rgba(235,219,178,0.12)] transition-colors duration-300 group-hover:border-[#d3869b]/40 group-hover:bg-[#d3869b]/[0.06]">
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: BACK_OUT }}
                      className="grid place-items-center"
                    >
                      <Plus className="w-4 h-4 text-[#a89984] transition-colors duration-300 group-hover:text-[#d3869b]" />
                    </motion.span>
                  </span>
                </button>

                {reduced ? (
                  isOpen && (
                    <p
                      id={panelId}
                      role="region"
                      className="text-[#a89984] text-base md:text-[1.0625rem] leading-relaxed pb-8 pr-12 md:pr-16 max-w-[640px]"
                    >
                      {item.a}
                    </p>
                  )
                ) : (
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        id={panelId}
                        role="region"
                        initial={{ height: 0, opacity: 0, filter: "blur(6px)" }}
                        animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                        exit={{ height: 0, opacity: 0, filter: "blur(6px)" }}
                        transition={{ duration: 0.5, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <motion.p
                          initial={{ y: 8 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
                          className="text-[#a89984] text-base md:text-[1.0625rem] leading-relaxed pb-8 pr-12 md:pr-16 max-w-[640px]"
                        >
                          {item.a}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM FLOURISH — closing CTA */}
        <motion.div className="mt-16 md:mt-20" {...reveal(0.1)}>
          <div className="widget-depth cinematic-float rounded-[1.5rem] px-8 py-7 max-w-[560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="text-center sm:text-left">
              <p className="text-[#fbf1c7] font-medium text-base md:text-lg tracking-tight">
                Still have a question?
              </p>
              <p className="text-[#928374] text-sm mt-1">Email our support team.</p>
            </div>
            <motion.a
              href="mailto:support@luvnote.app"
              className="btn-modern-dark px-8 py-4 rounded-[1.25rem] whitespace-nowrap text-sm font-medium"
              whileHover={reduced ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Get in touch
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
