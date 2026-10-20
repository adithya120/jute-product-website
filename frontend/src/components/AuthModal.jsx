import React, { useState } from 'react';
import { X, Mail, Lock, User, Leaf, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    login,
    register,
    loading,
    error,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      if (authModalMode === 'login') {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-brand-border/80 text-left">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-brand-subtle hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-brand-dark transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Leaf size={16} />
          </div>
          <span className="font-serif text-xl font-bold text-brand-dark">JuteCraft</span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-brand-dark mb-1">
          {authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          {authModalMode === 'login'
            ? 'Sign in to access your saved cart, orders, and eco profile'
            : 'Join our conscious community and enjoy member perks'}
        </p>

        {/* Error message */}
        {(localError || error) && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4">
            <AlertCircle size={16} className="shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. Maya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border/80 text-xs sm:text-sm bg-brand-subtle/60 focus:bg-white focus:border-primary outline-hidden text-brand-dark"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                placeholder="e.g. maya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border/80 text-xs sm:text-sm bg-brand-subtle/60 focus:bg-white focus:border-primary outline-hidden text-brand-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border/80 text-xs sm:text-sm bg-brand-subtle/60 focus:bg-white focus:border-primary outline-hidden text-brand-dark"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? 'Please wait...' : authModalMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="pt-5 mt-5 border-t border-brand-border/60 text-center text-xs text-stone-500">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
