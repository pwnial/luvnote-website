import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "motion/react";
import { RouteMeta } from "./RouteMeta";
import { NotFound } from "./components/NotFound";

const CinematicHero = lazy(() =>
  import("./components/CinematicHero").then(({ CinematicHero }) => ({ default: CinematicHero }))
);
const Privacy = lazy(() => import("./components/Privacy").then(({ Privacy }) => ({ default: Privacy })));
const Terms = lazy(() => import("./components/Terms").then(({ Terms }) => ({ default: Terms })));
const Support = lazy(() => import("./components/Support").then(({ Support }) => ({ default: Support })));
const Connect = lazy(() => import("./components/Connect").then(({ Connect }) => ({ default: Connect })));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const HowItWorksPage = lazy(() =>
  import("./components/HowItWorksPage").then(({ HowItWorksPage }) => ({ default: HowItWorksPage }))
);

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <RouteMeta />
      <Suspense
        fallback={
          <div
            className="min-h-screen w-full bg-[#1f1b18]"
            role="status"
            aria-live="polite"
            aria-label="Loading page"
          />
        }
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <main className="min-h-screen w-full overflow-x-hidden">
                  <CinematicHero howItWorksHref="/how-it-works" />
                </main>
              }
            />
            <Route path="/cinematic" element={<Navigate to="/" replace />} />
            <Route path="/old" element={<Navigate to="/" replace />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/support" element={<Support />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/c/:code" element={<Connect />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </MotionConfig>
  );
}
