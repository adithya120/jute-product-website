import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setToken(data.token);
      setAuthModalOpen(false);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setToken(data.token);
      setAuthModalOpen(false);
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setError('');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setError('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
        loading,
        error,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
