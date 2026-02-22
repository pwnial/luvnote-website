import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Download, ChevronDown, Zap, Lock } from "lucide-react";
import { PhoneWidget } from "./components/PhoneWidget";
import { HeroPhones } from "./components/HeroPhones";
import { Privacy } from "./components/Privacy";
import { Terms } from "./components/Terms";
import { Support } from "./components/Support";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import { AnimatedSection } from "./components/AnimatedSection";
import { DebugDevicePreview } from "./components/DebugDevicePreview";

const INTRO_SESSION_KEY = "luv-intro-played";

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Intro animation state
  const alreadyPlayed = false;
  const [introPhase, setIntroPhase] = useState<"splash" | "moving" | "done">("splash");
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
      answer: "When you send a message in the Luv app, it instantly appears on your partner's home screen widget using silent push notifications. No need to open the app - it just updates automatically."
    },
    {
      question: "Is it really end-to-end encrypted?",
      answer: "Yes. All messages are encrypted on your device before being sent, and can only be decrypted by your partner's device. We can't read your messages - they're yours alone."
    },
    {
      question: "Does it work with Android?",
      answer: "Currently Luv is iOS-only (iOS 16+). We're focused on making the best possible iOS experience first, but Android support is on our roadmap."
    },
    {
      question: "How much does it cost?",
      answer: "Luv is free to download and use. We may introduce optional premium features in the future, but the core widget messaging will always be free."
    },
    {
      question: "Can I connect with more than one person?",
      answer: "Currently, Luv is designed for couples - one connection at a time. This keeps the experience intimate and focused on your relationship."
    },
    {
      question: "What if we both send messages at the same time?",
      answer: "Both widgets will update! You'll each see the other person's message. The app handles simultaneous updates seamlessly."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="text-white min-h-screen font-mono relative"
    >
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-[#282828]" />

      {/* Debug device preview — remove before launch */}
      <DebugDevicePreview />

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
                <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight text-[#ebdbb2]">
                  A love note
                </h1>
              </motion.div>
              <motion.div
                initial={alreadyPlayed ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight text-[#d5c4a1]">
                  on their lock screen
                </h1>
              </motion.div>
              <motion.div
                initial={alreadyPlayed ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <p className="text-base text-[#a89984] mb-8 max-w-lg leading-relaxed">
                  Type something sweet. It appears instantly on their home screen widget. 
                  No notifications. No opening apps. Just there — waiting for them.
                </p>
              </motion.div>
              <motion.div
                initial={alreadyPlayed ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex gap-3"
              >
                <motion.a 
                  href="#download"
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
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
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
      <div className="max-w-[600px] mx-auto h-px bg-gradient-to-r from-transparent via-[#ebdbb2]/10 to-transparent" />

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <AnimatedSection className="mb-20" animation="blur-in">
            <h2 className="text-4xl md:text-5xl text-[#ebdbb2]">
              Why couples love it
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="mb-24" animation="fade-left">
            <div className="flex items-start gap-6 max-w-[700px]">
              <div className="w-12 h-12 rounded-2xl bg-[#ebdbb2]/8 border border-[#ebdbb2]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Zap className="w-5 h-5 text-[#ebdbb2]" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl text-[#ebdbb2] mb-3">Instant updates</h3>
                <p className="text-[#a89984] leading-relaxed">
                  Your words appear on their lock screen the moment you hit send. No notification banners. No inbox to check. Just there — waiting for them.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mb-24" animation="fade-right">
            <div className="flex items-start gap-6 max-w-[700px] ml-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#ebdbb2]/8 border border-[#ebdbb2]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Lock className="w-5 h-5 text-[#ebdbb2]" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl text-[#ebdbb2] mb-3">Completely private</h3>
                <p className="text-[#a89984] leading-relaxed">
                  End-to-end encrypted. We can't read your messages and we never will. What you say stays between you two.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} animation="fade-left">
            <div className="flex items-start gap-6 max-w-[700px]">
              <div className="w-12 h-12 rounded-2xl bg-[#ebdbb2]/8 border border-[#ebdbb2]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="w-5 h-5 text-[#ebdbb2] fill-[#ebdbb2]" />
              </div>
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
      <div className="max-w-[600px] mx-auto h-px bg-gradient-to-r from-transparent via-[#ebdbb2]/10 to-transparent" />

      {/* How It Works */}
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection className="flex justify-center" animation="scale-in">
              <PhoneWidget message="thinking of you right now" isUpdating={false} />
            </AnimatedSection>

            <AnimatedSection delay={0.1} animation="fade-right">
              <h3 className="text-3xl md:text-4xl mb-12 text-[#ebdbb2]">
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
                  <div className="text-lg text-[#ebdbb2] mb-1">It appears instantly</div>
                  <p className="text-sm text-[#928374]">Right on their lock screen widget</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Accent line */}
      <div className="max-w-[600px] mx-auto h-px bg-gradient-to-r from-transparent via-[#ebdbb2]/10 to-transparent" />

      {/* FAQ */}
      <section className="py-32 px-6">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection className="mb-16" animation="blur-in">
            <h2 className="text-4xl md:text-5xl mb-4 text-[#ebdbb2]">
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
                          transition={{ duration: 0.3, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
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
      <div className="max-w-[600px] mx-auto h-px bg-gradient-to-r from-transparent via-[#ebdbb2]/10 to-transparent" />

      {/* CTA */}
      <section id="download" className="py-32 px-6 relative">
        {/* Soft radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-[#ebdbb2]/[0.02] rounded-full blur-[120px]" />
        </div>
        <AnimatedSection>
          <div className="max-w-[800px] mx-auto text-center relative">
            <h2 className="text-5xl md:text-6xl mb-6 text-[#ebdbb2]">
              Start sending
              <br />
              <span className="text-[#d5c4a1]">today</span>
            </h2>
            <p className="text-base text-[#a89984] mb-12 max-w-md mx-auto">
              Free to download. No ads. No tracking. Just you two.
            </p>
            <motion.a 
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#b8bb26] text-[#282828] hover:bg-[#98971a] hover:shadow-lg hover:shadow-[#b8bb26]/30 transition-all duration-300 font-medium text-base rounded-xl"
            >
              <Download className="w-5 h-5" />
              Download for iOS
            </motion.a>
            <div className="flex items-center justify-center gap-6 mt-12 text-xs text-[#928374]">
              <div>iOS 16+</div>
              <div>•</div>
              <div>Free</div>
              <div>•</div>
              <div>No ads</div>
              <div>•</div>
              <div>E2EE</div>
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
              <span>luv.app</span>
            </div>
            <div className="flex gap-8 text-[#928374]">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                <Link to="/privacy" className="hover:text-[#ebdbb2] transition-colors">privacy</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                <Link to="/terms" className="hover:text-[#ebdbb2] transition-colors">terms</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                <Link to="/support" className="hover:text-[#ebdbb2] transition-colors">support</Link>
              </motion.div>
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
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Support />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
      </Routes>
    </AnimatePresence>
  );
}
