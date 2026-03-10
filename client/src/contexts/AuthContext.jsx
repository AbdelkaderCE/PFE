/*
  AuthContext — Centralised authentication state for the entire app.
  Wraps the React tree so every component can `useAuth()`.
  On mount it tries to restore the session from the httpOnly cookie (GET /auth/me).
*/

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check cookies
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  /* ── Restore session on mount ─────────────────────────────── */
  const fetchUser = useCallback(async () => {
    try {
      const data = await authAPI.getMe();
      setUser(data.data?.user ?? data.user ?? data);
      setError(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /* ── Login ────────────────────────────────────────────────── */
  const login = async (email, password) => {
    setError(null);
    const data = await authAPI.login(email, password);
    const loggedUser = data.data?.user ?? data.user;
    setUser(loggedUser);
    return loggedUser;
  };

  /* ── Register ─────────────────────────────────────────────── */
  const register = async (userData) => {
    setError(null);
    const data = await authAPI.register(userData);
    const newUser = data.data?.user ?? data.user;
    setUser(newUser);
    return newUser;
  };

  /* ── Logout ───────────────────────────────────────────────── */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      /* best-effort */
    }
    setUser(null);
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
