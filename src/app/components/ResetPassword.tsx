import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fkfyhsbhsobxmiiidtrn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZnloc2Joc29ieG1paWlkdHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDUyNDQsImV4cCI6MjA3NDIyMTI0NH0.kwn4lcEd4Xa5tA3p2rfnHhKn__6_GwkySNy5HDGfams'
);

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

    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    const timer = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(timer);
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
      setMessage('Password updated successfully! You can now sign in with your new password in the app.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fdf2f8 0%, #ffffff 50%, #ffffff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(236, 72, 153, 0.25)',
            marginBottom: '16px',
            fontSize: '32px',
          }}>
            💌
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 4px 0',
          }}>Reset Password</h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            margin: 0,
          }}>Enter your new password for Luv Note</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f3f4f6',
          padding: '32px',
        }}>
          {message ? (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <p style={{ color: '#166534', fontWeight: 500, fontSize: '15px', margin: 0 }}>{message}</p>
            </div>
          ) : !ready ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0' }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '2px solid #ec4899',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                marginBottom: '16px',
              }} />
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Verifying reset link...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              {error && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  color: '#dc2626',
                  fontSize: '14px',
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '6px',
                }}>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '6px',
                }}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Type it again"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#d1d5db' : 'linear-gradient(135deg, #ec4899, #f43f5e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(236, 72, 153, 0.25)',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#ec4899', textDecoration: 'none' }}>← Back to Luv Note</a>
        </p>
      </div>
    </div>
  );
}
