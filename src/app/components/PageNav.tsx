import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

export function PageNav() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.nav
      aria-label="Primary"
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#ebdbb2]/[0.06] bg-[#1f1b18]/92 backdrop-blur-xl"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="rounded-sm font-mono text-lg lowercase tracking-[0.18em] text-[#fbf1c7] hover:text-[#d3869b] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3869b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1b18]">
            luv
          </Link>
          <Link
            to="/"
            className="relative rounded-sm text-xs text-[#928374] hover:text-[#ebdbb2] transition-colors group font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3869b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1b18]"
          >
            ← Home
            <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#ebdbb2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
