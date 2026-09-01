import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Sparkles,
  Zap,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, register, loginDemo, authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultTab === 'login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    setIsLogin(defaultTab === 'login');
    setError(null);
  }, [defaultTab, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (emailInputRef.current) emailInputRef.current.focus();
      }, 50);
    }
  }, [isOpen, isLogin]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!email.trim() || !password) {
      setError('Please fill in all required fields');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError('Please provide your full name');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
    }

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleDemoLogin = async () => {
    try {
      loginDemo();
      onClose();
    } catch (err) {
      setError('Failed to login demo account');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-content auth-modal-content ${shake ? 'shake-error' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        {/* Header with Switch Tabs */}
        <div className="card-header" style={{ padding: '1.25rem 1.5rem', borderBottom: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-badge" style={{ width: '34px', height: '34px', fontSize: '1rem' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                {isLogin ? 'Welcome Back' : 'Create FinFlow Account'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isLogin ? 'Sign in to access your finances' : 'Track your spending with ease'}
              </div>
            </div>
          </div>
          <button type="button" className="action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-group" style={{ padding: '0 1.5rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
          >
            <LogIn size={15} /> Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
          >
            <UserPlus size={15} /> Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem 1.5rem' }} noValidate>
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                color: 'var(--color-danger)',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Name Field (Sign Up only) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-name">
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  id="auth-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="e.g. Ayesha Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={authLoading}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="auth-email"
                ref={emailInputRef}
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={authLoading}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                placeholder={isLogin ? 'Enter password' : 'Min. 6 characters'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Sign Up only) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-confirm-password">
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={authLoading}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            disabled={authLoading}
          >
            {authLoading ? (
              <span>Authenticating...</span>
            ) : isLogin ? (
              <>
                <LogIn size={17} /> Sign In to FinFlow
              </>
            ) : (
              <>
                <UserPlus size={17} /> Create Account
              </>
            )}
          </button>

          {/* 1-Click Demo User Shortcut */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <div
              style={{
                position: 'relative',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '1px',
                  background: 'var(--border-color)',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  background: 'var(--bg-surface-elevated)',
                  padding: '0 0.75rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                }}
              >
                QUICK ACCESS
              </span>
            </div>

            <button
              type="button"
              className="nav-btn"
              onClick={handleDemoLogin}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.7rem',
                border: '1.5px dashed var(--color-primary)',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              <Zap size={15} /> 1-Click Demo Login (Ayesha Developer)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
