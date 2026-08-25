import { lazy, Suspense, useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Download, ChevronDown, Zap, Lock } from "lucide-react";
import { PhoneWidget } from "./components/PhoneWidget";
import { HeroPhones } from "./components/HeroPhones";
import { AnimatedSection } from "./components/AnimatedSection";
import { CinematicHero } from "./components/CinematicHero";

const Privacy = lazy(() => import("./components/Privacy").then(({ Privacy }) => ({ default: Privacy })));
const Terms = lazy(() => import("./components/Terms").then(({ Terms }) => ({ default: Terms })));
const Support = lazy(() => import("./components/Support").then(({ Support }) => ({ default: Support })));
const Connect = lazy(() => import("./components/Connect").then(({ Connect }) => ({ default: Connect })));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const HowItWorksPage = lazy(() =>
  import("./components/HowItWorksPage").then(({ HowItWorksPage }) => ({ default: HowItWorksPage }))
);

const INTRO_SESSION_KEY = "luv-intro-played";

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Intro animation state. Skip the splash on repeat visits within the same
  // session — handleMoveComplete already writes INTRO_SESSION_KEY, we just
  // needed to actually read it on mount.
  const [alreadyPlayed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  });
  const [introPhase, setIntroPhase] = useState<"splash" | "moving" | "done">(
    alreadyPlayed ? "done" : "splash"
  );
  const navHeartRef = useRef<HTMLDivElement>(null);
  const [navHeartRect, setNavHeartRect] = useState<{ x: number; y: number } | null>(null);

  const startTransition = useCallback(() => {
    // Measure where the nav heart lives
    if (navHeartRef.current) {
      const rect = navHeartRef.current.getBoundingClientRect();
      setNavHeartRect({ x: rect.left, y: rect.top });
    } else {
      // Fallback estimate: max-w-1200 centered, px-6 py-4
      const containerLeft = Math.max((window.innerWidth - 1200) / 2, 0) + 24;
      setNavHeartRect({ x: containerLeft, y: 16 });
    }
    setIntroPhase("moving");
  }, []);

  useEffect(() => {
    if (alreadyPlayed) return;
    const timer = setTimeout(startTransition, 1800);
    return () => clearTimeout(timer);
  }, [alreadyPlayed, startTransition]);

  const handleMoveComplete = useCallback(() => {
    setIntroPhase("done");
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  }, []);

  const introComplete = introPhase === "done";
  const isMoving = introPhase === "moving";

  const faqs = [
    {
      question: "How does the widget update work?",
      answer: "Luv stores the note, then requests a silent background refresh on your partner's iPhone. Apple and iOS control background delivery and widget scheduling, so the update may be delayed until the app or widget refreshes."
    },
    {
      question: "How are notes protected?",
      answer: "Notes are encrypted in transit and stored in Supabase so Luv can deliver them. They are not end-to-end encrypted, which means Luv's backend and authorized service providers can technically process stored note content."
    },
    {
      question: "Does it work with Android?",
      answer: "No. Luv currently requires an iPhone running iOS 18.5 or later."
    },
    {
      question: "How much does it cost?",
      answer: "Luv is free to download and includes limited note sending. Premium is offered through Weekly and Monthly subscriptions or a one-time Lifetime purchase; Apple shows the exact price and any eligible trial before purchase."
    },
    {
      question: "Can I connect with more than one person?",
      answer: "Currently, Luv is designed for couples - one connection at a time. This keeps the experience intimate and focused on your relationship."
    },
    {
      question: "What if we both send messages at the same time?",
      answer: "Both notes can be stored at the same time. Each person's app or widget shows the latest note it successfully retrieves on its next refresh."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="text-white min-h-screen font-mono relative overflow-x-hidden w-full"
    >
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-[#282828]" />


      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center">
            <div ref={navHeartRef} className="flex items-center">
              <img
                src="/heart-love-gruvbox.gif"
                alt="Luv"
                className="w-20 h-20"
                style={{
                  imageRendering: "pixelated",
                  opacity: introComplete ? 1 : 0,
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Splash intro overlay */}
      <AnimatePresence>
        {!introComplete && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#282828]"
            animate={{
              opacity: isMoving ? 0 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ pointerEvents: isMoving ? "none" : "auto" }}
          />
        )}
      </AnimatePresence>

      {/* Animated splash heart */}
      <AnimatePresence onExitComplete={handleMoveComplete}>
        {!introComplete && (
          <motion.img
            src="/heart-love-gruvbox.gif"
            alt=""
            className="fixed z-[101]"
            style={{ imageRendering: "pixelated" }}
            initial={{
              opacity: 0,
              width: 200,
              height: 200,
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
            }}
            animate={
              isMoving && navHeartRect
                ? {
                    opacity: 1,
                    width: 80,
                    height: 80,
                    top: navHeartRect.y,
                    left: navHeartRect.x,
                    x: "0%",
                    y: "0%",
                  }
                : {
                    opacity: 1,
                    width: 200,
                    height: 200,
                    top: "50%",
                    left: "50%",
                    x: "-50%",
                    y: "-50%",
                  }
            }
            exit={{ opacity: 0 }}
            transition={
              isMoving
                ? {
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: 0.01 },
                  }
                : {
                    duration: 0.3,
                    ease: "easeOut",
                  }
            }
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={alreadyPlayed ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(8px)" }}
        animate={
          isMoving || introComplete
            ? { opacity: 1, filter: "blur(0px)" }
            : { opacity: 0, filter: "blur(8px)" }
        }
        transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={alreadyPlayed ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight text-[#ebdbb2]">
                  A love note
                </h1>
              </motion.div>
              <motion.div
                initial={alreadyPlayed ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight text-[#d5c4a1]">
                  on their lock screen
                </h1>
              </motion.div>
              <motion.div
                initial={alreadyPlayed ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <p className="text-base text-[#a89984] mb-8 max-w-lg leading-relaxed">
                  Type something sweet and send it to your connected person. When iOS refreshes
                  their widget, your latest note is there for their next glance.
                </p>
              </motion.div>
              <motion.div
                initial={alreadyPlayed ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex gap-3"
              >
                <motion.a
                  href="https://apps.apple.com/app/id6763015481"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="px-5 py-2.5 bg-[#b8bb26] text-[#282828] text-sm hover:bg-[#98971a] transition-colors flex items-center gap-2 font-medium rounded-xl"
                >
                  <Download className="w-4 h-4" />
                  Get Started
                </motion.a>
                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.03, borderColor: "rgba(235, 219, 178, 0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="px-5 py-2.5 border border-[#504945] text-sm hover:bg-[#3c3836] transition-colors text-[#ebdbb2] rounded-xl"
                >
                  Learn More
                </motion.a>
              </motion.div>
            </div>
            {/* Glow behind phones */}
            <div className="relative">
              <div className="absolute inset-0 -inset-x-20 bg-[#ebdbb2]/[0.03] rounded-full blur-[100px]" />
              <HeroPhones />
            </div>
          </div>
        </div>
      </section>

      {/* Accent line */}
      <div className="max-w-[600px] mx-auto h-px bg-gradient-to-r from-transparent via-[#ebdbb2]/15 to-transparent" />

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <AnimatedSection className="mb-20" animation="blur-in">
            <h2 className="text-4xl md:text-5xl font-semibold text-[#ebdbb2]">
              Why couples love it
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="mb-24" animation="fade-left">
            <div className="flex items-start gap-6 max-w-[700px]">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="w-12 h-12 rounded-2xl bg-[#ebdbb2]/8 border border-[#ebdbb2]/10 flex items-center justify-center flex-shrink-0 mt-1"
              >
                <Zap className="w-5 h-5 text-[#ebdbb2]" />
              </motion.div>
              <div>
                <h3 className="text-2xl md:text-3xl text-[#ebdbb2] mb-3">Quiet updates</h3>
                <p className="text-[#a89984] leading-relaxed">
                  Your latest note can appear on their widget without a notification banner. Delivery timing depends on iOS and connectivity.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mb-24" animation="fade-right">
            <div className="flex items-start gap-6 max-w-[700px] ml-auto">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="w-12 h-12 rounded-2xl bg-[#ebdbb2]/8 border border-[#ebdbb2]/10 flex items-center justify-center flex-shrink-0 mt-1"
              >
                <Lock className="w-5 h-5 text-[#ebdbb2]" />
              </motion.div>
              <div>
                <h3 className="text-2xl md:text-3xl text-[#ebdbb2] mb-3">Made for one connection</h3>
                <p className="text-[#a89984] leading-relaxed">
                  One active partner and no social feed. Notes are stored by Luv so the service can deliver them.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} animation="fade-left">
            <div className="flex items-start gap-6 max-w-[700px]">
              <motion.div
                whileHover={{ scale: 1.12, rotate: 8 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="w-12 h-12 rounded-2xl bg-[#ebdbb2]/8 border border-[#ebdbb2]/10 flex items-center justify-center flex-shrink-0 mt-1"
              >
                <Heart className="w-5 h-5 text-[#ebdbb2] fill-[#ebdbb2]" />
              </motion.div>
              <div>
                <h3 className="text-2xl md:text-3xl text-[#ebdbb2] mb-3">Built for two</h3>
                <p className="text-[#a89984] leading-relaxed">
                  One connection. One widget. No group chats, no social feed. Just a quiet space for you and your person.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Accent line */}
      <div className="max-w-[600px] mx-auto h-px bg-gradient-to-r from-transparent via-[#ebdbb2]/15 to-transparent" />

      {/* How It Works */}
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection className="flex justify-center" animation="scale-in">
              <PhoneWidget message="thinking of you right now" isUpdating={false} />
            </AnimatedSection>

            <AnimatedSection delay={0.1} animation="fade-right">
              <h3 className="text-3xl md:text-4xl font-semibold mb-12 text-[#ebdbb2]">
                Their home screen.
                <br />
                Your <span className="text-[#d5c4a1]">love notes</span>.
              </h3>
              <div className="relative pl-8">
                <div className="absolute left-[11px] top-[12px] bottom-[12px] w-px bg-gradient-to-b from-[#ebdbb2]/40 via-[#ebdbb2]/20 to-[#ebdbb2]/40" />

                <div className="relative pb-12">
                  <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full border-2 border-[#ebdbb2]/60 bg-[#282828] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#ebdbb2]" />
                  </div>
                  <div className="text-lg text-[#ebdbb2] mb-1">Add the Luv widget</div>
                  <p className="text-sm text-[#928374]">Both partners add it to their home screen</p>
                </div>

                <div className="relative pb-12">
                  <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full border-2 border-[#ebdbb2]/60 bg-[#282828] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#ebdbb2]" />
                  </div>
                  <div className="text-lg text-[#ebdbb2] mb-1">Write a message</div>
                  <p className="text-sm text-[#928374]">Type what's on your mind</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full border-2 border-[#ebdbb2]/60 bg-[#282828] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#ebdbb2]" />
                  </div>
                  <div className="text-lg text-[#ebdbb2] mb-1">It reaches their widget</div>
                  <p className="text-sm text-[#928374]">Timing depends on iOS background delivery and refresh scheduling</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Accent line */}
      <div className="max-w-[600px] mx-auto h-px bg-gradient-to-r from-transparent via-[#ebdbb2]/15 to-transparent" />

      {/* FAQ */}
      <section className="py-32 px-6">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection className="mb-16" animation="blur-in">
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-[#ebdbb2]">
              Common questions
            </h2>
          </AnimatedSection>

          <div className="border-t border-[#504945]">
            {faqs.map((faq, index) => (
              <AnimatedSection key={index} delay={0.05 * (index + 1)}>
                <div className="border-b border-[#504945]">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between py-5 px-2 text-left cursor-pointer group"
                  >
                    <span className="text-sm text-[#ebdbb2] font-medium pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-[#928374] group-hover:text-[#ebdbb2] transition-colors" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ filter: "blur(4px)", opacity: 0 }}
                          animate={{ filter: "blur(0px)", opacity: 1 }}
                          exit={{ filter: "blur(4px)", opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                          className="text-sm text-[#a89984] leading-relaxed px-2 pb-5"
                        >
                          {faq.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Accent line */}
      <div className="max-w-[600px] mx-auto h-px bg-gradient-to-r from-transparent via-[#ebdbb2]/15 to-transparent" />

      {/* CTA */}
      <section id="download" className="py-32 px-6 relative">
        {/* Soft radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-[#ebdbb2]/[0.02] rounded-full blur-[120px]" />
        </div>
        <AnimatedSection>
          <div className="max-w-[800px] mx-auto text-center relative">
            <h2 className="text-5xl md:text-6xl font-semibold mb-6 text-[#ebdbb2]">
              Start sending
              <br />
              <span className="text-[#d5c4a1]">today</span>
            </h2>
            <p className="text-base text-[#a89984] mb-12 max-w-md mx-auto">
              Free to download. No ads. Optional Premium. Just you two.
            </p>
            <motion.a
              href="https://apps.apple.com/app/id6763015481"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-block"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-14"
              />
            </motion.a>
            <div className="flex items-center justify-center gap-6 mt-12 text-xs text-[#928374]">
              <div>iOS 18.5+</div>
              <div>•</div>
              <div>Free</div>
              <div>•</div>
              <div>No ads</div>
              <div>•</div>
              <div>Stored for delivery</div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
            <div className="flex items-center gap-2 text-[#928374]">
              <div className="w-2 h-2 bg-[#ebdbb2] rounded-full" />
              <span>luvnote.app</span>
            </div>
            <div className="flex gap-8 text-[#928374]">
              <Link to="/privacy" className="relative hover:text-[#ebdbb2] transition-colors group">
                privacy
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#ebdbb2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>
              <Link to="/terms" className="relative hover:text-[#ebdbb2] transition-colors group">
                terms
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#ebdbb2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>
              <Link to="/support" className="relative hover:text-[#ebdbb2] transition-colors group">
                support
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#ebdbb2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 text-xs text-[#928374]">
            built with love by one dev in New York
          </div>
        </div>
      </footer>

      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#1f1b18]" aria-label="Loading page" />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<div className="overflow-x-hidden w-full min-h-screen"><CinematicHero howItWorksHref="/how-it-works" /></div>} />
          <Route path="/cinematic" element={<div className="overflow-x-hidden w-full min-h-screen"><CinematicHero howItWorksHref="/how-it-works" /></div>} />
          <Route path="/old" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
