import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, Leaf, Sparkles, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.jpg';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* Top Eco Announcement Bar */}
      <div className="bg-gradient-to-r from-[#1b3d2b] to-[#2d6a4f] text-white py-2 px-4 text-xs sm:text-sm text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
            <Sparkles size={12} /> Handcrafted & 100% Biodegradable
          </span>
          <span className="text-white/90">
            Complimentary shipping on all natural jute collections above $50! Use code <strong className="text-accent-gold font-bold">ECO10</strong> for 10% off
          </span>
        </div>
      </div>

      {/* Main Header */}
      <nav className="border-b border-brand-border/60 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group flex-shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-subtle flex items-center justify-center shadow-md shadow-primary/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 border border-brand-border/60">
              <img
                src={logoImg}
                alt="JuteCraft Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-dark leading-tight">
                JuteCraft
              </span>
              <span className="text-[10px] font-bold tracking-widest text-accent-sage uppercase">
                ORGANIC LIVING
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative flex-1 max-w-sm">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search handcrafted totes, rugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-brand-subtle/80 hover:bg-brand-subtle focus:bg-white border border-transparent focus:border-accent-gold rounded-full outline-hidden transition-all duration-200 text-brand-dark placeholder-stone-400 focus:ring-3 focus:ring-accent-gold/15"
            />
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors duration-150 py-1 relative ${
                  isActive
                    ? 'text-primary after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full'
                    : 'text-stone-600 hover:text-primary'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors duration-150 py-1 relative ${
                  isActive
                    ? 'text-primary after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full'
                    : 'text-stone-600 hover:text-primary'
                }`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors duration-150 py-1 relative ${
                  isActive
                    ? 'text-primary after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full'
                    : 'text-stone-600 hover:text-primary'
                }`
              }
            >
              Our Story
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors duration-150 py-1 relative ${
                  isActive
                    ? 'text-primary after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full'
                    : 'text-stone-600 hover:text-primary'
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Actions: Wishlist, Cart & Auth */}
          <div className="flex items-center gap-3">
            <Link
              to="/favourites"
              className="relative w-10 h-10 rounded-full bg-brand-subtle flex items-center justify-center text-stone-700 hover:text-primary hover:bg-primary-light transition-all duration-200 hover:-translate-y-0.5"
              title="View Favourites"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative w-10 h-10 rounded-full bg-brand-subtle flex items-center justify-center text-stone-700 hover:text-primary hover:bg-primary-light transition-all duration-200 hover:-translate-y-0.5"
              title="View Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-subtle hover:bg-stone-200 text-xs font-bold text-brand-dark transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline truncate max-w-24">{user?.name?.split(' ')[0]}</span>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-brand-border/80 p-2 z-50 text-left animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-brand-border/50">
                      <p className="font-bold text-xs text-brand-dark truncate">{user?.name}</p>
                      <p className="text-[11px] text-stone-400 truncate">{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold transition-colors cursor-pointer"
              >
                <User size={15} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-brand-subtle transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-6 bg-white border-t border-brand-border/60 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-brand-subtle rounded-full border border-stone-200 outline-hidden text-brand-dark"
              />
            </form>

            <div className="flex flex-col gap-2 font-medium">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-stone-700 hover:bg-brand-subtle hover:text-primary transition-colors"
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-stone-700 hover:bg-brand-subtle hover:text-primary transition-colors"
              >
                Products Catalog
              </NavLink>
              <NavLink
                to="/favourites"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-stone-700 hover:bg-brand-subtle hover:text-primary transition-colors flex items-center justify-between"
              >
                <span>Favourites</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              </NavLink>
              <NavLink
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-stone-700 hover:bg-brand-subtle hover:text-primary transition-colors flex items-center justify-between"
              >
                <span>Cart</span>
                <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-stone-700 hover:bg-brand-subtle hover:text-primary transition-colors"
              >
                Our Sustainability Story
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-stone-700 hover:bg-brand-subtle hover:text-primary transition-colors"
              >
                Contact & Support
              </NavLink>

              {/* Mobile Auth button */}
              <div className="pt-3 border-t border-brand-border/60 mt-1">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg text-rose-600 font-semibold hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out ({user?.name})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg bg-primary text-white font-bold flex items-center justify-center gap-2"
                  >
                    <User size={16} /> Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
