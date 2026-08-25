import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function ClosingSection() {
  const reduce = useReducedMotion();

  const containerV = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.05 } },
  };
  const itemV = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 40, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  return (
    <section className="relative py-28 md:py-32 px-6 overflow-hidden">
      {/* ambient layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 right-0">
          <div className="cinematic-divider max-w-[600px] mx-auto" />
        </div>
        <div className="absolute inset-0 bg-grid-theme opacity-[0.4]" />
        <div
          className={reduce ? "absolute inset-0" : "absolute inset-0 luv-closing-glow"}
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 38%, rgba(211,134,155,0.18), rgba(211,134,155,0.05) 45%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 film-grain opacity-60" />
      </div>

      {/* CTA block */}
      <motion.div
        variants={containerV}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12%" }}
        className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center text-center gap-7 pt-10"
      >
        {/* eyebrow */}
        <motion.div
          variants={itemV}
          className="font-mono text-[11px] tracking-[0.35em] uppercase text-rose-matte/90 flex items-center gap-2"
        >
          <motion.span
            animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
            transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <Heart size={12} className="text-[#d3869b] fill-[#d3869b]/30" />
          </motion.span>
          One last thing
        </motion.div>

        {/* heading */}
        <motion.h2
          variants={itemV}
          className="text-silver-matte font-black tracking-tighter leading-[0.95] text-5xl sm:text-6xl md:text-7xl max-w-[15ch]"
        >
          Say it on their <span className="text-rose-matte">lock screen.</span>
        </motion.h2>

        {/* subcopy */}
        <motion.p
          variants={itemV}
          className="text-[#ebdbb2]/85 text-lg md:text-xl leading-relaxed max-w-[44ch]"
        >
          Free to download. No ads. Optional Premium.{" "}
          <span className="text-[#fbf1c7]">Just you two.</span>
        </motion.p>

        {/* primary button */}
        <motion.div
          variants={itemV}
          whileHover={reduce ? undefined : { y: -3, scale: 1.02 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="mt-2"
        >
          <a
            href="https://apps.apple.com/app/id6763015481"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-modern-light px-8 py-4 rounded-[1.25rem] inline-flex items-center gap-3 group"
          >
            <svg viewBox="0 0 384 512" className="w-7 h-7 shrink-0" aria-hidden="true" fill="currentColor">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            <span className="flex flex-col items-start leading-none text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">Download on the</span>
              <span className="text-[17px] font-semibold -mt-0.5 tracking-tight">App Store</span>
            </span>
          </a>
        </motion.div>

        {/* trust line */}
        <motion.p
          variants={itemV}
          className="font-mono text-[11px] md:text-xs tracking-[0.18em] text-[#a89984] uppercase mt-1"
        >
          iOS 18.5+ · Free to start · No ads · Notes stored for delivery
        </motion.p>
      </motion.div>

      {/* footer */}
      <motion.footer
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 max-w-[1200px] mx-auto mt-28 md:mt-32"
      >
        <div className="cinematic-divider max-w-[1200px] mx-auto mb-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* brand */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#fbf1c7] shadow-[0_0_10px_rgba(251,241,199,0.5)]" />
            <span className="font-mono text-sm tracking-wide text-[#ebdbb2]">luvnote.app</span>
          </div>

          {/* nav */}
          <nav className="flex items-center gap-7 font-mono text-[13px] tracking-wide">
            <Link
              to="/privacy"
              className="relative text-[#a89984] hover:text-[#fbf1c7] transition-colors duration-300 group"
            >
              privacy
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#d3869b] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/terms"
              className="relative text-[#a89984] hover:text-[#fbf1c7] transition-colors duration-300 group"
            >
              terms
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#d3869b] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/support"
              className="relative text-[#a89984] hover:text-[#fbf1c7] transition-colors duration-300 group"
            >
              support
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#d3869b] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>
        </div>

        {/* micro line */}
        <p className="mt-10 text-center font-mono text-[11px] tracking-[0.15em] text-[#928374] uppercase">
          built with{" "}
          <span className="text-[#d3869b]">love</span> by one dev in New York
        </p>
      </motion.footer>

      {/* scoped glow keyframes */}
      <style>{`
        @keyframes luvClosingBreathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.04); }
        }
        .luv-closing-glow {
          animation: luvClosingBreathe 7s ease-in-out infinite;
          will-change: opacity, transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .luv-closing-glow { animation: none; opacity: 1; }
        }
      `}</style>
    </section>
  );
}
