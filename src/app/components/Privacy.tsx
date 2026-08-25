import "../../styles/cinematic.css";
import { motion } from "motion/react";
import { Shield, EyeOff, UserCheck, Server } from "lucide-react";
import { PageNav } from "./PageNav";
import { AnimatedSection } from "./AnimatedSection";

export function Privacy() {
  const tldrCards = [
    { icon: <Shield className="w-5 h-5" />, title: "Stored for Delivery", desc: "Notes are encrypted in transit and stored by Luv; they are not end-to-end encrypted" },
    { icon: <EyeOff className="w-5 h-5" />, title: "No Data-Broker Sale", desc: "We do not sell personal information for money; Meta attribution may count as sharing under some laws" },
    { icon: <UserCheck className="w-5 h-5" />, title: "Deletion Requests", desc: "Deletion is asynchronous, and the app reports when processing is complete" },
    { icon: <Server className="w-5 h-5" />, title: "Service Providers", desc: "Supabase, Apple, PostHog, Meta, and Vercel help operate Luv and luvnote.app" },
  ];

  const sections = [
    {
      num: "01",
      title: "Information We Collect",
      content: (
        <>
          <p className="text-[#a89984] mb-4 leading-relaxed"><span className="text-[#ebdbb2]">Account and profile data.</span> When you create an account, we collect your email address, display name, account identifier, and authentication records. If you add a profile photo, we store the image and its delivery URL.</p>
          <p className="text-[#a89984] mb-4 leading-relaxed"><span className="text-[#ebdbb2]">Relationship and content data.</span> We store connection codes, partner relationships, notes and scheduled notes, delivery and creation timestamps, and relationship activity such as streak or note totals so the app can provide its features.</p>
          <p className="text-[#a89984] mb-4 leading-relaxed"><span className="text-[#ebdbb2]">Device and service data.</span> We process Apple push-notification tokens and app-generated device, session, and widget credentials. After sign-in, Luv may store a coarse, allowlisted diagnostic category and feature context together with your account ID, app version, build number, and time. That Luv diagnostic record does not contain exception text or an arbitrary developer message. Separately, Meta's SDK may collect device, advertising, crash, and other technical data as described in section 06.</p>
          <p className="text-[#a89984] mb-4 leading-relaxed"><span className="text-[#ebdbb2]">Purchase data.</span> For Premium, we process Apple product and transaction identifiers, subscription or purchase status, expiration or revocation information, purchase environment, and an app-account token used to associate Apple's result with your Luv account. Apple processes your payment details; Luv does not receive your full card number.</p>
          <p className="text-[#a89984] mb-4 leading-relaxed"><span className="text-[#ebdbb2]">Product analytics.</span> PostHog receives events such as app opens, onboarding steps, partner connections, widget setup actions, paywall activity, and purchase outcomes. Before sign-in, events use a randomly generated analytics identifier; after sign-in, events use your Luv account ID and may be joined with earlier anonymous events. Luv's event properties are designed not to include note text, email address, display name, profile photo, or partner details.</p>
          <p className="text-[#a89984] leading-relaxed"><span className="text-[#ebdbb2]">Website and hosting data.</span> When you visit luvnote.app, Vercel and ordinary web infrastructure may process your IP address, requested page, date and time, browser or device information, referrer, and technical request or security logs needed to deliver and protect the website. Luv does not currently run a separate product-analytics tracker on the public website.</p>
        </>
      ),
    },
    {
      num: "02",
      title: "How We Use It",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          We use this information to create and secure accounts, connect partners, store and deliver notes, refresh widgets, process Premium access, provide support, diagnose failures, prevent abuse, understand product usage, and measure advertising results.
        </p>
      ),
    },
    {
      num: "03",
      title: "Data Storage & Security",
      content: (
        <>
          <p className="text-[#a89984] mb-4 leading-relaxed">Luv uses encrypted HTTPS connections when transmitting data and stores account data and note content with Supabase. Notes are <span className="text-[#ebdbb2]">not end-to-end encrypted</span>: Luv's backend and authorized service providers can technically process stored note content when needed to operate, secure, support, or comply with legal obligations for the service.</p>
          <p className="text-[#a89984] mb-4 leading-relaxed">Profile photos are currently stored in a public-read Supabase Storage location so the app can display them. Anyone who obtains a photo's URL may be able to view it, so do not upload an image you do not want stored this way.</p>
          <p className="text-[#a89984] leading-relaxed">We use access controls and other safeguards intended to protect data, but no storage or transmission method is completely secure.</p>
        </>
      ),
    },
    {
      num: "04",
      title: "Data Sharing",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          We do not sell personal information for money or rent it to data brokers. We disclose data to your <span className="text-[#ebdbb2]">connected partner</span> as the product requires; to <span className="text-[#ebdbb2]">Supabase, Apple, PostHog, Meta, and Vercel</span> for the purposes described here; when required by law or needed to protect rights, safety, and the service; and as part of a merger, financing, acquisition, or sale of assets, subject to applicable law. Depending on where you live, Meta advertising attribution may be treated as “sharing,” targeted advertising, or a similar regulated activity even when no money changes hands. You can deny or later disable Apple tracking permission as described below.
        </p>
      ),
    },
    {
      num: "05",
      title: "Push Notifications",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          Luv stores an Apple Push Notification service token and related app-generated device or session identifiers to request background widget refreshes. The background signal is designed not to contain your note text; the app retrieves the note from Luv's backend. Apple and iOS control whether and when a background update runs, so widget delivery is not guaranteed to be immediate. Disabling notifications, force-quitting the app, connectivity problems, or system scheduling may delay updates until the app is opened again.
        </p>
      ),
    },
    {
      num: "06",
      title: "Third-Party Services",
      content: (
        <>
          <p className="text-[#a89984] mb-3 leading-relaxed"><span className="text-[#ebdbb2]">Supabase</span> provides authentication, database, storage, and backend functions. <span className="text-[#ebdbb2]">Apple</span> provides Sign in with Apple, push notifications, App Tracking Transparency, and App Store purchases.</p>
          <p className="text-[#a89984] mb-3 leading-relaxed"><span className="text-[#ebdbb2]">PostHog</span> receives the product-analytics events described in section 01. We use its hosted service to understand adoption, reliability, and conversion.</p>
          <p className="text-[#a89984] mb-3 leading-relaxed"><span className="text-[#ebdbb2]">Meta</span> provides advertising and install-attribution technology through the Meta SDK. The SDK may receive install, app-open, purchase-related, device, advertising, crash, and technical event data. If Apple presents the App Tracking Transparency prompt and you authorize tracking, Meta may access your Advertising Identifier (IDFA) for attribution. If you do not authorize tracking, iOS prevents IDFA access, although Meta may still process limited event and technical data that does not use the IDFA. Luv does not intentionally add note text, names, email addresses, profile photos, or partner details to Meta events.</p>
          <p className="text-[#a89984] mb-3 leading-relaxed"><span className="text-[#ebdbb2]">Vercel</span> hosts luvnote.app and may process the website request and security-log data described in section 01 to deliver and protect the site.</p>
          <p className="text-[#a89984] mb-3 leading-relaxed">Tracking permission can be changed in <span className="text-[#ebdbb2]">iOS Settings → Privacy &amp; Security → Tracking → luv</span>. Denying tracking does not disable Luv's core messaging features.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#928374]">
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">supabase.com/privacy</a>
            <a href="https://www.apple.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">apple.com/privacy</a>
            <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">posthog.com/privacy</a>
            <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">meta.com/privacy</a>
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#d3869b] hover:underline">vercel.com/privacy</a>
          </div>
        </>
      ),
    },
    {
      num: "07",
      title: "Data Retention",
      content: (
        <>
          <p className="text-[#a89984] mb-4 leading-relaxed">We generally retain account, relationship, and note data while your account is active and as reasonably needed to provide, secure, and support the service. Different records may be kept for different periods for fraud prevention, accounting, legal compliance, dispute resolution, or backup recovery.</p>
          <p className="text-[#a89984] leading-relaxed">Account deletion is asynchronous. A request is not complete merely because you tapped Delete Account: wait for the in-app status to confirm completion. The app may report that a request is unconfirmed, delayed, or temporarily unavailable. If in-app deletion is unavailable or you cannot access the app, contact <a href="mailto:privacy@luvnote.app" className="text-[#d3869b] hover:underline">privacy@luvnote.app</a>.</p>
        </>
      ),
    },
    {
      num: "08",
      title: "Your Rights",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          You can update certain profile information in the app. Depending on where you live, you may also have rights to request access, correction, deletion, restriction, portability, or an explanation of how we process your personal information. Send requests to <a href="mailto:privacy@luvnote.app" className="text-[#d3869b] hover:underline">privacy@luvnote.app</a>. We may need to verify your identity before responding.
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
          Our service providers may process information in the United States and other countries. Privacy protections in those places may differ from those where you live. Their linked privacy materials describe their processing and transfer practices. Contact us if you have a question about where your information is handled.
        </p>
      ),
    },
    {
      num: "11",
      title: "Scope, Operator & Contact",
      content: (
        <p className="text-[#a89984] leading-relaxed">
          This policy covers the Luv iOS app and luvnote.app. Privacy and data-rights requests are handled by the independent developer operating Luv at <a href="mailto:privacy@luvnote.app" className="text-[#d3869b] hover:underline">privacy@luvnote.app</a>, and general support requests can be sent to <a href="mailto:support@luvnote.app" className="text-[#d3869b] hover:underline">support@luvnote.app</a>.
        </p>
      ),
    },
    {
      num: "12",
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
              <p className="font-mono text-[11px] text-[#928374] uppercase tracking-[0.25em] mb-6">Last updated August 25, 2026</p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-silver-matte">Privacy Policy</h1>
              <p className="text-lg text-[#ebdbb2]/70 max-w-lg mx-auto leading-relaxed">
                How the Luv app and luvnote.app handle information.
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
              Questions? <a href="mailto:privacy@luvnote.app" className="text-[#d3869b] hover:underline">privacy@luvnote.app</a>
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
