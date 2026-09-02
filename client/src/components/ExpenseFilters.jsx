import React, { useState, memo } from 'react';
import { Search, ArrowUpDown, X, Calendar, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES } from '../hooks/useExpenses';

const ExpenseFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const { category, search, startDate, endDate, sortBy, order } = filters;
  const [showDateRange, setShowDateRange] = useState(Boolean(startDate || endDate));

  const isFiltered =
    category !== 'All' ||
    search.trim() !== '' ||
    startDate !== '' ||
    endDate !== '' ||
    sortBy !== 'date' ||
    order !== 'desc';

  return (
    <div className="card filter-card">
      <div className="card-body filter-card-body">
        {/* 1. Search Bar & Count Row */}
        <div className="filter-search-row">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, merchant, notes..."
              value={search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onFilterChange('search', '')}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-badge-counter">
            <span>
              <strong>{filteredCount}</strong>/{totalCount}
            </span>
          </div>
        </div>

        {/* 2. Category Chips Horizontal Swipe Strip */}
        <div className="filter-chips-container">
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
                    flexShrink: 0,
                  }}
                />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Toolbar Row: Sort Selector & Date Filter Toggle */}
        <div className="filter-toolbar-row">
          {/* Sort Selector */}
          <div className="filter-sort-wrapper">
            <ArrowUpDown size={14} className="toolbar-icon" />
            <select
              className="form-select filter-sort-select"
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSort, newOrder] = e.target.value.split('-');
                onFilterChange('sortBy', newSort);
                onFilterChange('order', newOrder);
              }}
            >
              <option value="date-desc">Newest Date</option>
              <option value="date-asc">Oldest Date</option>
              <option value="amount-desc">Highest Amount (PKR)</option>
              <option value="amount-asc">Lowest Amount (PKR)</option>
              <option value="title-asc">Title (A - Z)</option>
            </select>
          </div>

          {/* Date Filter Toggle Button */}
          <button
            type="button"
            className={`nav-btn filter-date-toggle-btn ${showDateRange || startDate || endDate ? 'active' : ''}`}
            onClick={() => setShowDateRange(!showDateRange)}
          >
            <Calendar size={14} />
            <span>Date Filter</span>
            {showDateRange ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {/* Reset Filters Pill */}
          {isFiltered && (
            <button
              type="button"
              className="filter-reset-pill-btn"
              onClick={() => {
                onResetFilters();
                setShowDateRange(false);
              }}
              title="Reset all active filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* 4. Collapsible Inline Date Range Selector */}
        {showDateRange && (
          <div className="filter-date-panel">
            <div className="date-input-field">
              <label className="date-label">From</label>
              <input
                type="date"
                className="form-input date-picker-input"
                value={startDate}
                onChange={(e) => onFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="date-input-field">
              <label className="date-label">To</label>
              <input
                type="date"
                className="form-input date-picker-input"
                value={endDate}
                onChange={(e) => onFilterChange('endDate', e.target.value)}
              />
            </div>
            {(startDate || endDate) && (
              <button
                type="button"
                className="date-clear-btn"
                onClick={() => {
                  onFilterChange('startDate', '');
                  onFilterChange('endDate', '');
                }}
                title="Clear date range"
              >
                <X size={13} /> Clear Date
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ExpenseFilters);
