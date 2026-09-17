import React from 'react';

export const Card = ({ children, className = '', style = {}, ...props }) => (
  <div
    className={`glass-panel ${className}`}
    style={{ padding: '24px', ...style }}
    {...props}
  >
    {children}
  </div>
);

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}) => {
  const variantClass =
    variant === 'secondary' ? 'btn-secondary' :
    variant === 'danger' ? 'btn-danger' :
    'btn-primary';
  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg
            style={{ animation: 'spin 0.8s linear infinite', width: '15px', height: '15px' }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  );
};

export const Input = ({ label, error, helperText, className = '', ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
    {label && (
      <label style={{
        fontSize: '0.85rem',
        fontWeight: 700,
        color: 'var(--text-secondary)',
        letterSpacing: '-0.01em'
      }}>
        {label}
      </label>
    )}
    <input className={`input-control ${className}`} {...props} />
    {helperText && !error && (
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helperText}</span>
    )}
    {error && (
      <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600 }}>{error}</span>
    )}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(22, 18, 63, 0.35)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          backgroundColor: '#ffffff',
          position: 'relative',
          border: '1.5px solid rgba(99, 102, 241, 0.15)',
          boxShadow: '0 20px 60px rgba(99, 102, 241, 0.18), 0 0 0 1px rgba(99, 102, 241, 0.08)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(99, 102, 241, 0.07)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '5px 9px',
              borderRadius: '8px',
              lineHeight: 1,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
              e.currentTarget.style.color = 'var(--accent-rose)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.07)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
