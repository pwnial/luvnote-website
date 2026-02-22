import { Link } from "react-router-dom";

export function PageNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/heart-love-gruvbox.gif" alt="Luv" className="w-20 h-20" style={{ imageRendering: "pixelated" as const }} />
          </Link>
          <Link
            to="/"
            className="text-xs text-[#928374] hover:text-[#ebdbb2] transition-colors"
          >
            ← Home
          </Link>
        </div>
      </div>
    </nav>
  );
}
