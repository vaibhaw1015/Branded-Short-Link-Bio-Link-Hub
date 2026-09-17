import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { ClickChart } from '../components/ClickChart';
import { Card, Button } from '../components/ui/index';
import { ArrowLeft, ExternalLink, MousePointerClick, Calendar, Globe, QrCode } from 'lucide-react';
import { QrCodeModal } from '../components/QrCodeModal';

export const LinkAnalytics = () => {
  const { id } = useParams();
  const [showQr, setShowQr] = React.useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['linkAnalytics', id],
    queryFn: async () => {
      const res = await api.get(`/api/analytics/link/${id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1100px', margin: '60px auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading link telemetry data...
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }}>
        <Card>
          <h3 style={{ color: 'var(--accent-rose)', marginBottom: '10px' }}>Unable to load analytics</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            {error?.response?.data?.message || 'The requested link was not found or access is denied.'}
          </p>
          <Link to="/">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { link, analytics } = data;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="sm">
            <ArrowLeft size={16} />
            Back to Hub
          </Button>
        </Link>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" size="sm" onClick={() => setShowQr(true)}>
            <QrCode size={15} />
            Show QR Code
          </Button>
          <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm">
              <ExternalLink size={15} />
              Visit /r/{link.shortCode}
            </Button>
          </a>
        </div>
      </div>

      {/* Link Details Banner */}
      <Card style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                /r/{link.shortCode}
              </h1>
              {link.isCustomAlias && <span className="badge badge-indigo">Vanity Slug</span>}
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {link.title || 'Untitled Link'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
              <Globe size={14} />
              <span>Destination: </span>
              <a href={link.destinationUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                {link.destinationUrl}
              </a>
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: '150px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <MousePointerClick size={20} color="#34d399" />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
                  {analytics.totalClicks.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Clicks
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Charts */}
      <ClickChart
        clicksOverTime={analytics.clicksOverTime || []}
        topReferrers={analytics.topReferrers || []}
        deviceBreakdown={analytics.deviceBreakdown || []}
      />

      {/* QR Modal */}
      {showQr && (
        <QrCodeModal
          isOpen={showQr}
          onClose={() => setShowQr(false)}
          shortUrl={link.shortUrl}
          title={link.shortCode}
        />
      )}
    </div>
  );
};
