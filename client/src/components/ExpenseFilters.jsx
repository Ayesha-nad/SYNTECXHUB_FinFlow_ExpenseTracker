import React, { memo } from 'react';
import { Search, Filter, ArrowUpDown, X, Calendar, RotateCcw } from 'lucide-react';
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
      {/* Category Chips Bar */}
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

      {/* Search and Dropdowns Row */}
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
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [newSort, newOrder] = e.target.value.split('-');
              onFilterChange('sortBy', newSort);
              onFilterChange('order', newOrder);
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount ($$$ - $)</option>
            <option value="amount-asc">Lowest Amount ($ - $$$)</option>
            <option value="title-asc">Title (A - Z)</option>
          </select>
        </div>

        {/* Date Range Inputs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            type="date"
            className="form-input"
            style={{ width: '135px', padding: '0.45rem 0.6rem', fontSize: '0.8rem' }}
            value={startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            title="Start date"
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>to</span>
          <input
            type="date"
            className="form-input"
            style={{ width: '135px', padding: '0.45rem 0.6rem', fontSize: '0.8rem' }}
            value={endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            title="End date"
          />
        </div>

        {/* Reset / Status Filter Button */}
        {isFiltered && (
          <button
            type="button"
            className="nav-btn"
            onClick={onResetFilters}
            style={{
              padding: '0.45rem 0.75rem',
              fontSize: '0.8rem',
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
            }}
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        )}
      </div>

      {/* Result Count Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-0.3rem' }}>
        <span>
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> expense{totalCount === 1 ? '' : 's'}
        </span>
        {category !== 'All' && <span>Category: <strong>{category}</strong></span>}
      </div>
    </div>
  );
};

export default memo(ExpenseFilters);
