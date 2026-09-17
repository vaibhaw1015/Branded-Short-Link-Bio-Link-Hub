import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card } from './ui/index';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export const ClickChart = ({ clicksOverTime = [], topReferrers = [], deviceBreakdown = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Time Series Area Chart */}
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Clicks Over Time (Daily Telemetry)
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Aggregate trajectory of user engagements by day
          </p>
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          {clicksOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clicksOverTime} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.08)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid rgba(99, 102, 241, 0.15)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.12)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#clickGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No click timeline events recorded yet.
            </div>
          )}
        </div>
      </Card>

      {/* 2. Top Referrers & Device Breakdown side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Referrers */}
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Top Traffic Sources & Referrers
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Direct vs Referral breakdown</p>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            {topReferrers.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topReferrers} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.06)" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis type="category" dataKey="referrer" stroke="#94a3b8" fontSize={12} tickLine={false} width={110} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No referrer data available.
              </div>
            )}
          </div>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Device Distribution
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Mobile vs Desktop vs Tablet ratio</p>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            {deviceBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceBreakdown}
                    dataKey="count"
                    nameKey="device"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No device telemetry available.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
