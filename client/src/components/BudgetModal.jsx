import React, { useState, useEffect, useRef } from 'react';
import { X, Target, DollarSign, Check } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, currentBudget, onSaveBudget }) => {
  const [budgetInput, setBudgetInput] = useState(String(currentBudget));
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setBudgetInput(String(currentBudget));
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen, currentBudget]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      onSaveBudget(val);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="card-header">
          <div className="card-title">
            <Target size={20} style={{ color: 'var(--color-primary)' }} />
            <span>Set Monthly Budget Goal</span>
          </div>
          <button type="button" className="action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Set your target spending budget for the current month. The dashboard summary cards, gauge, and charts will dynamically adapt in real-time.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="budget-input">
              Monthly Budget Target ($)
            </label>
            <div style={{ position: 'relative' }}>
              <DollarSign
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="budget-input"
                ref={inputRef}
                type="number"
                step="50"
                min="10"
                className="form-input"
                style={{ paddingLeft: '2.2rem', fontSize: '1.1rem', fontWeight: 600 }}
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[500, 1000, 1500, 2500, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                className="nav-btn"
                style={{ flex: 1, padding: '0.4rem 0.2rem', fontSize: '0.78rem', justifyContent: 'center' }}
                onClick={() => setBudgetInput(String(preset))}
              >
                ${preset}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} /> Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
