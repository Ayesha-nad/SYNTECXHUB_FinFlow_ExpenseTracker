import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Edit3, X, Zap, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../hooks/useExpenses';
import confetti from 'canvas-confetti';

const ExpenseForm = ({
  onAddExpense,
  onUpdateExpense,
  editingExpense,
  onCancelEdit,
}) => {
  // Form input states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Validation & interaction states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  // Ref on the "title" input so the form auto-focuses on mount & after submit
  const titleInputRef = useRef(null);
  const formRef = useRef(null);

  // Focus title input on mount
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // Sync form when entering or leaving edit mode
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount ? String(editingExpense.amount) : '');
      setCategory(editingExpense.category || 'Food');
      setDate(
        editingExpense.date
          ? new Date(editingExpense.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setNotes(editingExpense.notes || '');
      setErrors({});

      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    } else {
      // Reset form to defaults
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setErrors({});
    }
  }, [editingExpense]);

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter an expense title';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than PKR 0';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!date) {
      newErrors.date = 'Please select a valid date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);

    const expensePayload = {
      title: title.trim(),
      amount: parseFloat(Number(amount).toFixed(2)),
      category,
      date: new Date(date).toISOString(),
      notes: notes.trim(),
    };

    try {
      if (editingExpense) {
        await onUpdateExpense(editingExpense._id, expensePayload);
      } else {
        await onAddExpense(expensePayload);

        // Celebratory confetti pop
        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#6366F1', '#10B981', '#F59E0B'],
          });
        } catch {
          // ignore
        }

        // Reset input fields
        setTitle('');
        setAmount('');
        setNotes('');
        setErrors({});

        // Auto-refocus title input for rapid mouse-free entry
        setTimeout(() => {
          if (titleInputRef.current) {
            titleInputRef.current.focus();
          }
        }, 50);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`card ${shake ? 'shake-error' : ''}`} ref={formRef}>
      <div className="card-header">
        <div className="card-title">
          {editingExpense ? (
            <>
              <Edit3 size={18} style={{ color: 'var(--color-primary)' }} />
              <span>Edit Expense</span>
            </>
          ) : (
            <>
              <PlusCircle size={18} style={{ color: 'var(--color-primary)' }} />
              <span>Add New Expense</span>
            </>
          )}
        </div>

        {!editingExpense && (
          <span className="rapid-fire-badge" title="Rapid-fire mode: submit and keep typing without mouse">
            <Zap size={11} /> Rapid Entry
          </span>
        )}

        {editingExpense && (
          <button
            type="button"
            className="nav-btn"
            onClick={onCancelEdit}
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
          >
            <X size={14} /> Cancel
          </button>
        )}
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>
          {/* Title Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="expense-title">
              Expense Title <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="expense-title"
              ref={titleInputRef}
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Monthly groceries, Fuel petrol, Internet bill..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              disabled={isSubmitting}
            />
            {errors.title && (
              <div className="form-error-msg">
                <AlertCircle size={13} /> {errors.title}
              </div>
            )}
          </div>

          {/* Amount & Category Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="expense-amount">
                Amount (PKR) <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="expense-amount"
                type="number"
                step="any"
                min="1"
                className={`form-input ${errors.amount ? 'error' : ''}`}
                placeholder="e.g. 3500"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                }}
                disabled={isSubmitting}
              />
              {errors.amount && (
                <div className="form-error-msg">
                  <AlertCircle size={13} /> {errors.amount}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expense-category">
                Category <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <select
                id="expense-category"
                className={`form-select ${errors.category ? 'error' : ''}`}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
                }}
                disabled={isSubmitting}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Notes Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="expense-date">
                Date <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <input
                id="expense-date"
                type="date"
                className={`form-input ${errors.date ? 'error' : ''}`}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
                }}
                disabled={isSubmitting}
              />
              {errors.date && (
                <div className="form-error-msg">
                  <AlertCircle size={13} /> {errors.date}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expense-notes">
                Notes <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(optional)</span>
              </label>
              <input
                id="expense-notes"
                type="text"
                className="form-input"
                placeholder="Details, store name, tags..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              {editingExpense ? (
                <>
                  <Edit3 size={17} /> Update Expense
                </>
              ) : (
                <>
                  <PlusCircle size={17} /> Save & Enter Next
                </>
              )}
            </button>

            {editingExpense && (
              <button
                type="button"
                className="btn-secondary"
                onClick={onCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
