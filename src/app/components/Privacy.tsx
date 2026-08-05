import "../../styles/cinematic.css";
import { motion } from "motion/react";
import { Shield, EyeOff, UserCheck, Server } from "lucide-react";
import { PageNav } from "./PageNav";
import { AnimatedSection } from "./AnimatedSection";

export function Privacy() {
  const tldrCards = [
    { icon: <Shield className="w-5 h-5" />, title: "Encrypted & Access Controlled", desc: "Protected in transit and at rest, with app access limited to your connected couple" },
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
          <p className="text-[#a89984] mb-4 leading-relaxed"><span className="text-[#ebdbb2]">Notes</span> you send are processed and stored by Luv's backend so we can deliver them to your connected partner and show them in the app and widget. We also store connection codes and partner relationships.</p>
          <p className="text-[#a89984] mb-4 leading-relaxed">We automatically collect <span className="text-[#ebdbb2]">technical information</span> needed to operate the service, including push notification tokens, app and device identifiers, product usage events, and diagnostic data.</p>
          <p className="text-[#a89984] leading-relaxed"><span className="text-[#ebdbb2]">Analytics.</span> We send explicit first-party product events to PostHog, such as app opens, sign-ups, partner connections, feature use, and purchases. An event includes its name, an anonymous or app-account UUID, a timestamp, app version, build number, platform, and limited context such as the screen or selected plan. Events <span className="text-[#ebdbb2]">never include note content</span>, names, email addresses, invite codes, or partner identifiers.</p>
        </>
      ),
    },
    {
      num: "02",
      title: "How We Use It",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          We use your information to provide and improve the app, process and deliver notes to your partner's widget via push notifications, authenticate your identity, manage subscriptions, analyze product usage, and protect the service from abuse and security threats.
        </p>
      ),
    },
    {
      num: "03",
      title: "Data Storage & Security",
      content: (
        <>
          <p className="text-[#a89984] mb-4 leading-relaxed">Luv uses managed Supabase infrastructure for authentication, database storage, and backend processing. Data is encrypted in transit and at rest, and app-level access controls limit notes to the connected couple.</p>
          <p className="text-[#a89984] leading-relaxed">Luv's service still processes and stores note content to provide delivery, history, and widget functionality. This is managed service encryption, not client-only encryption. No method of transmission or storage is completely secure.</p>
        </>
      ),
    },
    {
      num: "04",
      title: "Data Sharing",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          We don't sell your data. We disclose information only to your <span className="text-[#ebdbb2]">connected partner</span> as part of the app, to <span className="text-[#ebdbb2]">service providers</span> that help operate Luv (Supabase, Apple, and PostHog — see section 06), when <span className="text-[#ebdbb2]">legally required</span>, or as part of a business transfer. Note content is not sent to analytics providers or advertising networks.
        </p>
      ),
    },
    {
      num: "05",
      title: "Push Notifications",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Remote and silent push notifications ask iOS to refresh your partner's widget. Apple controls delivery timing and does not guarantee an immediate refresh. We store push tokens associated with your device. Disabling notifications prevents automatic widget refresh requests.
        </p>
      ),
    },
    {
      num: "06",
      title: "Third-Party Services",
      content: (
        <>
          <p className="text-[#a89984] mb-3 leading-relaxed">We use <span className="text-[#ebdbb2]">Supabase</span> for authentication, database storage, and backend services. We use <span className="text-[#ebdbb2]">Apple</span> for services including Sign in with Apple, push notifications, App Store purchases, and subscription management.</p>
          <p className="text-[#a89984] mb-3 leading-relaxed">We use <span className="text-[#ebdbb2]">PostHog</span> to measure how people use Luv and improve the product. PostHog receives the explicit, bounded product-event fields described above, not note content, names, email addresses, invite codes, or partner identifiers.</p>
          <p className="text-[#a89984] mb-3 leading-relaxed">The iOS app does not include advertising SDKs and does not request tracking permission. We do not send note content to analytics providers or advertising networks.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#928374]">
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">supabase.com/privacy</a>
            <a href="https://www.apple.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">apple.com/privacy</a>
            <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">posthog.com/privacy</a>
          </div>
        </>
      ),
    },
    {
      num: "07",
      title: "Data Retention",
      content: (
        <>
          <p className="text-[#a89984] mb-4 leading-relaxed">We keep your personal information as long as needed to provide Luv. Requesting account deletion immediately freezes account access while a background process removes your account, notes, profile photo, relationship data, device credentials, and authentication record. The app keeps a protected receipt on your device until you acknowledge completion, and the server keeps its capability-protected receipt for 30 days after completion.</p>
          <p className="text-[#a89984] leading-relaxed">After deletion, Luv may retain non-reversible cryptographic hashes and minimal timestamps for up to seven years to prevent deleted identities or Apple subscription ownership from being replayed or reassigned fraudulently. These records do not contain your email address, display name, note content, profile photo, or raw Apple transaction identifier. We may also retain information where required by law.</p>
        </>
      ),
    },
    {
      num: "08",
      title: "Your Rights",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          You can <span className="text-[#ebdbb2]">access</span> your data through settings, <span className="text-[#ebdbb2]">update</span> your profile anytime, <span className="text-[#ebdbb2]">delete</span> your account and data, or <span className="text-[#ebdbb2]">export</span> your data by contacting us. Deleting your Luv account does not cancel a subscription billed by Apple; manage or cancel it from Apple's subscription settings.
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
      className="cinematic-theme min-h-screen relative overflow-hidden"
    >
      <div className="fixed inset-0 z-0 bg-[#1f1b18]" />
      <div className="fixed inset-0 z-0 bg-grid-theme opacity-[0.4] pointer-events-none" />
      <div className="fixed inset-0 z-0 film-grain pointer-events-none" />
      <PageNav />

      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 relative">
          {/* Rose radial glow behind title */}
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
              <p className="font-mono text-[11px] text-[#928374] uppercase tracking-[0.25em] mb-6">Last updated August 4, 2026</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-silver-matte">Privacy Policy</h1>
              <p className="text-lg text-[#ebdbb2]/70 max-w-lg mx-auto leading-relaxed">
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
