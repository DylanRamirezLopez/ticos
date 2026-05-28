import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
const setToken = (token, remember) => {
  if (remember) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token');
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token');
  }
};
const removeToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password, remember = false) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token, remember);
    setUser(res.data);
    return res.data;
  }, []);

  const register = useCallback(async (name, username, email, password, remember = false) => {
    const res = await api.post('/auth/register', { name, username, email, password });
    setToken(res.data.token, remember);
    setUser(res.data);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const res = await api.put('/auth/profile', data);
    setUser((prev) => ({ ...prev, ...res.data }));
    return res.data;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      removeToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
