import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Card, Button, Input } from '../components/ui/index';
import { Link2, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.message || '');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.user, res.data.accessToken);
        navigate('/');
      }
    } catch (err) {
      const fieldErrors = err.response?.data?.errors;
      const msg = fieldErrors && fieldErrors.length > 0
        ? fieldErrors.map(e => e.message).join(', ')
        : (err.response?.data?.message || 'Login failed. Please verify credentials.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'alex') {
      setEmail('alex@example.com');
      setPassword('Password123!');
    } else {
      setEmail('sarah@example.com');
      setPassword('Password123!');
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)' }}>
              <Link2 size={26} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Sign in to manage your branded links and bio hub
          </p>
        </div>

        <Card>
          {error && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.25)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#059669', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" loading={loading} style={{ marginTop: '8px', width: '100%' }}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1.5px solid var(--border-color)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
              Quick 1-Click Demo Accounts (Pre-Seeded)
            </span>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button variant="secondary" size="sm" onClick={() => handleDemoFill('alex')}>
                Alex (Tech/Creator)
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleDemoFill('sarah')}>
                Sarah (Design)
              </Button>
            </div>
          </div>
        </Card>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
