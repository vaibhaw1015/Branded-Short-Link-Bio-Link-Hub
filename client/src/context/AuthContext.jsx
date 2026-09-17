import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current active session
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('shortlink_access_token');
      if (storedToken) {
        try {
          const res = await api.get('/api/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('Session expired or invalid, attempting refresh');
          try {
            const refreshRes = await api.post('/api/auth/refresh');
            if (refreshRes.data.success) {
              localStorage.setItem('shortlink_access_token', refreshRes.data.accessToken);
              setUser(refreshRes.data.user);
            }
          } catch (e) {
            localStorage.removeItem('shortlink_access_token');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, accessToken) => {
    localStorage.setItem('shortlink_access_token', accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('shortlink_access_token');
      setUser(null);
    }
  };

  const updateUserProfile = (newBioProfile) => {
    setUser((prev) => (prev ? { ...prev, bioProfile: newBioProfile } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
