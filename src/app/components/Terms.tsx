import { motion } from "motion/react";
import { FileCheck, Shield, CreditCard, Ban } from "lucide-react";
import { PageNav } from "./PageNav";
import { AnimatedSection } from "./AnimatedSection";

export function Terms() {
  const tldrCards = [
    { icon: <FileCheck className="w-5 h-5" />, title: "Fair Agreement", desc: "Use the app respectfully and we'll take care of you" },
    { icon: <Shield className="w-5 h-5" />, title: "Age 13+", desc: "You must be at least 13 years old to use Luv" },
    { icon: <CreditCard className="w-5 h-5" />, title: "App Store Billing", desc: "All payments handled securely through Apple" },
    { icon: <Ban className="w-5 h-5" />, title: "Zero Tolerance", desc: "Harassment or abuse means immediate account termination" },
  ];

  const sections = [
    {
      num: "01",
      title: "Acceptance of Terms",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          By accessing or using Luv, you agree to comply with and be bound by these Terms of Service and all applicable laws. If you don't agree, you may not use the app.
        </p>
      ),
    },
    {
      num: "02",
      title: "Description of Service",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Luv is a private messaging app for couples. The service includes private messaging between connected partners, home screen widget updates via push notifications, profile management, and premium subscription features where applicable.
        </p>
      ),
    },
    {
      num: "03",
      title: "Eligibility",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          You must be at least <span className="text-[#ebdbb2]">13 years old</span>, have the legal capacity to enter into these terms, comply with all applicable laws, and agree not to use the app for illegal or unauthorized purposes.
        </p>
      ),
    },
    {
      num: "04",
      title: "User Accounts",
      content: (
        <>
          <p className="text-[#a89984] mb-4 leading-relaxed">
            To use certain features, create an account with your email and display name. You're responsible for maintaining confidentiality of your credentials and all activity under your account.
          </p>
          <p className="text-[#a89984] leading-relaxed">
            You may delete your account anytime through settings. We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </>
      ),
    },
    {
      num: "05",
      title: "Acceptable Use",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Don't violate laws, infringe on others' rights, transmit harmful content, harass other users, interfere with the app's functionality, or reverse engineer the app.
        </p>
      ),
    },
    {
      num: "06",
      title: "Content and Messages",
      content: (
        <>
          <p className="text-[#a89984] mb-4 leading-relaxed">
            You retain ownership of all messages and content you create. By using Luv, you grant us a license to store, transmit, and display your content solely to provide the service.
          </p>
          <p className="text-[#a89984] leading-relaxed">
            Don't send content that's illegal, contains hate speech, violates IP rights, or constitutes spam.
          </p>
        </>
      ),
    },
    {
      num: "07",
      title: "Subscriptions & Billing",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          All payments are processed through Apple's App Store. Subscriptions auto-renew unless cancelled at least 24 hours before the billing period ends. Refunds are handled by Apple per their policy.
        </p>
      ),
    },
    {
      num: "08",
      title: "Intellectual Property",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          The app's design, features, and functionality are owned by Luv and protected by copyright, trademark, and other IP laws. Don't copy, modify, distribute, or create derivative works without permission.
        </p>
      ),
    },
    {
      num: "09",
      title: "Privacy",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Your use is also governed by our <a href="/privacy" className="text-[#b8bb26] hover:underline">Privacy Policy</a>, which explains how we collect, use, and protect your information.
        </p>
      ),
    },
    {
      num: "10",
      title: "Disclaimers",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          The app is provided "as is" and "as available." We don't guarantee uninterrupted or error-free service. We disclaim all warranties to the fullest extent permitted by law.
        </p>
      ),
    },
    {
      num: "11",
      title: "Limitation of Liability",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Luv shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues from your use of the app.
        </p>
      ),
    },
    {
      num: "12",
      title: "Indemnification",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          You agree to indemnify and hold harmless Luv and its affiliates from any claims, damages, or expenses arising from your use of the app or violation of these terms.
        </p>
      ),
    },
    {
      num: "13",
      title: "Third-Party Services",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          The app integrates with Apple's App Store, push notification services, and cloud storage providers. Your use of these services is subject to their respective terms.
        </p>
      ),
    },
    {
      num: "14",
      title: "Changes & Termination",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          We may modify these terms at any time. We'll notify you of material changes. Continued use constitutes acceptance. We may terminate access without notice for breach of these terms.
        </p>
      ),
    },
    {
      num: "15",
      title: "Governing Law & Disputes",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          These terms are governed by the laws of the jurisdiction where Luv operates. Disputes shall be resolved through binding arbitration except where prohibited by law. If any provision is unenforceable, the remaining provisions stand. These terms, with our Privacy Policy, constitute the entire agreement.
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
              <h1 className="text-5xl md:text-7xl mb-6 text-[#ebdbb2]">Terms of Service</h1>
              <p className="text-lg text-[#a89984] max-w-lg mx-auto leading-relaxed">
                The rules of the road. Fair, simple, and transparent.
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
              Questions? <a href="mailto:support@luv.app" className="text-[#b8bb26] hover:underline">support@luv.app</a>
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
