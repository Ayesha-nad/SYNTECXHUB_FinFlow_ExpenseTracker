import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'finflow_auth_user';
const TOKEN_STORAGE_KEY = 'finflow_auth_token';
const USERS_ACCOUNTS_KEY = 'finflow_local_users_db';

const AVATAR_COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#EC4899', // Rose
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#3B82F6'  // Blue
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });

  const [authLoading, setAuthLoading] = useState(false);

  // Set default axios Authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  // Persist user state
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Helper for local multi-user accounts DB on static hosting (GitHub Pages)
  const getLocalUsers = () => {
    try {
      const db = localStorage.getItem(USERS_ACCOUNTS_KEY);
      return db ? JSON.parse(db) : [];
    } catch {
      return [];
    }
  };

  const saveLocalUser = (userData) => {
    try {
      const list = getLocalUsers();
      const filtered = list.filter((u) => u.email !== userData.email);
      filtered.push(userData);
      localStorage.setItem(USERS_ACCOUNTS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn(e);
    }
  };

  // 1. Register User
  const register = useCallback(async ({ name, email, password }) => {
    setAuthLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    try {
      // Attempt backend registration
      const res = await axios.post('/api/auth/register', {
        name: cleanName,
        email: cleanEmail,
        password,
      });

      if (res.data && res.data.data) {
        const userData = res.data.data;
        setUser(userData);
        setToken(userData.token);
        saveLocalUser({ ...userData, password });

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366F1', '#10B981', '#F59E0B'],
          });
        } catch {
          // ignore
        }

        return { success: true, message: `Welcome to FinFlow, ${userData.name}!` };
      }
    } catch (err) {
      // Local fallback on static hosting (GitHub Pages)
      const existing = getLocalUsers().find((u) => u.email === cleanEmail);
      if (existing) {
        setAuthLoading(false);
        throw new Error('An account with this email already exists');
      }

      const localUser = {
        _id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: cleanName,
        email: cleanEmail,
        password,
        avatarColor,
        monthlyBudget: 150000,
        token: `mock_jwt_${Date.now()}`,
      };

      saveLocalUser(localUser);
      setUser(localUser);
      setToken(localUser.token);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#10B981', '#F59E0B'],
        });
      } catch {
        // ignore
      }

      return { success: true, message: `Welcome to FinFlow, ${localUser.name}!` };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // 2. Login User
  const login = useCallback(async ({ email, password }) => {
    setAuthLoading(true);
    const cleanEmail = email.toLowerCase().trim();

    try {
      const res = await axios.post('/api/auth/login', {
        email: cleanEmail,
        password,
      });

      if (res.data && res.data.data) {
        const userData = res.data.data;
        setUser(userData);
        setToken(userData.token);
        saveLocalUser({ ...userData, password });
        return { success: true, message: `Welcome back, ${userData.name}!` };
      }
    } catch (err) {
      // Check local user database fallback
      const found = getLocalUsers().find((u) => u.email === cleanEmail);
      if (found && found.password === password) {
        setUser(found);
        setToken(found.token || `mock_jwt_${Date.now()}`);
        return { success: true, message: `Welcome back, ${found.name}!` };
      }

      // If demo account entered
      if (cleanEmail === 'demo@finflow.app' && password === 'password123') {
        const demoUser = {
          _id: 'usr_demo_ayesha',
          name: 'Ayesha Developer',
          email: 'demo@finflow.app',
          avatarColor: '#6366F1',
          monthlyBudget: 150000,
          token: `demo_jwt_token`,
        };
        setUser(demoUser);
        setToken(demoUser.token);
        return { success: true, message: `Welcome back, Ayesha!` };
      }

      setAuthLoading(false);
      throw new Error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // 3. 1-Click Demo Login
  const loginDemo = useCallback(() => {
    const demoUser = {
      _id: 'usr_demo_ayesha',
      name: 'Ayesha Developer',
      email: 'demo@finflow.app',
      avatarColor: '#6366F1',
      monthlyBudget: 150000,
      token: `demo_jwt_token`,
    };
    setUser(demoUser);
    setToken(demoUser.token);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#6366F1', '#10B981'],
      });
    } catch {
      // ignore
    }
    return { success: true, message: 'Logged in as Demo User (Ayesha Developer)' };
  }, []);

  // 4. Logout
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    authLoading,
    register,
    login,
    loginDemo,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
