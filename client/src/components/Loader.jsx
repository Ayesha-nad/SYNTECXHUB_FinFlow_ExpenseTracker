import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 24, text = 'Loading...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.75rem' }}>
    <Loader2 size={size} className="spin-animation" style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
    {text && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{text}</span>}
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export const SummaryCardSkeleton = () => (
  <div className="summary-cards-grid">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="summary-card" style={{ gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ width: '80px', height: '16px' }}></div>
          <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></div>
        </div>
        <div className="skeleton" style={{ width: '120px', height: '32px' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '12px' }}></div>
      </div>
    ))}
  </div>
);

export const ExpenseListSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          background: 'var(--bg-subtle)',
          borderRadius: '10px',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: 1 }}>
          <div className="skeleton" style={{ width: '42px', height: '42px', borderRadius: '8px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
            <div className="skeleton" style={{ width: '60%', height: '16px' }}></div>
            <div className="skeleton" style={{ width: '35%', height: '12px' }}></div>
          </div>
        </div>
        <div className="skeleton" style={{ width: '70px', height: '24px' }}></div>
      </div>
    ))}
  </div>
);

export default Spinner;
