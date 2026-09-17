import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { Card, Button, Input } from '../components/ui/index';
import { KeyRound, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  // Mode: 'request' (forgot password) or 'reset' (new password with token)
  const [mode, setMode] = useState(initialToken ? 'reset' : 'request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [simulatedToken, setSimulatedToken] = useState('');

  // Request Reset Token Flow
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      if (res.data.success) {
        setMessage('Reset instructions generated! Token has been outputted to the server console.');
        if (res.data.resetToken) {
          setSimulatedToken(res.data.resetToken);
          setToken(res.data.resetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset.');
    } finally {
      setLoading(false);
    }
  };

  // Perform Reset Password Flow
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password', { token, password });
      if (res.data.success) {
        setMessage('Password reset successfully! All previous sessions have been invalidated.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)' }}>
              <KeyRound size={26} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {mode === 'request' ? 'Forgot Password' : 'Set New Password'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            {mode === 'request' ? 'Request a simulated password reset token' : 'Enter your token and choose a new secure password'}
          </p>
        </div>

        <Card>
          {error && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.25)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{message}</span>
            </div>
          )}

          {mode === 'request' ? (
            <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" loading={loading} style={{ width: '100%' }}>
                Generate Reset Link
              </Button>

              {simulatedToken && (
                <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <Terminal size={14} />
                    <span>SIMULATED RESET TOKEN CAPTURED</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-amber)', wordBreak: 'break-all', marginBottom: '10px' }}>
                    {simulatedToken}
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setMode('reset')} style={{ width: '100%' }}>
                    Proceed to Reset Password Now
                  </Button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Input
                label="Reset Token"
                placeholder="Paste reset token from terminal..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button type="submit" loading={loading} style={{ marginTop: '6px', width: '100%' }}>
                Save New Password
              </Button>
            </form>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
            <button
              type="button"
              onClick={() => { setMode(mode === 'request' ? 'reset' : 'request'); setError(''); setMessage(''); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              {mode === 'request' ? 'Have a token? Reset password' : 'Need a token? Request one'}
            </button>
            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
