import { Link } from "react-router-dom";
import "../../styles/cinematic.css";

export function NotFound() {
  return (
    <main className="cinematic-theme relative min-h-screen overflow-hidden px-6 py-20 text-[#fbf1c7]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{ background: "rgba(211,134,155,0.09)" }}
      />
      <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] max-w-xl flex-col items-center justify-center text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#d3869b]">404 · note misplaced</span>
        <h1 className="text-silver-matte mt-6 text-5xl font-black tracking-tight md:text-7xl">Not here.</h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#a89984]">
          This link does not point to a Luv page. If it was an invite, ask your person to share a fresh connection link.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link to="/" className="btn-modern-light rounded-[1.15rem] px-7 py-3.5 text-sm font-semibold">
            Return to luv
          </Link>
          <Link to="/support" className="btn-modern-dark rounded-[1.15rem] px-7 py-3.5 text-sm font-semibold">
            Get support
          </Link>
        </div>
      </div>
    </main>
  );
}
