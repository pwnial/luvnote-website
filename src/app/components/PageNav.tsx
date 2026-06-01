import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function PageNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/heart-love-gruvbox.gif" alt="Luv" className="w-20 h-20" style={{ imageRendering: "pixelated" as const }} />
          </Link>
          <Link
            to="/"
            className="relative text-xs text-[#928374] hover:text-[#ebdbb2] transition-colors group"
          >
            ← Home
            <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#ebdbb2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
