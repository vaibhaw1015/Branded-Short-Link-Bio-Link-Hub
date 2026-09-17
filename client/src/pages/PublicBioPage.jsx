import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import {
  Globe, Mail, ExternalLink, Link2, Sparkles, AlertCircle, Share2, MessageCircle
} from 'lucide-react';

const ICON_MAP = {
  globe: Globe,
  github: Globe,
  twitter: MessageCircle,
  linkedin: Share2,
  youtube: ExternalLink,
  instagram: Share2,
  mail: Mail
};

export const PublicBioPage = () => {
  const { username } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicBio', username],
    queryFn: async () => {
      const res = await api.get(`/api/bio/${username}`);
      return res.data;
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading creator profile...
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '420px', textAlign: 'center', background: '#0e1424', padding: '36px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <AlertCircle size={40} color="#f43f5e" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>Profile Not Found</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
            The bio profile for '@{username}' does not exist or has been removed.
          </p>
          <Link to="/" style={{ display: 'inline-block', padding: '10px 20px', background: '#6366f1', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 }}>
            Create Your Own Bio Hub
          </Link>
        </div>
      </div>
    );
  }

  const { user, links = [] } = data;
  const theme = user.theme || 'minimal-light';

  // Theme styling definitions
  const getThemeStyles = () => {
    if (theme === 'dark-slate') {
      return {
        bg: '#090d16',
        containerBg: 'rgba(18, 24, 38, 0.7)',
        text: '#f8fafc',
        muted: '#94a3b8',
        btnBg: 'rgba(30, 41, 59, 0.8)',
        btnHover: 'rgba(51, 65, 85, 0.9)',
        btnBorder: '1px solid rgba(255, 255, 255, 0.12)',
        btnText: '#ffffff',
        accent: '#818cf8'
      };
    }
    if (theme === 'gradient') {
      return {
        bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #831843 100%)',
        containerBg: 'rgba(255, 255, 255, 0.08)',
        text: '#ffffff',
        muted: 'rgba(255, 255, 255, 0.8)',
        btnBg: 'rgba(255, 255, 255, 0.15)',
        btnHover: 'rgba(255, 255, 255, 0.25)',
        btnBorder: '1px solid rgba(255, 255, 255, 0.25)',
        btnText: '#ffffff',
        accent: '#f472b6'
      };
    }
    // Minimal Light
    return {
      bg: '#f8fafc',
      containerBg: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
      btnBg: '#ffffff',
      btnHover: '#f1f5f9',
      btnBorder: '1px solid #e2e8f0',
      btnText: '#0f172a',
      accent: '#6366f1'
    };
  };

  const themeStyles = getThemeStyles();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: themeStyles.bg,
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 16px 60px'
      }}
    >
      <div style={{ width: '100%', maxWidth: '580px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Avatar */}
        <div
          style={{
            width: '104px',
            height: '104px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `4px solid ${themeStyles.accent}`,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
            marginBottom: '18px',
            background: 'rgba(0,0,0,0.1)'
          }}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: themeStyles.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 800 }}>
              {user.displayName?.charAt(0) || user.username?.charAt(0) || 'U'}
            </div>
          )}
        </div>

        {/* Display Name */}
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: themeStyles.text, textAlign: 'center', marginBottom: '4px' }}>
          {user.displayName || user.name}
        </h1>

        {/* Username */}
        <p style={{ fontSize: '0.875rem', color: themeStyles.accent, fontFamily: 'var(--font-mono)', fontWeight: 600, marginBottom: '12px' }}>
          @{user.username}
        </p>

        {/* Bio */}
        {user.bio && (
          <p
            style={{
              fontSize: '0.95rem',
              color: themeStyles.muted,
              textAlign: 'center',
              lineHeight: 1.55,
              maxWidth: '440px',
              marginBottom: '28px'
            }}
          >
            {user.bio}
          </p>
        )}

        {/* Custom Social Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
          {user.socialLinks && user.socialLinks.map((social, index) => {
            const IconComponent = ICON_MAP[social.icon] || Globe;
            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px 20px',
                  borderRadius: '16px',
                  background: themeStyles.btnBg,
                  border: themeStyles.btnBorder,
                  color: themeStyles.btnText,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = themeStyles.btnHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = themeStyles.btnBg;
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <IconComponent size={20} color={themeStyles.accent} />
                  <span>{social.label}</span>
                </div>
                <ExternalLink size={16} style={{ opacity: 0.6 }} />
              </a>
            );
          })}
        </div>

        {/* Creator's Branded Short Links Section */}
        {links.length > 0 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Link2 size={16} color={themeStyles.accent} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: themeStyles.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Featured Links
              </span>
            </div>

            {links.map((link) => (
              <a
                key={link.id}
                href={link.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: themeStyles.containerBg,
                  border: themeStyles.btnBorder,
                  color: themeStyles.text,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '2px' }}>
                    {link.title || link.destinationUrl}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: themeStyles.muted, fontFamily: 'var(--font-mono)' }}>
                    /r/{link.shortCode}
                  </div>
                </div>
                <ExternalLink size={16} style={{ opacity: 0.5 }} />
              </a>
            ))}
          </div>
        )}

        {/* Footer Brand */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: themeStyles.muted,
              textDecoration: 'none',
              opacity: 0.8
            }}
          >
            <Sparkles size={13} color={themeStyles.accent} />
            <span>Powered by ShortLink Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
