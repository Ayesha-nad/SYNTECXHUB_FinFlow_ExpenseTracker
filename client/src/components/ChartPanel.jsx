import React, { useState, memo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { PieChart, BarChart3, TrendingUp, Sparkles, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_BG_COLORS } from '../hooks/useExpenses';
import AnimatedCounter from './AnimatedCounter';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
);

const ChartPanel = ({ chartData, summaryMetrics, monthlyBudget }) => {
  const [activeTab, setActiveTab] = useState('donut'); // 'donut' | 'bar' | 'line'
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const { donutData, barData, lineData, catMap = {} } = chartData;
  const { totalSpent = 0, thisMonthSpent = 0, budgetPercent = 0, isOverBudget = false } = summaryMetrics;

  // Chart.js Shared Animation Options
  const defaultAnimation = {
    duration: 800,
    easing: 'easeOutQuart',
  };

  // 1. Donut Options (Custom sleek layout with external interactive category chips)
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: defaultAnimation,
    plugins: {
      legend: {
        display: false, // We use a custom, non-cutoff, interactive grid below
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: '700' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = Number(context.raw) || 0;
            const pct = totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) : 0;
            return ` ${label}: $${value.toFixed(2)} (${pct}%)`;
          },
        },
      },
    },
    cutout: '76%',
  };

  // 2. Bar Options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: defaultAnimation,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: '700' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (context) => ` Spending: $${Number(context.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }, color: '#94A3B8' },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.4)' },
        ticks: {
          callback: (value) => `$${value}`,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          color: '#94A3B8',
        },
      },
    },
  };

  // 3. Line Options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: defaultAnimation,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
          color: '#64748B',
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: '700' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (context) => ` Total to Date: $${Number(context.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }, color: '#94A3B8' },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.4)' },
        ticks: {
          callback: (value) => `$${value}`,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          color: '#94A3B8',
        },
      },
    },
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ padding: '1rem 1.35rem' }}>
        <div className="card-title" style={{ fontSize: '1.05rem' }}>
          <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Interactive Spending Analytics</span>
        </div>
        <span className="rapid-fire-badge" style={{ padding: '0.2rem 0.55rem', fontSize: '0.74rem' }}>
          <Zap size={12} /> Live Visuals
        </span>
      </div>

      <div className="card-body" style={{ padding: '1.25rem' }}>
        {/* Navigation Tabs with Smooth Animation */}
        <div className="chart-tabs" style={{ marginBottom: '1rem', paddingBottom: '0.65rem' }}>
          <button
            type="button"
            className={`chart-tab-btn ${activeTab === 'donut' ? 'active' : ''}`}
            onClick={() => setActiveTab('donut')}
          >
            <PieChart size={15} /> Category Sector
          </button>
          <button
            type="button"
            className={`chart-tab-btn ${activeTab === 'bar' ? 'active' : ''}`}
            onClick={() => setActiveTab('bar')}
          >
            <BarChart3 size={15} /> 6-Month Trend
          </button>
          <button
            type="button"
            className={`chart-tab-btn ${activeTab === 'line' ? 'active' : ''}`}
            onClick={() => setActiveTab('line')}
          >
            <TrendingUp size={15} /> Monthly Pace
          </button>
        </div>

        {/* Dynamic Canvas Container with Perfect Viewport Fit */}
        <div className="chart-canvas-container" style={{ height: activeTab === 'donut' ? '210px' : '230px' }}>
          {activeTab === 'donut' && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Doughnut data={donutData} options={donutOptions} />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.06em' }}>
                  TOTAL
                </div>
                <div
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.1,
                  }}
                >
                  <AnimatedCounter prefix="$" value={totalSpent} decimals={2} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bar' && <Bar data={barData} options={barOptions} />}

          {activeTab === 'line' && <Line data={lineData} options={lineOptions} />}
        </div>

        {/* Interactive Custom Category Chips Grid (Never gets cut off) */}
        {activeTab === 'donut' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.5rem',
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            {CATEGORIES.map((cat) => {
              const amount = catMap[cat] || 0;
              const pct = totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(0) : 0;
              const catColor = CATEGORY_COLORS[cat] || '#64748B';
              const isHovered = hoveredCategory === cat;

              return (
                <div
                  key={cat}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    background: isHovered ? `${catColor}22` : 'var(--bg-subtle)',
                    border: `1px solid ${isHovered ? catColor : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.4rem 0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.4rem',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isHovered ? 'scale(1.04) translateY(-1px)' : 'scale(1)',
                    cursor: 'default',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: catColor,
                        flexShrink: 0,
                        boxShadow: isHovered ? `0 0 8px ${catColor}` : 'none',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {cat}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      ${amount.toFixed(0)}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        marginLeft: '3px',
                        fontWeight: 600,
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Budget Health Alert Footer */}
        <div
          style={{
            marginTop: '0.9rem',
            padding: '0.75rem 0.95rem',
            borderRadius: 'var(--radius-sm)',
            background: isOverBudget
              ? 'rgba(239, 68, 68, 0.12)'
              : budgetPercent > 80
              ? 'rgba(245, 158, 11, 0.12)'
              : 'rgba(16, 185, 129, 0.12)',
            border: `1px solid ${
              isOverBudget
                ? 'rgba(239, 68, 68, 0.35)'
                : budgetPercent > 80
                ? 'rgba(245, 158, 11, 0.35)'
                : 'rgba(16, 185, 129, 0.35)'
            }`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          {isOverBudget ? (
            <AlertTriangle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
          )}
          <div style={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
            <strong style={{ color: 'var(--text-primary)' }}>
              {isOverBudget
                ? 'Budget Exceeded'
                : budgetPercent > 80
                ? 'Approaching Target'
                : 'Pacing Within Budget'}
            </strong>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.4rem' }}>
              {budgetPercent}% used of ${monthlyBudget.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ChartPanel);
