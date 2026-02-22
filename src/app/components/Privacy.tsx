import { motion } from "motion/react";
import { Shield, EyeOff, UserCheck, Server } from "lucide-react";
import { PageNav } from "./PageNav";
import { AnimatedSection } from "./AnimatedSection";

export function Privacy() {
  const tldrCards = [
    { icon: <Shield className="w-5 h-5" />, title: "End-to-End Encrypted", desc: "Messages are encrypted and only readable by you and your partner" },
    { icon: <EyeOff className="w-5 h-5" />, title: "Never Sold", desc: "We will never sell, trade, or rent your personal data" },
    { icon: <UserCheck className="w-5 h-5" />, title: "Full Control", desc: "Access, update, or delete your data anytime from the app" },
    { icon: <Server className="w-5 h-5" />, title: "Minimal Storage", desc: "We only store what's needed to make the app work" },
  ];

  const sections = [
    {
      num: "01",
      title: "Information We Collect",
      content: (
        <>
          <p className="text-[#a89984] mb-4 leading-relaxed">When you create an account, we collect your <span className="text-[#ebdbb2]">email address</span> and <span className="text-[#ebdbb2]">display name</span>. You may optionally upload a profile picture.</p>
          <p className="text-[#a89984] mb-4 leading-relaxed"><span className="text-[#ebdbb2]">Messages</span> you send are stored to enable delivery to your partner's device. We also store connection codes and partner relationships.</p>
          <p className="text-[#a89984] leading-relaxed">We automatically collect <span className="text-[#ebdbb2]">device identifiers</span>, push notification tokens, usage data, and crash reports to keep things running smoothly.</p>
        </>
      ),
    },
    {
      num: "02",
      title: "How We Use It",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          We use your information to provide and improve the app, deliver messages to your partner's widget via push notifications, authenticate your identity, send technical updates, analyze usage patterns, and detect security threats.
        </p>
      ),
    },
    {
      num: "03",
      title: "Data Storage & Security",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Your data is stored securely using Supabase. We implement appropriate technical and organizational measures to protect your personal information. No method of transmission is 100% secure, but we do our best.
        </p>
      ),
    },
    {
      num: "04",
      title: "Data Sharing",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          We don't sell your data. We share information only with your <span className="text-[#ebdbb2]">connected partner</span>, <span className="text-[#ebdbb2]">service providers</span> (Supabase, Apple), when <span className="text-[#ebdbb2]">legally required</span>, or during business transfers.
        </p>
      ),
    },
    {
      num: "05",
      title: "Push Notifications",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Silent push notifications update your partner's widget in real-time. We store push tokens associated with your device. Disabling notifications will prevent automatic widget updates.
        </p>
      ),
    },
    {
      num: "06",
      title: "Third-Party Services",
      content: (
        <>
          <p className="text-[#a89984] mb-3 leading-relaxed">We use <span className="text-[#ebdbb2]">Supabase</span> for authentication, storage, and backend services, and <span className="text-[#ebdbb2]">Apple</span> for push notifications and in-app purchases.</p>
          <div className="flex gap-6 text-xs text-[#928374]">
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#b8bb26] hover:underline">supabase.com/privacy</a>
            <a href="https://www.apple.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#b8bb26] hover:underline">apple.com/privacy</a>
          </div>
        </>
      ),
    },
    {
      num: "07",
      title: "Data Retention",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          We keep your data as long as needed to provide the service. When you delete your account, we delete or anonymize your information, except where legally required to retain it.
        </p>
      ),
    },
    {
      num: "08",
      title: "Your Rights",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          You can <span className="text-[#ebdbb2]">access</span> your data through settings, <span className="text-[#ebdbb2]">update</span> your profile anytime, <span className="text-[#ebdbb2]">delete</span> your account and data, or <span className="text-[#ebdbb2]">export</span> your data by contacting us.
        </p>
      ),
    },
    {
      num: "09",
      title: "Children's Privacy",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Luv is not intended for users under 13. We don't knowingly collect data from children. If you believe a child has provided us with personal information, please contact us immediately.
        </p>
      ),
    },
    {
      num: "10",
      title: "International Transfers",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Your information may be transferred to and processed in countries other than your own. By using the app, you consent to these transfers.
        </p>
      ),
    },
    {
      num: "11",
      title: "Changes to This Policy",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          We may update this policy from time to time. We'll post changes here and update the date above. We recommend reviewing it periodically.
        </p>
      ),
    },
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
              <p className="text-xs text-[#928374] uppercase tracking-[0.2em] mb-6">Last updated January 2025</p>
              <h1 className="text-5xl md:text-7xl mb-6 text-[#ebdbb2]">Privacy Policy</h1>
              <p className="text-lg text-[#a89984] max-w-lg mx-auto leading-relaxed">
                Your data, your control. Here's exactly what we do — and don't do.
              </p>
            </motion.div>
          </div>
        </section>

        {/* TL;DR */}
        <section className="px-6 pb-24">
          <div className="max-w-[900px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tldrCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 * i }}
                  className="border border-[#504945]/60 rounded-2xl p-6 hover:border-[#504945] transition-colors"
                >
                  <div className="text-[#b8bb26] mb-4 relative">
                    <div className="absolute -inset-1 bg-[#b8bb26]/10 rounded-full blur-md" />
                    <div className="relative">{card.icon}</div>
                  </div>
                  <h3 className="text-sm text-[#ebdbb2] font-medium mb-2">{card.title}</h3>
                  <p className="text-xs text-[#928374] leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="px-6 pb-32">
          <div className="max-w-[900px] mx-auto">
            <div className="border-t border-[#504945]/40">
              {sections.map((section, i) => (
                <AnimatedSection key={i} delay={0.05 * i}>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-12 py-10 border-b border-[#504945]/40">
                    <div>
                      <span className="text-xs text-[#928374] block mb-1">{section.num}</span>
                      <h2 className="text-base text-[#ebdbb2] font-medium">{section.title}</h2>
                    </div>
                    <div className="text-sm">{section.content}</div>
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
              Questions? <a href="mailto:privacy@luv.app" className="text-[#b8bb26] hover:underline">privacy@luv.app</a>
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
