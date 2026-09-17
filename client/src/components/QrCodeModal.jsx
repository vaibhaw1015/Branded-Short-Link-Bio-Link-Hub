import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal, Button } from './ui/index';
import { Download, Copy, Check } from 'lucide-react';

export const QrCodeModal = ({ isOpen, onClose, shortUrl, title }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${title || 'shortlink'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code Generator">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div
          style={{
            background: '#ffffff',
            padding: '16px',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <QRCodeSVG
            id="qr-code-svg"
            value={shortUrl}
            size={220}
            level="H"
            includeMargin={true}
          />
        </div>

        <div style={{ textAlign: 'center', width: '100%' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Target Short Link</p>
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              color: 'var(--accent-primary)',
              wordBreak: 'break-all',
              border: '1px solid var(--border-color)'
            }}
          >
            {shortUrl}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <Button variant="secondary" onClick={handleCopy} style={{ flex: 1 }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button variant="primary" onClick={handleDownload} style={{ flex: 1 }}>
            <Download size={16} />
            Download PNG
          </Button>
        </div>
      </div>
    </Modal>
  );
};
