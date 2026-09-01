import React, { memo } from 'react';
import { Wallet, Calendar, TrendingUp, PieChart, ShieldAlert, Sparkles, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { CATEGORY_COLORS } from '../hooks/useExpenses';
import AnimatedCounter from './AnimatedCounter';

const SummaryCards = ({ summaryMetrics, monthlyBudget, onOpenBudgetModal }) => {
  const {
    totalSpent = 0,
    thisMonthSpent = 0,
    count = 0,
    averageExpense = 0,
    topCategory = { category: 'None', amount: 0 },
    remainingBudget = 0,
    budgetPercent = 0,
    isOverBudget = false,
  } = summaryMetrics || {};

  // Formatter for PKR
  const formatMoney = (val) => {
    return `PKR ${Number(val || 0).toLocaleString('en-PK', {
      maximumFractionDigits: 0,
    })}`;
  };

  // Determine progress bar color based on percentage threshold
  const getProgressColor = (pct) => {
    if (pct > 100 || isOverBudget) return '#EF4444'; // Red
    if (pct > 80) return '#F59E0B'; // Amber
    return '#10B981'; // Green
  };

  const progressColor = getProgressColor(budgetPercent);

  return (
    <div className="summary-cards-grid">
      {/* 1. Total Spent with Animated Number Count-Up */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-label">Total Spent</span>
          <div
            className="summary-card-icon"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            <Wallet size={20} />
          </div>
        </div>
        <div className="summary-card-value">
          <AnimatedCounter prefix="PKR " value={totalSpent} decimals={0} />
        </div>
        <div className="summary-card-subtext">
          <Sparkles size={15} style={{ color: 'var(--color-primary)' }} />
          <span>Across {count} recorded transaction{count === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* 2. This Month Spent */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-label">This Month</span>
          <div
            className="summary-card-icon"
            style={{ background: 'rgba(59, 130, 246, 0.14)', color: '#3B82F6' }}
          >
            <Calendar size={20} />
          </div>
        </div>
        <div className="summary-card-value">
          <AnimatedCounter prefix="PKR " value={thisMonthSpent} decimals={0} />
        </div>
        <div className="summary-card-subtext">
          <ArrowUpRight size={15} style={{ color: '#3B82F6' }} />
          <span>Avg. {formatMoney(averageExpense)} per entry</span>
        </div>
      </div>

      {/* 3. Top Category */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-label">Top Category</span>
          <div
            className="summary-card-icon"
            style={{ background: 'rgba(236, 72, 153, 0.14)', color: '#EC4899' }}
          >
            <PieChart size={20} />
          </div>
        </div>
        <div className="summary-card-value" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {topCategory.category !== 'None' ? (
            <span
              className={`category-pill cat-${topCategory.category}`}
              style={{
                fontSize: '0.98rem',
                padding: '0.35rem 0.85rem',
                border: `1.5px solid ${CATEGORY_COLORS[topCategory.category] || 'var(--border-color)'}`,
                boxShadow: `0 4px 14px ${CATEGORY_COLORS[topCategory.category]}33`,
              }}
            >
              {topCategory.category}
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>No data yet</span>
          )}
        </div>
        <div className="summary-card-subtext">
          <span>
            {topCategory.amount > 0 ? `${formatMoney(topCategory.amount)} in ${topCategory.category}` : 'Log an expense to see breakdown'}
          </span>
        </div>
      </div>

      {/* 4. Budget Status & Liquid Progress Gauge */}
      <div className="summary-card">
        <div className="summary-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="summary-card-label">Monthly Target</span>
            <button
              type="button"
              onClick={onOpenBudgetModal}
              title="Change Monthly Budget Target"
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--color-primary)',
                padding: '3px 6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <SlidersHorizontal size={12} /> Edit
            </button>
          </div>
          <div
            className="summary-card-icon"
            style={{
              background: isOverBudget ? 'rgba(239, 68, 68, 0.14)' : 'rgba(16, 185, 129, 0.14)',
              color: isOverBudget ? '#EF4444' : '#10B981',
            }}
          >
            {isOverBudget ? <ShieldAlert size={20} /> : <TrendingUp size={20} />}
          </div>
        </div>
        <div className="summary-card-value" style={{ color: isOverBudget ? '#EF4444' : 'var(--text-primary)' }}>
          {isOverBudget ? (
            <span>-PKR <AnimatedCounter value={thisMonthSpent - monthlyBudget} decimals={0} /></span>
          ) : (
            <AnimatedCounter prefix="PKR " value={remainingBudget} decimals={0} />
          )}
        </div>
        <div className="budget-progress-track">
          <div
            className="budget-progress-fill"
            style={{
              width: `${Math.min(100, budgetPercent)}%`,
              backgroundColor: progressColor,
            }}
          />
        </div>
        <div className="summary-card-subtext" style={{ justifyContent: 'space-between', marginTop: '0.45rem' }}>
          <span>{budgetPercent}% of {formatMoney(monthlyBudget)}</span>
          <span style={{ color: progressColor, fontWeight: 700 }}>
            {isOverBudget ? 'Over Budget' : `${formatMoney(remainingBudget)} left`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(SummaryCards);
