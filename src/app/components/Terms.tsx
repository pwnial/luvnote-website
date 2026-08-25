import "../../styles/cinematic.css";
import { motion } from "motion/react";
import { FileCheck, Shield, CreditCard, Ban } from "lucide-react";
import { PageNav } from "./PageNav";
import { AnimatedSection } from "./AnimatedSection";

export function Terms() {
  const tldrCards = [
    { icon: <FileCheck className="w-5 h-5" />, title: "Plain Language", desc: "These terms explain the service, purchases, and your responsibilities" },
    { icon: <Shield className="w-5 h-5" />, title: "Age 13+", desc: "You must be at least 13 years old to use Luv" },
    { icon: <CreditCard className="w-5 h-5" />, title: "App Store Purchases", desc: "Apple processes Weekly, Monthly, and Lifetime purchases" },
    { icon: <Ban className="w-5 h-5" />, title: "Respectful Use", desc: "Harassment, abuse, and illegal content are not allowed" },
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
          Luv lets one connected pair exchange notes that are stored by the service and displayed in the app and supported iPhone widgets. The service also includes profiles, relationship activity, optional scheduled notes, and Premium features. Widget and background delivery depend on Apple systems, device settings, connectivity, and service availability and may not occur immediately.
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
            You may submit an account-deletion request through Settings when that service is available. Deletion is asynchronous and is not complete until the app confirms completion. If the request cannot be submitted or you cannot access the app, contact <a href="mailto:privacy@luvnote.app" className="text-[#d3869b] hover:underline">privacy@luvnote.app</a>. We may suspend or terminate accounts that violate these terms.
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
        <>
          <p className="text-[#a89984] mb-4 leading-relaxed"><span className="text-[#ebdbb2]">Weekly and Monthly</span> are auto-renewing subscriptions. Payment is charged to your Apple Account when Apple confirms the purchase. Unless you turn off auto-renewal at least 24 hours before the current period ends, Apple may renew and charge the subscription for the next period. You can manage or cancel it in your Apple Account subscription settings. Cancellation stops future renewal but normally leaves access available through the already-paid period.</p>
          <p className="text-[#a89984] mb-4 leading-relaxed">A free trial may be offered for an eligible product or account. Eligibility, trial length, price, billing period, and any required consent are shown by Luv and Apple before purchase; the terms displayed at checkout control.</p>
          <p className="text-[#a89984] mb-4 leading-relaxed"><span className="text-[#ebdbb2]">Lifetime</span> is a one-time, non-consumable purchase and does not auto-renew. It provides Premium access for the duration Luv offers the applicable Premium service; it is not a promise that the app or every feature will exist forever. Purchases may be restorable through the Apple Account that owns them.</p>
          <p className="text-[#a89984] leading-relaxed">The price shown in the App Store purchase sheet before confirmation is the price that applies, including any local currency and taxes Apple displays. Apple processes billing and decides refund requests. Luv cannot issue an App Store refund directly. If Apple refunds, revokes, or reverses a purchase, the related Premium access may end. You can <a href="https://support.apple.com/billing" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">manage billing with Apple</a> or <a href="https://reportaproblem.apple.com/" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">request a refund from Apple</a>.</p>
        </>
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
          Your use is also governed by our <a href="/privacy" className="text-[#d3869b] hover:underline">Privacy Policy</a>, which explains how we collect, use, and protect your information.
        </p>
      ),
    },
    {
      num: "10",
      title: "Disclaimers",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          The app is provided "as is" and "as available." We do not guarantee uninterrupted, immediate, or error-free operation. Apple controls important parts of push notifications, widget refresh scheduling, purchases, and device permissions. We disclaim warranties only to the extent permitted by applicable law.
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
          Luv relies on third-party services including Apple, Supabase, PostHog, and Meta. Their availability and processing are governed by their own terms and policies. See our <a href="/privacy" className="text-[#d3869b] hover:underline">Privacy Policy</a> for details about the data involved.
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
          Applicable law governs these terms. Nothing here limits consumer or privacy rights that cannot legally be waived. If any provision is unenforceable, the remaining provisions continue to apply. These terms, together with our Privacy Policy and the purchase terms Apple shows at checkout, form the agreement governing your use of Luv.
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
      className="cinematic-theme min-h-screen relative overflow-hidden"
    >
      <div className="fixed inset-0 z-0 bg-[#1f1b18]" />
      <div className="fixed inset-0 z-0 bg-grid-theme opacity-[0.4] pointer-events-none" />
      <div className="fixed inset-0 z-0 film-grain pointer-events-none" />
      <PageNav />

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 relative">
          <div
            className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 w-[560px] h-[560px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(211,134,155,0.10) 0%, rgba(211,134,155,0) 70%)" }}
          />
          <div className="max-w-[900px] mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-8">
                <a href="/" className="font-mono text-[13px] tracking-wide text-[#a89984] hover:text-[#fbf1c7] transition-colors">← luv</a>
              </div>
              <p className="font-mono text-[11px] text-[#928374] uppercase tracking-[0.25em] mb-6">Last updated August 25, 2026</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-silver-matte">Terms of Service</h1>
              <p className="text-lg text-[#ebdbb2]/70 max-w-lg mx-auto leading-relaxed">
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
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.12 * i }}
                  className="surface-panel surface-panel-hover rounded-3xl p-7"
                >
                  <div className="text-[#d3869b] mb-5 relative w-fit">
                    <div className="absolute -inset-2 bg-[#d3869b]/15 rounded-full blur-md" />
                    <div className="relative">{card.icon}</div>
                  </div>
                  <h3 className="text-sm text-[#fbf1c7] font-semibold tracking-tight mb-2">{card.title}</h3>
                  <p className="text-xs text-[#a89984] leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="px-6 pb-32">
          <div className="max-w-[820px] mx-auto">
            <div className="cinematic-divider max-w-[600px] mx-auto mb-4" />
            <div>
              {sections.map((section, i) => (
                <AnimatedSection key={i} delay={0.05 * i}>
                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-12 py-10">
                    <div>
                      <span className="font-mono text-[11px] text-[#928374] uppercase tracking-[0.2em] block mb-2">{section.num}</span>
                      <h2 className="text-lg text-3d-matte font-bold tracking-tight">{section.title}</h2>
                    </div>
                    <div className="text-sm">{section.content}</div>
                  </div>
                  {i < sections.length - 1 && <div className="cinematic-divider max-w-[600px] mx-auto" />}
                </AnimatedSection>
              ))}
            </div>
            <div className="cinematic-divider max-w-[600px] mx-auto mt-4" />
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 pb-20">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-sm text-[#a89984]">
              Questions? <a href="mailto:support@luvnote.app" className="text-[#d3869b] hover:underline">support@luvnote.app</a>
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
