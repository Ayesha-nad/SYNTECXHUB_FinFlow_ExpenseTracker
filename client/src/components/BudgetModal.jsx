import React, { useState, useEffect, useRef } from 'react';
import { X, Target, Wallet, Check } from 'lucide-react';

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

  const pkrPresets = [50000, 100000, 150000, 200000, 300000];

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
            Set your target spending budget in PKR for the current month. The dashboard summary cards, health gauge, and velocity charts will dynamically adapt.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="budget-input">
              Monthly Budget Target (PKR)
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                PKR
              </span>
              <input
                id="budget-input"
                ref={inputRef}
                type="number"
                step="1000"
                min="1000"
                className="form-input"
                style={{ paddingLeft: '3.4rem', fontSize: '1.1rem', fontWeight: 700 }}
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {pkrPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                className="nav-btn"
                style={{ flex: 1, minWidth: '70px', padding: '0.45rem 0.3rem', fontSize: '0.78rem', justifyContent: 'center' }}
                onClick={() => setBudgetInput(String(preset))}
              >
                {preset >= 100000 ? `${preset / 100000} Lakh` : `${preset / 1000}k`}
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
