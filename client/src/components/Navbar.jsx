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
  User,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  onOpenAuthModal,
  loading,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Helper to extract user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="brand-logo">
          <div className="brand-badge">
            <Wallet size={20} />
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
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowUserMenu(false);
              }}
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
                  width: '9px',
                  height: '9px',
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
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
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
                        width: '13px',
                        height: '13px',
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
            title="Load sample PKR transactions"
            disabled={loading}
          >
            <Database size={15} />
            <span className="hide-mobile">Demo Data</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            className="nav-btn"
            onClick={onExportCSV}
            title="Export transactions to CSV"
          >
            <Download size={15} />
            <span className="hide-mobile">Export</span>
          </button>

          {/* Refresh Data */}
          <button
            type="button"
            className="nav-btn-icon"
            onClick={onRefresh}
            title="Refresh transactions"
            disabled={loading}
          >
            <RotateCw size={15} className={loading ? 'spin-animation' : ''} />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            className="nav-btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} style={{ color: '#FBBF24' }} /> : <Moon size={16} />}
          </button>

          {/* User Account / Auth Button */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowColorPicker(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1.5px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: user?.avatarColor || 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  {getInitials(user?.name)}
                </span>
                <span className="hide-mobile" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </button>

              {showUserMenu && (
                <div
                  className="user-dropdown-menu"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--bg-surface-elevated)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    boxShadow: 'var(--shadow-lg)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 60,
                    minWidth: '220px',
                    animation: 'modalScaleUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)' }}>
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: user?.avatarColor || 'var(--color-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                      }}
                    >
                      {getInitials(user?.name)}
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal('register');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.6rem',
                        borderRadius: 'var(--radius-xs)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <User size={15} /> Switch / Add Account
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.6rem',
                        borderRadius: 'var(--radius-xs)',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: 'var(--color-danger)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onOpenAuthModal('login')}
              style={{
                padding: '0.48rem 0.95rem',
                fontSize: '0.82rem',
                gap: '0.4rem',
              }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
