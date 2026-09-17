import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/ui/index';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { SocialLinkEditor } from '../components/SocialLinkEditor';
import {
  Sparkles, ArrowLeft, Upload, ExternalLink, Check, AlertCircle,
  Smartphone, UserCircle
} from 'lucide-react';

export const BioBuilder = () => {
  const { user, updateUserProfile } = useAuth();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('minimal-light');
  const [socialLinks, setSocialLinks] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  const [saveStatus, setSaveStatus] = useState('');
  const [saveError, setSaveError] = useState('');

  // 1. Fetch current bio data
  const { data: bioData, isLoading } = useQuery({
    queryKey: ['myBio'],
    queryFn: async () => {
      const res = await api.get('/api/bio');
      return res.data;
    }
  });

  useEffect(() => {
    if (bioData?.bioProfile) {
      const p = bioData.bioProfile;
      setDisplayName(p.displayName || bioData.name || '');
      setBio(p.bio || '');
      setTheme(p.theme || 'minimal-light');
      setSocialLinks(p.socialLinks || []);
      setAvatarPreview(p.avatarUrl || '');
    }
  }, [bioData]);

  // 2. Avatar Upload Mutation
  const avatarMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/api/bio/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: (data) => {
      setAvatarPreview(data.avatarUrl);
      setAvatarFile(null);
      setSaveStatus('Avatar uploaded successfully!');
      setTimeout(() => setSaveStatus(''), 4000);
      queryClient.invalidateQueries({ queryKey: ['myBio'] });
    },
    onError: (err) => {
      setSaveError(err.response?.data?.message || 'Failed to upload avatar.');
    }
  });

  // 3. Update Bio Settings Mutation
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.put('/api/bio', payload);
      return res.data;
    },
    onSuccess: (data) => {
      updateUserProfile(data.bioProfile);
      setSaveStatus('Profile updated successfully!');
      setTimeout(() => setSaveStatus(''), 4000);
      queryClient.invalidateQueries({ queryKey: ['myBio'] });
    },
    onError: (err) => {
      setSaveError(err.response?.data?.message || 'Failed to update profile.');
    }
  });

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveError('Please select a valid image file');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      avatarMutation.mutate(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveStatus('');

    updateMutation.mutate({
      displayName,
      bio,
      theme,
      socialLinks
    });
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '80px auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Bio Profile builder...
      </div>
    );
  }

  // Visual styles for live preview phone depending on theme
  const getThemeStyle = (t) => {
    if (t === 'dark-slate') {
      return {
        bg: '#0b0f19',
        card: '#161f30',
        text: '#f8fafc',
        muted: '#94a3b8',
        btnBg: '#1e293b',
        btnBorder: '1px solid rgba(255,255,255,0.1)',
        btnText: '#f8fafc'
      };
    }
    if (t === 'gradient') {
      return {
        bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
        card: 'rgba(255, 255, 255, 0.15)',
        text: '#ffffff',
        muted: 'rgba(255, 255, 255, 0.85)',
        btnBg: 'rgba(255, 255, 255, 0.2)',
        btnBorder: '1px solid rgba(255, 255, 255, 0.3)',
        btnText: '#ffffff'
      };
    }
    // Minimal Light
    return {
      bg: '#f8fafc',
      card: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
      btnBg: '#ffffff',
      btnBorder: '1px solid #e2e8f0',
      btnText: '#0f172a'
    };
  };

  const previewStyle = getThemeStyle(theme);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/">
            <Button variant="secondary" size="sm">
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Link-in-Bio Customizer
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Configure avatar, theme, bio, and social channels
            </p>
          </div>
        </div>

        <Link to={`/bio/${bioData?.username || user?.username}`} target="_blank">
          <Button variant="secondary" size="sm">
            <ExternalLink size={14} />
            Preview Live Public Page
          </Button>
        </Link>
      </div>

      {/* Main Grid: Form on Left, Live Mobile Preview on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Editor Form */}
        <Card>
          {saveStatus && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
              <Check size={16} />
              <span>{saveStatus}</span>
            </div>
          )}

          {saveError && (
            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.25)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
              <AlertCircle size={16} />
              <span>{saveError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Avatar Upload */}
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Profile Avatar (Multipart Upload &rarr; Cloudinary)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserCircle size={40} color="#64748b" />
                  )}
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    style={{ display: 'none' }}
                    disabled={avatarMutation.isPending}
                    id="avatar-upload-input"
                  />
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    loading={avatarMutation.isPending} 
                    onClick={() => document.getElementById('avatar-upload-input').click()}
                  >
                    <Upload size={14} />
                    {avatarMutation.isPending ? 'Uploading...' : 'Choose Image File'}
                  </Button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    JPG, PNG, WebP up to 5MB. Previous asset is auto-cleaned.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Display Name & Bio */}
            <Input
              label="Display Name"
              placeholder="e.g. Alex Rivera 🚀"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Bio / Tagline
              </label>
              <textarea
                rows={3}
                placeholder="Tell your visitors who you are and what you create..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* 3. Theme Selector */}
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Bio Page Theme
              </label>
              <ThemeSwitcher
                currentTheme={theme}
                onSelectTheme={(selected) => setTheme(selected)}
              />
            </div>

            {/* 4. Social Links Editor */}
            <SocialLinkEditor
              socialLinks={socialLinks}
              onChange={(links) => setSocialLinks(links)}
            />

            <Button type="submit" loading={updateMutation.isPending} style={{ width: '100%', marginTop: '12px' }}>
              Save Bio Changes
            </Button>
          </form>
        </Card>

        {/* Live Mobile Frame Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <Smartphone size={16} />
            <span>Interactive Mobile Live Preview</span>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              minHeight: '620px',
              borderRadius: '36px',
              border: '8px solid #1e293b',
              background: previewStyle.bg,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              padding: '32px 18px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Phone speaker notch */}
            <div
              style={{
                width: '70px',
                height: '5px',
                borderRadius: '999px',
                background: 'rgba(0,0,0,0.3)',
                position: 'absolute',
                top: '12px'
              }}
            />

            {/* Avatar */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${theme === 'gradient' ? '#fff' : 'rgba(99, 102, 241, 0.3)'}`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                marginBottom: '14px',
                marginTop: '10px'
              }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>
                  {displayName?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            {/* Display Name */}
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: previewStyle.text,
                textAlign: 'center',
                marginBottom: '4px'
              }}
            >
              {displayName || 'Your Name'}
            </h3>

            {/* Username */}
            <p
              style={{
                fontSize: '0.78rem',
                color: previewStyle.muted,
                fontFamily: 'var(--font-mono)',
                marginBottom: '10px'
              }}
            >
              @{bioData?.username || user?.username || 'username'}
            </p>

            {/* Bio text */}
            <p
              style={{
                fontSize: '0.825rem',
                color: previewStyle.muted,
                textAlign: 'center',
                lineHeight: 1.4,
                marginBottom: '20px',
                padding: '0 8px'
              }}
            >
              {bio || 'Your bio or tagline will appear here...'}
            </p>

            {/* Social Buttons list */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {socialLinks.length > 0 ? (
                socialLinks.map((link, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      background: previewStyle.btnBg,
                      border: previewStyle.btnBorder,
                      color: previewStyle.btnText,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {link.label || 'Link'}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px dashed rgba(150,150,150,0.4)',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: previewStyle.muted
                  }}
                >
                  Add links to preview buttons
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
