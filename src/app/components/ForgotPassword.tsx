import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
    <div style={{
      minHeight: '100vh',
      background: '#282828',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", monospace',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img
            src="/heart-love-gruvbox.gif"
            alt="Luv"
            style={{
              width: '80px',
              height: '80px',
              imageRendering: 'pixelated' as any,
              marginBottom: '20px',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
          <h1 style={{
            fontSize: '28px',
            fontWeight: 400,
            color: '#ebdbb2',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em',
          }}>Forgot Password</h1>
          <p style={{
            color: '#928374',
            fontSize: '14px',
            margin: 0,
          }}>Enter your email and we'll send you a reset link</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#3c3836',
          borderRadius: '16px',
          border: '1px solid #504945',
          padding: '32px',
        }}>
          {sent ? (
            <div style={{
              background: '#282828',
              border: '1px solid #b8bb26',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>📬</div>
              <p style={{ color: '#b8bb26', fontWeight: 500, fontSize: '15px', margin: '0 0 8px 0', lineHeight: 1.6 }}>
                Check your inbox!
              </p>
              <p style={{ color: '#928374', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
                If an account exists for <strong style={{ color: '#a89984' }}>{email}</strong>, you'll receive a password reset link shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  background: '#282828',
                  border: '1px solid #fb4934',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  color: '#fb4934',
                  fontSize: '13px',
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#a89984',
                  marginBottom: '8px',
                }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid #504945',
                    background: '#282828',
                    color: '#ebdbb2',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ebdbb2';
                    e.target.style.boxShadow = '0 0 0 2px rgba(235, 219, 178, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#504945';
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
                  background: loading ? '#504945' : '#b8bb26',
                  color: loading ? '#928374' : '#282828',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#928374', textDecoration: 'none', transition: 'color 0.2s' }}
             onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#ebdbb2'}
             onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#928374'}
          >← Back to Luv Note</a>
        </p>
      </div>
    </div>
  );
}
