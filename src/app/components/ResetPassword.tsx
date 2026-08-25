import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from "motion/react";
import {
  clearPasswordRecoverySession,
  initialAuthRedirectHadRecoveryMarker,
  subscribeToPasswordRecovery,
  supabase,
} from "../../lib/supabase";
import "../../styles/cinematic.css";

type RecoveryState = 'verifying' | 'ready' | 'invalid' | 'complete';
const PASSWORD_UPDATED_RELOAD_KEY = 'luv-password-updated-after-recovery';

function consumePasswordUpdatedReloadMarker() {
  if (typeof window === 'undefined') return false;
  try {
    const wasUpdated = window.sessionStorage.getItem(PASSWORD_UPDATED_RELOAD_KEY) === '1';
    window.sessionStorage.removeItem(PASSWORD_UPDATED_RELOAD_KEY);
    return wasUpdated;
  } catch {
    return false;
  }
}

function reloadWithoutRecoveryCredentials(afterPasswordUpdate = false) {
  clearPasswordRecoverySession();
  if (afterPasswordUpdate) {
    try {
      window.sessionStorage.setItem(PASSWORD_UPDATED_RELOAD_KEY, '1');
    } catch {
      // The clean reload still destroys the memory-only recovery session.
    }
  }
  window.location.replace('/reset');
}

export default function ResetPassword() {
  const reduceMotion = useReducedMotion();
  const [completedAfterReload] = useState(consumePasswordUpdatedReloadMarker);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [recoveryState, setRecoveryState] = useState<RecoveryState>(
    completedAfterReload
      ? 'complete'
      : initialAuthRedirectHadRecoveryMarker
        ? 'verifying'
        : 'invalid'
  );
  const statePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (completedAfterReload) {
      setMessage('Password updated. This browser no longer holds the recovery session. You can now sign in with your new password in the Luv app.');
    }
  }, [completedAfterReload]);

  useEffect(() => {
    if (recoveryState !== 'ready') statePanelRef.current?.focus();
  }, [recoveryState]);

  useEffect(() => {
    if (completedAfterReload) return;
    if (!initialAuthRedirectHadRecoveryMarker) {
      setRecoveryState('invalid');
      return;
    }

    let active = true;
    let verificationFinished = false;
    let verificationTimer = window.setTimeout(() => {
      if (active && !verificationFinished) {
        verificationFinished = true;
        reloadWithoutRecoveryCredentials();
      }
    }, 8000);

    async function verifyRecoverySession(expectedUserID: string) {
      const { data, error: userError } = await supabase.auth.getUser();
      if (!active || verificationFinished) return;

      if (userError || !data.user || data.user.id !== expectedUserID) {
        verificationFinished = true;
        window.clearTimeout(verificationTimer);
        reloadWithoutRecoveryCredentials();
        return;
      }

      // Keep access and refresh tokens out of the address bar after Supabase
      // has verified the recovery session. Reloading this clean URL correctly
      // returns to the expired/invalid state.
      verificationFinished = true;
      window.clearTimeout(verificationTimer);
      setRecoveryState('ready');
    }

    const unsubscribe = subscribeToPasswordRecovery((session) => {
      if (verificationFinished) return;

      if (!session?.user?.id) {
        verificationFinished = true;
        window.clearTimeout(verificationTimer);
        reloadWithoutRecoveryCredentials();
        return;
      }

      // Supabase recommends keeping auth callbacks synchronous. Verify the
      // server-backed user on the next task rather than awaiting inside it.
      window.setTimeout(() => void verifyRecoverySession(session.user.id), 0);
    });

    return () => {
      active = false;
      window.clearTimeout(verificationTimer);
      unsubscribe();
      clearPasswordRecoverySession();
    };
  }, [completedAfterReload]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (recoveryState !== 'ready') {
      setError('Open a new password-recovery link before changing your password.');
      return;
    }

    if (password.trim().length < 8) {
      setError('Use at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password
      });

      if (updateError) {
        // A failed response can arrive after the server committed the change.
        // Destroy the one-shot recovery session instead of allowing a replay
        // whose outcome is unknowable from this browser.
        reloadWithoutRecoveryCredentials();
        return;
      }

      const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' });
      clearPasswordRecoverySession();
      setPassword('');
      setConfirmPassword('');
      if (signOutError) {
        // A non-auth server failure can make supabase-js return before removing
        // its in-memory session. A hard reload deterministically destroys this
        // nonpersistent client while preserving only a one-shot success notice.
        reloadWithoutRecoveryCredentials(true);
        return;
      }
      setRecoveryState('complete');
      setMessage('Password updated and this recovery session was closed. You can now sign in with your new password in the Luv app.');
    } catch {
      // Network loss is ambiguous: the server may already have accepted the
      // password. A clean reload prevents a second update with the same token.
      reloadWithoutRecoveryCredentials();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="cinematic-theme relative min-h-screen flex items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(125% 80% at 50% -5%, rgba(211,134,155,0.10) 0%, transparent 55%)' }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.25, 1, 0.5, 1] }}
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
          {recoveryState === 'complete' ? (
            <div ref={statePanelRef} tabIndex={-1} role="status" aria-live="polite" className="text-center py-4 focus:outline-none">
              <div className="text-[30px] mb-3" aria-hidden="true">💌</div>
              <p className="text-[#fbf1c7] font-medium text-[14.5px] leading-relaxed">{message}</p>
            </div>
          ) : recoveryState === 'verifying' ? (
            <div ref={statePanelRef} tabIndex={-1} role="status" aria-live="polite" className="flex flex-col items-center py-8 focus:outline-none">
              <div
                aria-hidden="true"
                className="mb-4 rounded-full"
                style={{ width: '28px', height: '28px', border: '2px solid #d3869b', borderTopColor: 'transparent', animation: reduceMotion ? 'none' : 'spin 0.8s linear infinite' }}
              />
              <p className="text-[14px] text-[#a89984] m-0">Verifying reset link…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : recoveryState === 'invalid' ? (
            <div ref={statePanelRef} tabIndex={-1} className="text-center py-4 focus:outline-none" role="alert">
              <div className="text-[30px] mb-3" aria-hidden="true">⌛</div>
              <h2 className="text-[#fbf1c7] font-semibold text-[17px] mb-2">This reset link is not active</h2>
              <p className="text-[#a89984] text-[13.5px] leading-relaxed mb-6">
                It may be expired, already used, or missing its recovery session. Request a fresh link to continue.
              </p>
              <a href="/forgot" className="btn-modern-light inline-flex rounded-[1.05rem] px-6 py-3 text-sm font-semibold">
                Request a new link
              </a>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              {error && (
                <div role="alert" className="mb-5 rounded-xl border border-[#fb4934]/35 bg-[#fb4934]/10 px-4 py-3 text-[13px] text-[#fb6b5c]">
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
                  placeholder="8+ characters"
                  minLength={8}
                  aria-describedby="reset-password-hint"
                  autoComplete="new-password"
                  required
                  className="surface-input w-full rounded-xl px-4 py-3.5 text-[15px] text-[#fbf1c7] placeholder:text-[#ebdbb2]/25"
                />
                <p id="reset-password-hint" className="mt-2 text-xs leading-relaxed text-[#928374]">
                  Use at least 8 characters. Spaces inside the password are allowed.
                </p>
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
                  minLength={8}
                  autoComplete="new-password"
                  required
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
    </main>
  );
}
