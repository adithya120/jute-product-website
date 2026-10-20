import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-24 px-4 min-h-[60vh] flex items-center justify-center text-center">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-extrabold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-5">
          <Leaf size={14} /> 404 • PAGE NOT FOUND
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-3">
          Lost in the Golden Fields?
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mb-8">
          We couldn't locate the page you were seeking. It may have been moved, renamed, or
          recycled into fresh compost.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 transition-all"
          >
            <Home size={15} /> Return to Homepage
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-brand-subtle text-brand-dark border border-brand-border text-xs font-bold transition-all"
          >
            <Search size={15} /> Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
