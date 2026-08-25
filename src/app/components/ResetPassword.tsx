import { useState, useEffect } from 'react';
import { motion } from "motion/react";
import { supabase } from "../../lib/supabase";
import "../../styles/cinematic.css";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      setReady(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    const timer = setTimeout(() => setReady(true), 2000);
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Password updated! You can now sign in with your new password in the luv app.');
    }
  };

  return (
    <div className="cinematic-theme relative min-h-screen flex items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(125% 80% at 50% -5%, rgba(211,134,155,0.10) 0%, transparent 55%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="relative w-full max-w-[400px]"
      >
        <div className="text-center mb-9">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#d3869b]">luv · account</span>
          <h1 className="mt-5 mb-3 text-[2.6rem] leading-[1.02] font-black tracking-tight text-[#fbf1c7]">
            Reset password
          </h1>
          <p className="text-[#a89984] text-[15px] leading-relaxed">Choose a new password for your luv account.</p>
        </div>

        <div className="surface-panel rounded-[1.6rem] p-7">
          {message ? (
            <div className="text-center py-4">
              <div className="text-[30px] mb-3">💌</div>
              <p className="text-[#fbf1c7] font-medium text-[14.5px] leading-relaxed">{message}</p>
            </div>
          ) : !ready ? (
            <div className="flex flex-col items-center py-8">
              <div
                className="mb-4 rounded-full"
                style={{ width: '28px', height: '28px', border: '2px solid #d3869b', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}
              />
              <p className="text-[14px] text-[#a89984] m-0">Verifying reset link…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              {error && (
                <div className="mb-5 rounded-xl border border-[#fb4934]/35 bg-[#fb4934]/10 px-4 py-3 text-[13px] text-[#fb6b5c]">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="reset-password" className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-[#ebdbb2]/45">
                  New password
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="surface-input w-full rounded-xl px-4 py-3.5 text-[15px] text-[#fbf1c7] placeholder:text-[#ebdbb2]/25"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="reset-confirm-password" className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-[#ebdbb2]/45">
                  Confirm password
                </label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Type it again"
                  className="surface-input w-full rounded-xl px-4 py-3.5 text-[15px] text-[#fbf1c7] placeholder:text-[#ebdbb2]/25"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-modern-light w-full px-8 py-3.5 rounded-[1.1rem] text-[15px] font-semibold tracking-tight disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-7 text-[13px]">
          <a href="/" className="font-mono text-[#928374] no-underline transition-colors hover:text-[#fbf1c7]">
            ← luv
          </a>
        </p>
      </motion.div>
    </div>
  );
}
