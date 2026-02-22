import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Bug, ChevronDown } from "lucide-react";
import { PageNav } from "./PageNav";
import { AnimatedSection } from "./AnimatedSection";

export function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { question: "How do I connect with my partner?", answer: "Both of you need to download the app. One person generates a connection code in Settings, and the other enters that code to connect. Once connected, your widgets will sync automatically." },
    { question: "Why isn't the widget updating?", answer: "Make sure you've added the Luv widget to your home screen, granted notification permissions, and have a stable internet connection. Try removing and re-adding the widget if issues persist." },
    { question: "Can I use Luv with multiple partners?", answer: "No, Luv is designed exclusively for couples. Each account can only be connected to one partner at a time to maintain the intimate, personal nature of the app." },
    { question: "Is my data secure and private?", answer: "Yes! All messages are end-to-end encrypted. We can't read your messages, and they're only shared between you and your connected partner. See our Privacy Policy for full details." },
    { question: "How do I cancel my subscription?", answer: "Subscriptions are managed through the App Store. Go to Settings → [Your Name] → Subscriptions → Luv, then tap Cancel Subscription." },
    { question: "What iOS version do I need?", answer: "Luv requires iOS 16 or later to support home screen widgets and the latest notification features." },
    { question: "Can I customize the widget appearance?", answer: "Yes! Premium subscribers can customize widget colors, fonts, and styles. Free users get the default Gruvbox theme." },
    { question: "What happens to my messages if I delete the app?", answer: "If you delete the app without first deleting your account, your messages remain stored. You can reinstall and log back in to access them. To permanently delete everything, use the Delete Account option in Settings first." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="text-white min-h-screen font-mono relative"
    >
      <div className="fixed inset-0 z-0 bg-[#282828]" />
      <PageNav />

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-[900px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl mb-6 text-[#ebdbb2]">Support</h1>
              <p className="text-lg text-[#a89984] max-w-lg mx-auto leading-relaxed">
                Need help? We've got you covered.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact */}
        <section className="px-6 pb-24">
          <div className="max-w-[900px] mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl text-[#ebdbb2] mb-10">Contact Us</h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedSection delay={0.1}>
                <a
                  href="mailto:support@luv.app"
                  className="block border border-[#504945]/60 rounded-2xl p-8 hover:border-[#504945] transition-colors group"
                >
                  <div className="text-[#b8bb26] mb-4 relative w-fit">
                    <div className="absolute -inset-1 bg-[#b8bb26]/10 rounded-full blur-md" />
                    <Mail className="w-5 h-5 relative" />
                  </div>
                  <h3 className="text-base text-[#ebdbb2] mb-2 group-hover:text-[#b8bb26] transition-colors">Email Support</h3>
                  <p className="text-sm text-[#928374] mb-4">General inquiries and account issues</p>
                  <span className="text-sm text-[#b8bb26]">support@luv.app</span>
                </a>
              </AnimatedSection>
              <AnimatedSection delay={0.15}>
                <a
                  href="mailto:bug@luv.app"
                  className="block border border-[#504945]/60 rounded-2xl p-8 hover:border-[#504945] transition-colors group"
                >
                  <div className="text-[#b8bb26] mb-4 relative w-fit">
                    <div className="absolute -inset-1 bg-[#b8bb26]/10 rounded-full blur-md" />
                    <Bug className="w-5 h-5 relative" />
                  </div>
                  <h3 className="text-base text-[#ebdbb2] mb-2 group-hover:text-[#b8bb26] transition-colors">Report a Bug</h3>
                  <p className="text-sm text-[#928374] mb-4">Found a technical issue? Let us know</p>
                  <span className="text-sm text-[#b8bb26]">bug@luv.app</span>
                </a>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="px-6 pb-24">
          <div className="max-w-[900px] mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl text-[#ebdbb2] mb-10">Common Questions</h2>
            </AnimatedSection>
            <div className="border-t border-[#504945]/40">
              {faqs.map((faq, index) => (
                <AnimatedSection key={index} delay={0.05 * (index + 1)}>
                  <div className="border-b border-[#504945]/40">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
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

        {/* System Status */}
        <section className="px-6 pb-24">
          <div className="max-w-[900px] mx-auto">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2.5 h-2.5 bg-[#b8bb26] rounded-full animate-pulse" />
                <h2 className="text-lg text-[#ebdbb2]">All Systems Operational</h2>
              </div>
            </AnimatedSection>
            <div className="space-y-4">
              {[
                { date: "Jan 15", text: "Fixed widget refresh delay on iOS 17.2" },
                { date: "Jan 12", text: "Improved message delivery speed by 30%" },
                { date: "Jan 8", text: "Added dark mode customization for widgets" },
              ].map((update, i) => (
                <AnimatedSection key={i} delay={0.05 * (i + 1)}>
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs text-[#928374] flex-shrink-0 w-12">{update.date}</span>
                    <span className="text-sm text-[#a89984]"><span className="text-[#b8bb26] mr-2">✓</span>{update.text}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 pb-20">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-sm text-[#928374]">
              Still need help? <a href="mailto:support@luv.app" className="text-[#b8bb26] hover:underline">support@luv.app</a>
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
