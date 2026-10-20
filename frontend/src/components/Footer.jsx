import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, ArrowRight, Globe, Award } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="mt-auto bg-[#1a1714] text-[#eae5dc] border-t border-white/10">
      {/* Sustainability Value Proposition Strip */}
      <div className="bg-[#231f1a] py-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center shrink-0">
              <Leaf size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">100% Biodegradable</h4>
              <p className="text-xs text-stone-400 leading-relaxed">Pure golden fiber that naturally enriches soil</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Artisan Handcrafted</h4>
              <p className="text-xs text-stone-400 leading-relaxed">Empowering traditional rural weaving communities</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Zero Plastic Policy</h4>
              <p className="text-xs text-stone-400 leading-relaxed">Eco-conscious packaging and toxin-free processing</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center shrink-0">
              <Globe size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Carbon Negative Crop</h4>
              <p className="text-xs text-stone-400 leading-relaxed">Absorbs 15 tonnes of CO2 per hectare annually</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Leaf size={18} />
              </div>
              <span className="font-serif text-2xl font-bold text-white">JuteCraft</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Crafting conscious everyday luxury from nature's most resilient golden fiber. 
              Together, replacing single-use plastics with timeless handcrafted jute artifacts.
            </p>
            <div className="inline-flex items-center gap-2 self-start bg-accent-sage/20 text-[#74c69d] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#74c69d]/30">
              <Heart size={13} className="fill-current text-[#74c69d]" /> Certified Ethical Fair Trade
            </div>
          </div>

          {/* Explore Catalog */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Explore Catalog</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>
                <Link to="/products" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Bags" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  Jute Handbags & Totes
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home+Decor" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  Rugs & Floor Mats
                </Link>
              </li>
              <li>
                <Link to="/products?category=Planters" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  Baskets & Planters
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  Tech Sleeves & Organizers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Customer Care</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>
                <Link to="/cart" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/favourites" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  Our Sustainability Mission
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  Contact Support & FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent-gold transition-colors inline-block hover:translate-x-1 duration-150">
                  Wholesale & Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5">Join the Green Movement</h4>
            <p className="text-sm text-stone-400 mb-4 leading-relaxed">
              Subscribe for exclusive artisan collections, sustainable lifestyle tips, and 10% off your first purchase.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex bg-[#2a2520] border border-white/10 rounded-full overflow-hidden focus-within:border-accent-gold transition-colors">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-stone-500 outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-4 flex items-center justify-center transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-[#74c69d] font-medium pt-1">
                  🌱 Thank you for subscribing! Check your inbox for your discount.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Sub-footer */}
      <div className="border-t border-white/5 py-6 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} JuteCraft Naturals. Handcrafted with love for the Earth.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
