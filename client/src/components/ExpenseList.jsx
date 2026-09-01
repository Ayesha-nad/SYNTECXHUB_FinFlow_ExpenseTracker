import React, { useEffect, useRef, memo } from 'react';
import { ListFilter, ReceiptText, Plus, Sparkles } from 'lucide-react';
import ExpenseItem from './ExpenseItem';
import { ExpenseListSkeleton } from './Loader';

const ExpenseList = ({
  expenses,
  loading,
  lastAddedId,
  onEditExpense,
  onDeleteExpense,
  onResetFilters,
  onOpenAddModal,
}) => {
  const listContainerRef = useRef(null);

  // --- useRef: Auto-scroll to newly added expense ---
  useEffect(() => {
    if (lastAddedId && listContainerRef.current) {
      const element = document.getElementById(`expense-${lastAddedId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [lastAddedId]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <ReceiptText size={20} style={{ color: 'var(--color-primary)' }} />
          <span>Transactions History</span>
        </div>
        <span
          className="rapid-fire-badge"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
        >
          {expenses.length} record{expenses.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
        {loading ? (
          <ExpenseListSkeleton />
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ReceiptText size={32} />
            </div>
            <div className="empty-state-title">No transactions found</div>
            <div className="empty-state-desc">
              There are no expenses matching your current search or filter criteria.
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onResetFilters}
                style={{ fontSize: '0.85rem' }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="expense-list" ref={listContainerRef}>
            {expenses.map((item) => (
              <ExpenseItem
                key={item._id}
                expense={item}
                onEdit={onEditExpense}
                onDelete={onDeleteExpense}
                isHighlighted={item._id === lastAddedId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ExpenseList);
