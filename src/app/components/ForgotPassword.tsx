import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from "motion/react";
import "../../styles/cinematic.css";

const supabase = createClient(
  'https://fkfyhsbhsobxmiiidtrn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZnloc2Joc29ieG1paWlkdHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDUyNDQsImV4cCI6MjA3NDIyMTI0NH0.kwn4lcEd4Xa5tA3p2rfnHhKn__6_GwkySNy5HDGfams'
);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://luvnote.app/reset',
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="cinematic-theme relative min-h-screen flex items-center justify-center overflow-hidden px-5 py-16">
      {/* subtle warm depth — no heavy grid/grain murk */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(125% 80% at 50% -5%, rgba(211,134,155,0.10) 0%, transparent 55%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="relative w-full max-w-[400px]"
      >
        {/* Heading */}
        <div className="text-center mb-9">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#d3869b]">luv</span>
          <h1 className="mt-5 mb-3 text-[2.6rem] leading-[1.02] font-black tracking-tight text-[#fbf1c7]">
            Forgot password
          </h1>
          <p className="text-[#a89984] text-[15px] leading-relaxed max-w-[310px] mx-auto">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {/* Clean elevated panel — lighter than the bg, real edges */}
        <div
          className="rounded-[1.6rem] p-7 border border-[#ebdbb2]/10"
          style={{
            background: 'linear-gradient(180deg, rgba(235,219,178,0.06) 0%, rgba(235,219,178,0.02) 100%)',
            boxShadow: '0 30px 60px -22px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {sent ? (
            <div className="text-center py-4">
              <div className="text-[30px] mb-3">📬</div>
              <p className="text-[#fbf1c7] font-semibold text-[16px] mb-2">Check your inbox</p>
              <p className="text-[#a89984] text-[13.5px] leading-relaxed">
                If an account exists for{' '}
                <span className="text-[#ebdbb2] font-medium">{email}</span>, a reset link is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-5 rounded-xl border border-[#fb4934]/35 bg-[#fb4934]/10 px-4 py-3 text-[13px] text-[#fb6b5c] leading-relaxed">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#ebdbb2]/45 mb-2.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                  className="w-full rounded-xl border border-[#ebdbb2]/14 bg-[#120d0b] px-4 py-3.5 text-[15px] text-[#fbf1c7] placeholder:text-[#ebdbb2]/25 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] outline-none transition-all focus:border-[#d3869b]/70 focus:ring-2 focus:ring-[#d3869b]/25"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-modern-light w-full px-8 py-3.5 rounded-[1.1rem] text-[15px] font-semibold tracking-tight disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center mt-7 text-[13px]">
          <a href="/" className="font-mono text-[#928374] no-underline transition-colors hover:text-[#fbf1c7]">
            ← luv
          </a>
        </p>
      </motion.div>
    </div>
  );
}
