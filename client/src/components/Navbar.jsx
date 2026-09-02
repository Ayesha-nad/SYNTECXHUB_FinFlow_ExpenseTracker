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
  MoreVertical,
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
  const [showMobileMore, setShowMobileMore] = useState(false);

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
            <Wallet size={18} />
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
              className="nav-btn nav-accent-btn"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowUserMenu(false);
                setShowMobileMore(false);
              }}
              title="Change Interactive Accent Color"
            >
              <Palette size={14} />
              <span className="hide-on-mobile">Accent</span>
              <span
                className="accent-dot-indicator"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  boxShadow: '0 0 8px var(--color-primary-glow)',
                }}
              />
            </button>

            {showColorPicker && (
              <div
                className="color-picker-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="dropdown-label">
                  THEME ACCENTS
                </div>
                {COLOR_THEMES.map((themeObj) => (
                  <button
                    key={themeObj.id}
                    type="button"
                    className="dropdown-item"
                    style={{
                      background: currentAccent?.id === themeObj.id ? 'var(--bg-subtle)' : 'transparent',
                      borderColor: currentAccent?.id === themeObj.id ? 'var(--border-color)' : 'transparent',
                    }}
                    onClick={() => {
                      onChangeAccent(themeObj);
                      setShowColorPicker(false);
                    }}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: themeObj.primary,
                        boxShadow: `0 0 8px ${themeObj.glow}`,
                        flexShrink: 0,
                      }}
                    />
                    <span>{themeObj.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Seed Sample Data Button (Desktop & Tablet) */}
          <button
            type="button"
            className="nav-btn hide-on-compact"
            onClick={onSeedData}
            title="Load sample PKR transactions"
            disabled={loading}
          >
            <Database size={14} />
            <span className="hide-on-tablet">Demo Data</span>
          </button>

          {/* Export CSV (Desktop & Tablet) */}
          <button
            type="button"
            className="nav-btn hide-on-compact"
            onClick={onExportCSV}
            title="Export transactions to CSV"
          >
            <Download size={14} />
            <span className="hide-on-tablet">Export</span>
          </button>

          {/* Refresh Data */}
          <button
            type="button"
            className="nav-btn-icon"
            onClick={onRefresh}
            title="Refresh transactions"
            disabled={loading}
          >
            <RotateCw size={14} className={loading ? 'spin-animation' : ''} />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            className="nav-btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={15} style={{ color: '#FBBF24' }} /> : <Moon size={15} />}
          </button>

          {/* Compact Mobile More Actions Menu */}
          <div className="show-on-compact-only" style={{ position: 'relative' }}>
            <button
              type="button"
              className="nav-btn-icon"
              onClick={() => {
                setShowMobileMore(!showMobileMore);
                setShowColorPicker(false);
                setShowUserMenu(false);
              }}
              title="More actions"
            >
              <MoreVertical size={15} />
            </button>

            {showMobileMore && (
              <div
                className="user-dropdown-menu"
                onClick={(e) => e.stopPropagation()}
                style={{ right: 0, minWidth: '180px' }}
              >
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setShowMobileMore(false);
                    onSeedData();
                  }}
                >
                  <Database size={14} /> Load Demo Data
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setShowMobileMore(false);
                    onExportCSV();
                  }}
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            )}
          </div>

          {/* User Account / Auth Button */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowColorPicker(false);
                  setShowMobileMore(false);
                }}
              >
                <span
                  className="user-avatar-circle"
                  style={{
                    backgroundColor: user?.avatarColor || 'var(--color-primary)',
                  }}
                >
                  {getInitials(user?.name)}
                </span>
                <span className="user-name-text hide-on-mobile">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
              </button>

              {showUserMenu && (
                <div
                  className="user-dropdown-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="user-dropdown-header">
                    <span
                      className="user-avatar-circle-lg"
                      style={{
                        backgroundColor: user?.avatarColor || 'var(--color-primary)',
                      }}
                    >
                      {getInitials(user?.name)}
                    </span>
                    <div className="user-dropdown-info">
                      <div className="user-dropdown-name">{user?.name}</div>
                      <div className="user-dropdown-email">{user?.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal('register');
                      }}
                    >
                      <User size={14} /> Switch / Add Account
                    </button>

                    <button
                      type="button"
                      className="dropdown-item dropdown-item-danger"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn-primary nav-signin-btn"
              onClick={() => onOpenAuthModal('login')}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
