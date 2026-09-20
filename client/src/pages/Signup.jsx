import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Card, Button, Input } from '../components/ui/index';
import { Link2, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

export const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationData, setVerificationData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/signup', {
        name,
        username,
        email,
        password
      });

      if (res.data.success) {
        setVerificationData({
          token: res.data.verificationToken,
          url: res.data.simulatedVerificationUrl
        });
      }
    } catch (err) {
      const fieldErrors = err.response?.data?.errors;
      const msg = fieldErrors && fieldErrors.length > 0
        ? fieldErrors.map(e => e.message).join(', ')
        : (err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot reach server. Ensure backend is running at http://localhost:5000' : (err.message || 'Signup failed.')));
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)' }}>
              <Link2 size={26} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Start Your Hub</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Create short links and launch your personalized link-in-bio page
          </p>
        </div>

        <Card>
          {error && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.25)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {verificationData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '6px' }}>
                  <CheckCircle2 size={18} />
                  <span>Account Created Successfully!</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Your verification token is shown below. Copy it and paste it on the next screen to activate your account.
                </p>
              </div>

              <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Terminal size={14} />
                    <span>YOUR VERIFICATION TOKEN</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(verificationData.token || '');
                      alert('Token copied to clipboard!');
                    }}
                    style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'none', border: '1px solid var(--accent-primary)', borderRadius: '6px', padding: '2px 8px', cursor: 'pointer' }}
                  >
                    Copy
                  </button>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-primary)', wordBreak: 'break-all', lineHeight: 1.6 }}>
                  {verificationData.token || 'Token not returned — check server logs'}
                </div>
              </div>

              <Button
                onClick={() => navigate(`/verify-email?token=${verificationData.token || ''}`)}
                style={{ width: '100%' }}
              >
                Proceed to Verify Email →
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Input
                label="Full Name"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Username (used for /bio/:username)"
                placeholder="alexrivera"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                helperText="Letters, numbers, underscores or hyphens only"
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Must be at least 6 characters"
                required
              />

              <Button type="submit" loading={loading} style={{ marginTop: '8px', width: '100%' }}>
                Create Account
              </Button>
            </form>
          )}
        </Card>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
