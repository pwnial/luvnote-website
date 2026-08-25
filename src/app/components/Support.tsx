import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Mail, Bug, ChevronDown } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import "../../styles/cinematic.css";

export function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const faqs = [
    { question: "How do I connect with my partner?", answer: "Both people need a Luv account. One person shares the connection code or invite link shown by the app, and the other accepts it in Luv. Each account can have one active partner connection at a time." },
    { question: "Why isn't the widget updating?", answer: "First confirm the new note appears inside Luv. Then open Luv on both devices, make sure Background App Refresh is enabled for Luv, and confirm the Luv widget is still installed. Visible notification permission is not required for a silent widget-refresh request. Apple schedules background and widget refreshes, so an update may be delayed—especially after force-quitting the app or losing connectivity. If it remains stale, remove and re-add the widget and email us with your OS version, Luv version, and whether the note appears in the app." },
    { question: "Can I use Luv with multiple partners?", answer: "Luv currently supports one active partner connection per account. You must leave the existing connection before connecting with someone else." },
    { question: "How are my notes protected?", answer: "Luv encrypts data while it travels over the network and stores notes in Supabase so they can be delivered to your connected partner. Notes are not end-to-end encrypted, which means Luv's backend and authorized service providers can technically process stored note content. See the Privacy Policy for the full details." },
    { question: "How do I manage or restore a purchase?", answer: "If Apple shows an active Luv subscription, manage or cancel it from Settings → [Your Name] → Subscriptions on your Apple device. For an eligible purchase, use Restore Purchases inside Luv while signed in to the Luv account that should receive access and the Apple Account that owns the purchase. Premium appears only after Apple and Luv confirm the purchase and account association. If a restore stays pending, contact support. Apple handles App Store refund requests." },
    { question: "What system version do I need?", answer: "Luv requires iOS or iPadOS 18.5 or later to support its widgets and background refresh features." },
    { question: "Where can I add the widget?", answer: "Luv supports small and medium Home Screen widgets and a rectangular Lock Screen widget. Add widgets through the iOS or iPadOS widget editor after opening Luv at least once." },
    { question: "What happens if I delete the app or my account?", answer: "Deleting the app does not delete your Luv account or stored notes. To request account deletion, use Delete Account in Luv Settings. Processing is asynchronous, so wait for the app to confirm completion. If the request is unavailable, delayed, or you cannot access the app, email support@luvnote.app." },
  ];

  return (
    <motion.main
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
      className="cinematic-theme min-h-screen relative overflow-hidden"
    >
      {/* Base + texture layers */}
      <div className="fixed inset-0 z-0 bg-[#1f1b18]" />
      <div className="fixed inset-0 z-0 bg-grid-theme opacity-[0.22] pointer-events-none" />
      <div className="film-grain fixed" />

      {/* Nav — text wordmark, no gif */}
      <motion.nav
        aria-label="Primary"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#ebdbb2]/[0.06] bg-[#1f1b18]/92 backdrop-blur-xl"
      >
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3869b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1b18]"
            >
              <span className="font-mono text-xl lowercase tracking-tight text-[#fbf1c7] group-hover:text-[#d3869b] transition-colors">
                luv
              </span>
            </Link>
            <Link
              to="/"
              className="relative rounded-sm font-mono text-[11px] uppercase tracking-wide text-[#928374] hover:text-[#ebdbb2] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3869b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1b18]"
            >
              ← luv
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#d3869b] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </Link>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-40 pb-20 px-6 relative">
          {/* soft rose radial glow behind title */}
          <div
            className="absolute left-1/2 top-24 -translate-x-1/2 w-[640px] h-[420px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(211,134,155,0.10) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <div className="max-w-[900px] mx-auto relative">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6 }}
              className="text-center"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#ebdbb2]/45 mb-6">
                Help Center
              </p>
              <h1 className="text-silver-matte text-5xl md:text-7xl font-black tracking-tight mb-6">
                Support
              </h1>
              <p className="text-lg text-[#a89984] max-w-lg mx-auto leading-relaxed">
                Need help? We've got you covered.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="cinematic-divider max-w-[600px] mx-auto" />

        {/* Contact */}
        <section className="px-6 pt-20 pb-24">
          <div className="max-w-[900px] mx-auto">
            <AnimatedSection>
              <h2 className="text-3d-matte text-3xl md:text-4xl font-bold tracking-tight mb-3 text-center">
                Contact Us
              </h2>
              <p className="text-sm text-[#928374] text-center mb-12">
                For faster help, include your iOS version, Luv version, and what you expected to happen.
              </p>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedSection delay={0.1}>
                <a
                  href="mailto:support@luvnote.app"
                  className="surface-panel block rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#d3869b]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3869b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#1f1b18] group"
                >
                  <div className="mb-6 w-fit">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#d3869b]/12 border border-[#d3869b]/20">
                      <div className="absolute -inset-1 bg-[#d3869b]/15 rounded-2xl blur-md" />
                      <Mail className="w-5 h-5 relative text-[#d3869b]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[#fbf1c7] mb-2 tracking-tight group-hover:text-[#d3869b] transition-colors">
                    Email Support
                  </h3>
                  <p className="text-sm text-[#928374] mb-5 leading-relaxed">
                    General inquiries and account issues
                  </p>
                  <span className="font-mono text-sm text-[#d3869b]">support@luvnote.app</span>
                </a>
              </AnimatedSection>
              <AnimatedSection delay={0.15}>
                <a
                  href="mailto:support@luvnote.app?subject=Luv%20bug%20report"
                  className="surface-panel block rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#d3869b]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3869b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#1f1b18] group"
                >
                  <div className="mb-6 w-fit">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#d3869b]/12 border border-[#d3869b]/20">
                      <div className="absolute -inset-1 bg-[#d3869b]/15 rounded-2xl blur-md" />
                      <Bug className="w-5 h-5 relative text-[#d3869b]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[#fbf1c7] mb-2 tracking-tight group-hover:text-[#d3869b] transition-colors">
                    Report a Bug
                  </h3>
                  <p className="text-sm text-[#928374] mb-5 leading-relaxed">
                    Found a technical issue? Let us know
                  </p>
                  <span className="font-mono text-sm text-[#d3869b]">support@luvnote.app</span>
                </a>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="px-6 pb-24">
          <div className="max-w-[760px] mx-auto">
            <AnimatedSection>
              <h2 className="text-3d-matte text-3xl md:text-4xl font-bold tracking-tight mb-10 text-center">
                Common Questions
              </h2>
            </AnimatedSection>
            <div className="border-t border-[#ebdbb2]/10">
              {faqs.map((faq, index) => (
                <AnimatedSection key={faq.question} delay={0.05 * (index + 1)}>
                  <div className="border-b border-[#ebdbb2]/10">
                    <button
                      id={`support-faq-button-${index}`}
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      aria-expanded={openFaq === index}
                      aria-controls={`support-faq-panel-${index}`}
                      className="w-full flex items-center justify-between py-6 text-left cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3869b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1b18] group"
                    >
                      <span className="text-base text-[#ebdbb2] font-medium tracking-tight pr-4 group-hover:text-[#fbf1c7] transition-colors">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeInOut" }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-4 h-4 text-[#928374] group-hover:text-[#d3869b] transition-colors" />
                      </motion.div>
                    </button>
                    {reduceMotion ? (
                      openFaq === index && (
                        <div
                          id={`support-faq-panel-${index}`}
                          role="region"
                          aria-labelledby={`support-faq-button-${index}`}
                        >
                          <p className="text-sm text-[#a89984] leading-relaxed pb-6">
                            {faq.answer}
                          </p>
                        </div>
                      )
                    ) : (
                      <AnimatePresence initial={false}>
                        {openFaq === index && (
                        <motion.div
                          id={`support-faq-panel-${index}`}
                          role="region"
                          aria-labelledby={`support-faq-button-${index}`}
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
                            className="text-sm text-[#a89984] leading-relaxed pb-6"
                          >
                            {faq.answer}
                          </motion.p>
                        </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 pt-20 pb-24">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-sm text-[#928374]">
              Still need help? <a href="mailto:support@luvnote.app" className="text-[#d3869b] hover:underline">support@luvnote.app</a>
            </p>
          </div>
        </section>
      </div>
    </motion.main>
  );
}
