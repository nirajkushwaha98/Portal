import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('placement_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('placement_token') || '');
  const [loading, setLoading] = useState(true);
  const { success, error: toastError, info } = useToast();

  // Validate or refresh user session on initial mount
  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('placement_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('placement_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('[Auth] Session validation failed:', err.message);
      // Clean stale credentials
      localStorage.removeItem('placement_token');
      localStorage.removeItem('placement_user');
      setToken('');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('placement_token', newToken);
        localStorage.setItem('placement_user', JSON.stringify(newUser));
        success(`Welcome back, ${newUser.name}!`);
        return { success: true, user: newUser };
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to login. Please check your credentials.');
      toastError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('placement_token', newToken);
        localStorage.setItem('placement_user', JSON.stringify(newUser));
        success(`Welcome to PlacementPro, ${newUser.name}!`);
        return { success: true, user: newUser };
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Registration failed.');
      toastError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('placement_token');
    localStorage.removeItem('placement_user');
    info('You have been logged out.');
  };

  const demoLogin = async (role = 'student') => {
    const creds =
      role === 'admin'
        ? { email: 'admin@placementportal.edu', password: 'Admin@123' }
        : { email: 'student@placementportal.edu', password: 'Student@123' };

    return await login(creds.email, creds.password);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    demoLogin,
    refreshUser,
    setUser,
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
