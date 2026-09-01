import React, { useState } from 'react';
import {
  Wallet,
  Sun,
  Moon,
  Database,
  Download,
  RotateCw,
  Palette,
  Sparkles,
} from 'lucide-react';

export const COLOR_THEMES = [
  { id: 'indigo', name: 'Electric Indigo', primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' },
  { id: 'emerald', name: 'Neon Emerald', primary: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'cyan', name: 'Cyber Cyan', primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
  { id: 'rose', name: 'Sunset Rose', primary: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
  { id: 'amber', name: 'Radiant Amber', primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
];

const Navbar = ({
  theme,
  onToggleTheme,
  currentAccent,
  onChangeAccent,
  onSeedData,
  onRefresh,
  onExportCSV,
  loading,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="brand-logo">
          <div className="brand-badge">
            <Wallet size={22} />
          </div>
          <div className="brand-text">
            Fin<span>Flow</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Interactive Color Accent Picker */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Change Interactive Accent Color"
              style={{
                borderColor: 'var(--color-primary)',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
              }}
            >
              <Palette size={15} />
              <span className="hide-mobile">Accent</span>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  boxShadow: '0 0 8px var(--color-primary-glow)',
                }}
              />
            </button>

            {showColorPicker && (
              <div
                className="color-picker-dropdown"
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'var(--bg-surface-elevated)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  boxShadow: 'var(--shadow-lg)',
                  backdropFilter: 'blur(20px)',
                  zIndex: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  minWidth: '170px',
                  animation: 'modalScaleUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  THEME ACCENTS
                </div>
                {COLOR_THEMES.map((themeObj) => (
                  <button
                    key={themeObj.id}
                    type="button"
                    onClick={() => {
                      onChangeAccent(themeObj);
                      setShowColorPicker(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.45rem 0.6rem',
                      borderRadius: 'var(--radius-xs)',
                      background: currentAccent?.id === themeObj.id ? 'var(--bg-subtle)' : 'transparent',
                      border: currentAccent?.id === themeObj.id ? '1px solid var(--border-color)' : '1px solid transparent',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: themeObj.primary,
                        boxShadow: `0 0 8px ${themeObj.glow}`,
                      }}
                    />
                    <span>{themeObj.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Seed Sample Data Button */}
          <button
            type="button"
            className="nav-btn"
            onClick={onSeedData}
            title="Load realistic sample transactions"
            disabled={loading}
          >
            <Database size={15} />
            <span className="hide-mobile">Seed Demo</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            className="nav-btn"
            onClick={onExportCSV}
            title="Export transactions to CSV"
          >
            <Download size={15} />
            <span className="hide-mobile">Export CSV</span>
          </button>

          {/* Refresh Data */}
          <button
            type="button"
            className="nav-btn-icon"
            onClick={onRefresh}
            title="Refresh transactions"
            disabled={loading}
          >
            <RotateCw size={16} className={loading ? 'spin-animation' : ''} />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            className="nav-btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={17} style={{ color: '#FBBF24' }} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
