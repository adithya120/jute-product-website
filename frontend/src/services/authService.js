import api from './api';

/**
 * Register a new user
 * POST /api/auth/register
 * @param {Object} userData - { name, email, password }
 */
export const register = async (userData) => {
  const data = await api.post('/auth/register', userData);
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

/**
 * Login user with credentials
 * POST /api/auth/login
 * @param {Object} credentials - { email, password }
 */
export const login = async (credentials) => {
  const data = await api.post('/auth/login', credentials);
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

/**
 * Log out user by clearing storage
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

/**
 * Get currently stored user object
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Get current JWT auth token
 */
export const getToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('auth_token');
};

/**
 * Check if user is currently logged in
 */
export const isAuthenticated = () => {
  return Boolean(getToken());
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
};
