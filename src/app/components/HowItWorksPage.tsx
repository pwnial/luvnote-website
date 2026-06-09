import "../../styles/cinematic.css";
import { Link } from "react-router-dom";
import { HowItWorksFilm } from "./revamp/HowItWorksFilm";

export function HowItWorksPage() {
  return (
    <div className="cinematic-theme">
      <Link
        to="/cinematic"
        aria-label="Back to luv"
        className="fixed top-5 left-6 z-[60] font-mono text-sm lowercase text-[#ebdbb2]/55 hover:text-[#fbf1c7] transition-colors"
      >
        ← luv
      </Link>
      <HowItWorksFilm />
    </div>
  );
}
