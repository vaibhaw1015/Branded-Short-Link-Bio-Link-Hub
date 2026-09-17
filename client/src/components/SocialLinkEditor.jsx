import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button, Input } from './ui/index';

const PRESET_ICONS = [
  { id: 'globe', label: 'Website / Portfolio' },
  { id: 'github', label: 'GitHub' },
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'mail', label: 'Email / Newsletter' }
];

export const SocialLinkEditor = ({ socialLinks = [], onChange }) => {
  const handleAddLink = () => {
    onChange([
      ...socialLinks,
      { label: '', url: '', icon: 'globe' }
    ]);
  };

  const handleUpdate = (index, field, value) => {
    const updated = socialLinks.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(updated);
  };

  const handleRemove = (index) => {
    onChange(socialLinks.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Custom Social Links & Outlets
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Buttons displayed prominently on your bio page
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddLink}>
          <Plus size={15} />
          Add Link
        </Button>
      </div>

      {socialLinks.length === 0 ? (
        <div
          style={{
            padding: '24px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed var(--border-color)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}
        >
          No social links configured yet. Click "Add Link" to create one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {socialLinks.map((link, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)'
              }}
            >
              <GripVertical size={16} color="#64748b" style={{ cursor: 'grab', flexShrink: 0 }} />

              {/* Icon select */}
              <select
                value={link.icon || 'globe'}
                onChange={(e) => handleUpdate(index, 'icon', e.target.value)}
                style={{
                  padding: '9px',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  flexShrink: 0
                }}
              >
                {PRESET_ICONS.map((icon) => (
                  <option key={icon.id} value={icon.id} style={{ background: '#0e1424' }}>
                    {icon.label}
                  </option>
                ))}
              </select>

              {/* Label */}
              <input
                type="text"
                placeholder="Button Label (e.g. My Portfolio)"
                value={link.label}
                onChange={(e) => handleUpdate(index, 'label', e.target.value)}
                className="input-control"
                style={{ flex: 1 }}
              />

              {/* URL */}
              <input
                type="url"
                placeholder="https://..."
                value={link.url}
                onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                className="input-control"
                style={{ flex: 1.5 }}
              />

              {/* Remove button */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemove(index)}
                title="Remove Link"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
