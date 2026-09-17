import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LinkTable } from '../components/LinkTable';
import { Card, Button, Input } from '../components/ui/index';
import {
  Link2, Plus, Search, TrendingUp, MousePointerClick, Layers,
  ExternalLink, Sparkles, User, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  // Create link form state
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [title, setTitle] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Table search & pagination state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // 1. Fetch User Links
  const { data: linksData, isLoading: linksLoading } = useQuery({
    queryKey: ['links', page, search],
    queryFn: async () => {
      const res = await api.get('/api/links', {
        params: { page, limit, search }
      });
      return res.data;
    },
    keepPreviousData: true
  });

  // 2. Fetch Overview Analytics
  const { data: overviewData } = useQuery({
    queryKey: ['analyticsOverview'],
    queryFn: async () => {
      const res = await api.get('/api/analytics/overview');
      return res.data;
    }
  });

  // 3. Create Link Mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/api/links', payload);
      return res.data;
    },
    onSuccess: (data) => {
      setFormSuccess(`Short link created: ${data.link.shortUrl}`);
      setDestinationUrl('');
      setCustomSlug('');
      setTitle('');
      setShowAdvanced(false);
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['analyticsOverview'] });
      setTimeout(() => setFormSuccess(''), 5000);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to create short link.';
      setFormError(msg);
    }
  });

  // 4. Delete Link Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/links/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['analyticsOverview'] });
    }
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!destinationUrl.startsWith('http://') && !destinationUrl.startsWith('https://')) {
      setFormError('Please include http:// or https:// in your destination URL');
      return;
    }

    createMutation.mutate({
      destinationUrl,
      customSlug: customSlug ? customSlug.trim() : undefined,
      title: title ? title.trim() : undefined
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Top Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-button)' }}>
            <Link2 size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>ShortLink Hub</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Branded URL Shortener & Bio Profile Manager</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to={`/bio/${user?.username}`} target="_blank">
            <Button variant="secondary" size="sm" title="View your public bio page">
              <ExternalLink size={14} />
              View Bio: /{user?.username}
            </Button>
          </Link>

          <Link to="/bio-builder">
            <Button variant="secondary" size="sm">
              <Sparkles size={14} color="#ec4899" />
              Customize Bio
            </Button>
          </Link>

          <Button variant="danger" size="sm" onClick={logout} title="Sign Out">
            <LogOut size={14} />
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%)' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', flexShrink: 0 }}>
            <Layers size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Short Links</p>
            <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {overviewData?.totalLinks || linksData?.pagination?.total || 0}
            </h3>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,150,105,0.04) 100%)' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', flexShrink: 0 }}>
            <MousePointerClick size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>All-Time Recorded Clicks</p>
            <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {overviewData?.totalClicks?.toLocaleString() || 0}
            </h3>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, rgba(236,72,153,0.06) 0%, rgba(219,39,119,0.04) 100%)' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.12)', color: 'var(--accent-secondary)', flexShrink: 0 }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Traffic Source</p>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', letterSpacing: '-0.02em' }}>
              {overviewData?.topReferrers?.[0]?.referrer || 'Direct'}
            </h3>
          </div>
        </Card>
      </div>

      {/* URL Shortener Creation Form */}
      <Card style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
          Create Branded Short Link
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Auto-generate an unambiguous 6-character short code or specify your own custom vanity slug.
        </p>

        {formError && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.25)', color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {formError}
          </div>
        )}

        {formSuccess && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--accent-emerald)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <input
                type="url"
                placeholder="Paste destination URL (e.g. https://yourwebsite.com/long-page-path)..."
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className="input-control"
                required
              />
            </div>
            <Button type="submit" loading={createMutation.isPending} style={{ padding: '10px 24px' }}>
              <Plus size={16} />
              Shorten URL
            </Button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.825rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              {showAdvanced ? '− Hide Custom Vanity Slug & Title' : '+ Add Custom Vanity Slug & Title (Optional)'}
            </button>
          </div>

          {showAdvanced && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
              <div>
                <label style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Custom Vanity Slug (/r/your-slug)
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    /r/
                  </span>
                  <input
                    type="text"
                    placeholder="summer-sale"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="input-control"
                    style={{ borderRadius: '0 8px 8px 0' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Link Label / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Black Friday Campaign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-control"
                />
              </div>
            </div>
          )}
        </form>
      </Card>

      {/* Link Library Studio Table */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Link Library Studio</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Manage, share QR codes, and monitor telemetry stats</p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search links or slugs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-control"
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <LinkTable
          links={linksData?.links || []}
          isLoading={linksLoading}
          onDelete={(id) => deleteMutation.mutate(id)}
        />

        {/* Pagination Footer */}
        {linksData?.pagination && linksData.pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Page {linksData.pagination.page} of {linksData.pagination.totalPages} ({linksData.pagination.total} total links)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} /> Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= linksData.pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
