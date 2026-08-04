import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Bug, ChevronDown } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import "../../styles/cinematic.css";

export function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { question: "How do I connect with my partner?", answer: "Both of you need to download the app. One person generates a connection code in Settings, and the other enters that code to connect. Once connected, your widgets will sync automatically." },
    { question: "Why isn't the widget updating?", answer: "Make sure you've added the Luv widget to your home screen, granted notification permissions, and have a stable internet connection. Try removing and re-adding the widget if issues persist." },
    { question: "Can I use Luv with multiple partners?", answer: "No, Luv is designed exclusively for couples. Each account can only be connected to one partner at a time to maintain the intimate, personal nature of the app." },
    { question: "How are my notes protected?", answer: "Notes are encrypted in transit and at rest by our managed infrastructure. In the app, access is limited to you and your connected partner. Luv processes and stores note content to deliver the feature; see our Privacy Policy for full details." },
    { question: "How do I cancel my subscription?", answer: "Subscriptions are managed through the App Store. Go to Settings → [Your Name] → Subscriptions → Luv, then tap Cancel Subscription." },
    { question: "What iOS version do I need?", answer: "Luv requires iOS 18.5 or later to support home screen widgets and the latest notification features." },
    { question: "Can I customize the widget appearance?", answer: "Yes! Premium subscribers can customize widget colors, fonts, and styles. Free users get the default Gruvbox theme." },
    { question: "What happens to my messages if I delete the app?", answer: "If you delete the app without first deleting your account, your messages remain stored. You can reinstall and log back in to access them. To permanently delete everything, use the Delete Account option in Settings first." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="cinematic-theme min-h-screen relative overflow-hidden"
    >
      {/* Base + texture layers */}
      <div className="fixed inset-0 z-0 bg-[#1f1b18]" />
      <div className="fixed inset-0 z-0 bg-grid-theme opacity-[0.22] pointer-events-none" />
      <div className="film-grain fixed" />

      {/* Nav — text wordmark, no gif */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-[1200px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-mono text-xl lowercase tracking-tight text-[#fbf1c7] group-hover:text-[#d3869b] transition-colors">
                luv
              </span>
            </Link>
            <Link
              to="/"
              className="relative font-mono text-[11px] uppercase tracking-wide text-[#928374] hover:text-[#ebdbb2] transition-colors group"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
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
                Reach us directly — we read every message.
              </p>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedSection delay={0.1}>
                <a
                  href="mailto:support@luvnote.app"
                  className="surface-panel block rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#d3869b]/30 group"
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
                  href="mailto:support@luvnote.app"
                  className="surface-panel block rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#d3869b]/30 group"
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
                <AnimatedSection key={index} delay={0.05 * (index + 1)}>
                  <div className="border-b border-[#ebdbb2]/10">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
                    >
                      <span className="text-base text-[#ebdbb2] font-medium tracking-tight pr-4 group-hover:text-[#fbf1c7] transition-colors">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-4 h-4 text-[#928374] group-hover:text-[#d3869b] transition-colors" />
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
                            className="text-sm text-[#a89984] leading-relaxed pb-6"
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

        <div className="cinematic-divider max-w-[600px] mx-auto" />

        {/* System Status */}
        <section className="px-6 pt-20 pb-24">
          <div className="max-w-[760px] mx-auto">
            <AnimatedSection>
              <div className="widget-depth rounded-2xl px-6 py-5 flex items-center gap-3 mb-8">
                <div className="w-2.5 h-2.5 bg-[#b8bb26] rounded-full animate-pulse" />
                <h2 className="text-base font-semibold text-[#fbf1c7] tracking-tight">
                  All Systems Operational
                </h2>
              </div>
            </AnimatedSection>
            <div className="space-y-4 px-2">
              {[
                { date: "Jan 15", text: "Fixed widget refresh delay on iOS 17.2" },
                { date: "Jan 12", text: "Improved message delivery speed by 30%" },
                { date: "Jan 8", text: "Added dark mode customization for widgets" },
              ].map((update, i) => (
                <AnimatedSection key={i} delay={0.05 * (i + 1)}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-[#928374] flex-shrink-0 w-12">{update.date}</span>
                    <span className="text-sm text-[#a89984]"><span className="text-[#b8bb26] mr-2">✓</span>{update.text}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 pb-24">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-sm text-[#928374]">
              Still need help? <a href="mailto:support@luvnote.app" className="text-[#d3869b] hover:underline">support@luvnote.app</a>
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
