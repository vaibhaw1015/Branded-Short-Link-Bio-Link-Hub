import React from 'react';
import { Sparkles, Moon, Sun } from 'lucide-react';

export const ThemeSwitcher = ({ currentTheme = 'minimal-light', onSelectTheme }) => {
  const themes = [
    {
      id: 'minimal-light',
      name: 'Minimal Light',
      icon: <Sun size={18} color="#f59e0b" />,
      previewBg: '#ffffff',
      previewText: '#0f172a',
      desc: 'Clean, crisp modern aesthetic with subtle borders'
    },
    {
      id: 'dark-slate',
      name: 'Dark Slate',
      icon: <Moon size={18} color="#818cf8" />,
      previewBg: '#0f172a',
      previewText: '#f8fafc',
      desc: 'High-contrast charcoal & deep navy glass surface'
    },
    {
      id: 'gradient',
      name: 'Vibrant Gradient',
      icon: <Sparkles size={18} color="#ec4899" />,
      previewBg: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
      previewText: '#ffffff',
      desc: 'Vivid, modern creator gradient with glowing buttons'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
      {themes.map((theme) => {
        const isSelected = currentTheme === theme.id;
        return (
          <div
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            style={{
              padding: '14px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)'}`,
              background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.03)',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {theme.icon}
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                  {theme.name}
                </span>
              </div>
              {isSelected && (
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              )}
            </div>

            {/* Thumbnail preview */}
            <div
              style={{
                height: '48px',
                borderRadius: '8px',
                background: theme.previewBg,
                border: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
            >
              <div
                style={{
                  width: '60%',
                  height: '14px',
                  borderRadius: '4px',
                  background: isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(2px)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
