import React, { memo } from 'react';
import { Search, ArrowUpDown, X, Calendar, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../hooks/useExpenses';

const ExpenseFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const { category, search, startDate, endDate, sortBy, order } = filters;

  const isFiltered =
    category !== 'All' ||
    search.trim() !== '' ||
    startDate !== '' ||
    endDate !== '' ||
    sortBy !== 'date' ||
    order !== 'desc';

  return (
    <div className="filter-bar">
      {/* Category Chips Horizontal Swipe Bar */}
      <div className="filter-chips-wrapper">
        <button
          type="button"
          className={`filter-chip ${category === 'All' ? 'active' : ''}`}
          onClick={() => onFilterChange('category', 'All')}
        >
          All Categories
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${isActive ? 'active' : ''}`}
              onClick={() => onFilterChange('category', cat)}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#FFFFFF' : `var(--cat-${cat.toLowerCase()})`,
                  display: 'inline-block',
                }}
              />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search and Responsive Controls Grid */}
      <div className="filter-inputs-row">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or notes..."
            value={search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => onFilterChange('search', '')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Secondary Filter Controls Cluster */}
        <div className="filter-controls-cluster">
          {/* Sort Selector */}
          <div className="filter-control-item" style={{ flex: '1 1 140px' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <select
              className="form-select filter-select"
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSort, newOrder] = e.target.value.split('-');
                onFilterChange('sortBy', newSort);
                onFilterChange('order', newOrder);
              }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount (PKR)</option>
              <option value="amount-asc">Lowest Amount (PKR)</option>
              <option value="title-asc">Title (A - Z)</option>
            </select>
          </div>

          {/* Date Range Inputs */}
          <div className="filter-date-group">
            <Calendar size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              type="date"
              className="form-input filter-date-input"
              value={startDate}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              title="Start date"
              placeholder="Start"
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>to</span>
            <input
              type="date"
              className="form-input filter-date-input"
              value={endDate}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              title="End date"
              placeholder="End"
            />
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              type="button"
              className="nav-btn filter-reset-btn"
              onClick={onResetFilters}
              title="Clear all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Count Info */}
      <div className="filter-results-info">
        <span>
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> expense{totalCount === 1 ? '' : 's'}
        </span>
        {category !== 'All' && <span>Category: <strong>{category}</strong></span>}
      </div>
    </div>
  );
};

export default memo(ExpenseFilters);
