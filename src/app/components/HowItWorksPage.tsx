import "../../styles/cinematic.css";
import { Link } from "react-router-dom";
import { HowItWorksFilm } from "./revamp/HowItWorksFilm";

export function HowItWorksPage() {
  return (
    <main className="cinematic-theme">
      <h1 className="sr-only">How Luv works</h1>
      <Link
        to="/"
        aria-label="Back to luv"
        className="fixed top-5 left-6 z-[60] rounded-sm font-mono text-sm lowercase text-[#ebdbb2]/55 hover:text-[#fbf1c7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3869b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1b18]"
      >
        ← luv
      </Link>
      <HowItWorksFilm />
    </main>
  );
}
