import React, { memo } from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  HeartPulse,
  Tag,
  Edit2,
  Trash2,
  Calendar,
  FileText,
} from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_BG_COLORS } from '../hooks/useExpenses';

// Category icon mapper
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food':
      return <Utensils size={20} />;
    case 'Transport':
      return <Car size={20} />;
    case 'Shopping':
      return <ShoppingBag size={20} />;
    case 'Bills':
      return <Receipt size={20} />;
    case 'Entertainment':
      return <Film size={20} />;
    case 'Health':
      return <HeartPulse size={20} />;
    default:
      return <Tag size={20} />;
  }
};

const ExpenseItem = ({
  expense,
  onEdit,
  onDelete,
  isHighlighted = false,
}) => {
  const { _id, title, amount, category, date, notes } = expense;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);

  const categoryColor = CATEGORY_COLORS[category] || '#64748B';
  const categoryBg = CATEGORY_BG_COLORS[category] || 'rgba(100, 116, 139, 0.15)';

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(_id);
    }
  };

  return (
    <div
      className={`expense-item ${isHighlighted ? 'highlight-added' : ''}`}
      id={`expense-${_id}`}
    >
      <div className="expense-item-left">
        {/* Category Icon Badge */}
        <div
          className="category-icon-box"
          style={{
            backgroundColor: categoryBg,
            color: categoryColor,
          }}
          title={category}
        >
          {getCategoryIcon(category)}
        </div>

        {/* Details */}
        <div className="expense-details">
          <div className="expense-title" title={title}>
            {title}
          </div>
          <div className="expense-meta">
            <span
              className={`category-pill cat-${category}`}
              style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}
            >
              {category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={12} /> {formattedDate}
            </span>
          </div>
          {notes && (
            <div className="expense-notes" title={notes}>
              <FileText size={11} style={{ display: 'inline', marginRight: '3px' }} />
              {notes}
            </div>
          )}
        </div>
      </div>

      <div className="expense-item-right">
        {/* Amount */}
        <div className="expense-amount">{formattedAmount}</div>

        {/* Hover Action Buttons */}
        <div className="expense-actions">
          <button
            type="button"
            className="action-btn"
            onClick={() => onEdit(expense)}
            title="Edit expense"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="action-btn delete"
            onClick={handleDeleteClick}
            title="Delete expense"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrapped in React.memo to prevent unnecessary re-renders when other list items update
export default memo(ExpenseItem);
