import React, { useState } from 'react';
import { Copy, Check, QrCode, BarChart3, Trash2, ExternalLink } from 'lucide-react';
import { Button } from './ui/index';
import { QrCodeModal } from './QrCodeModal';
import { Link as RouterLink } from 'react-router-dom';

export const LinkTable = ({ links, onDelete, isLoading }) => {
  const [copiedId, setCopiedId] = useState(null);
  const [qrModalData, setQrModalData] = useState(null);

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link.shortUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        Loading links...
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No short links found</p>
        <p style={{ fontSize: '0.875rem' }}>Create your first branded short link above to begin tracking click telemetry!</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              <th style={{ padding: '14px 16px' }}>Short Link & Vanity Slug</th>
              <th style={{ padding: '14px 16px' }}>Original Destination</th>
              <th style={{ padding: '14px 16px' }}>Clicks</th>
              <th style={{ padding: '14px 16px' }}>Created</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr
                key={link.id}
                style={{
                borderBottom: '1px solid rgba(99, 102, 241, 0.05)',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Short Link column */}
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        textDecoration: 'none'
                      }}
                    >
                      /r/{link.shortCode}
                    </a>
                    {link.isCustomAlias && (
                      <span className="badge badge-indigo">Vanity</span>
                    )}
                  </div>
                  {link.title && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {link.title}
                    </div>
                  )}
                </td>

                {/* Destination URL */}
                <td style={{ padding: '16px', maxWidth: '280px' }}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}
                    title={link.destinationUrl}
                  >
                    <a
                      href={link.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      {link.destinationUrl}
                      <ExternalLink size={12} style={{ opacity: 0.5 }} />
                    </a>
                  </div>
                </td>

                {/* Clicks */}
                <td style={{ padding: '16px' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.85rem' }}>
                    {link.clickCount.toLocaleString()} clicks
                  </span>
                </td>

                {/* Created At */}
                <td style={{ padding: '16px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  {new Date(link.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopy(link)}
                      title="Copy short link to clipboard"
                    >
                      {copiedId === link.id ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                      {copiedId === link.id ? 'Copied' : 'Copy'}
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setQrModalData(link)}
                      title="Generate Scannable QR Code"
                    >
                      <QrCode size={14} />
                    </Button>

                    <RouterLink to={`/analytics/${link.id}`}>
                      <Button variant="secondary" size="sm" title="View Click Telemetry">
                        <BarChart3 size={14} />
                      </Button>
                    </RouterLink>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete shortlink /r/${link.shortCode}?`)) {
                          onDelete(link.id);
                        }
                      }}
                      title="Delete Link"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Code Dialog */}
      {qrModalData && (
        <QrCodeModal
          isOpen={!!qrModalData}
          onClose={() => setQrModalData(null)}
          shortUrl={qrModalData.shortUrl}
          title={qrModalData.title || qrModalData.shortCode}
        />
      )}
    </>
  );
};
