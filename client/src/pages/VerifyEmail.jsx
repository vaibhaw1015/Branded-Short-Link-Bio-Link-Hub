import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/ui/index';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = async (tokenToUse) => {
    const activeToken = tokenToUse || token;
    if (!activeToken) {
      setError('Please provide a verification token.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/verify-email', { token: activeToken });
      if (res.data.success) {
        setSuccess(true);
        login(res.data.user, res.data.accessToken);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Token may have expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const paramToken = searchParams.get('token');
    if (paramToken) {
      handleVerify(paramToken);
    }
  }, []);

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)' }}>
              <ShieldCheck size={28} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Verify Your Email</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Simulated email verification flow (no third-party SMTP needed)
          </p>
        </div>

        <Card>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                Email Verified!
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Your account is active. Redirecting you to your dashboard...
              </p>
            </div>
          ) : (
            <div>
              {error && (
                <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.25)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input
                  label="Verification Token"
                  placeholder="Paste token from server terminal..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  helperText="The 64-character hex token generated during signup"
                  required
                />

                <Button type="submit" loading={loading} style={{ width: '100%' }}>
                  Verify & Continue to Hub
                </Button>
              </form>
            </div>
          )}
        </Card>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Back to{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
