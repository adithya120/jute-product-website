import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  X,
  PackageX,
  FilterX,
  ArrowUpDown
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');

  // Sync state with URL parameter changes
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch catalog data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (isMounted) {
          setProducts(prodRes?.products || prodRes || []);
          setCategories(catRes || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch Jutology catalog:', err);
          setError(err.message || 'Unable to connect to Jutology catalog servers.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Search Handlers
  const handleCategoryChange = (catName) => {
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchParams({});
    setSortBy('featured');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'All') {
      result = result.filter(
        (p) =>
          p.category_name?.toLowerCase() === activeCategory.toLowerCase() ||
          String(p.category_id) === String(activeCategory)
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => {
        const pA = Number(a.discount_price || a.price || 0);
        const pB = Number(b.discount_price || b.price || 0);
        return pA - pB;
      });
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => {
        const pA = Number(a.discount_price || a.price || 0);
        const pB = Number(b.discount_price || b.price || 0);
        return pB - pA;
      });
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    }

    return result;
  }, [products, activeCategory, searchTerm, sortBy]);

  // Aggregate Category Options
  const categoryOptions = useMemo(() => {
    const set = new Set();
    categories.forEach((c) => c.name && set.add(c.name));
    products.forEach((p) => p.category_name && set.add(p.category_name));
    return ['All', ...Array.from(set)];
  }, [categories, products]);

  const hasActiveFilters = activeCategory !== 'All' || searchTerm.trim() !== '' || sortBy !== 'featured';

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-800 pb-24 font-sans antialiased">
      
      {/* Editorial Luxury Header Banner */}
      <section className="relative overflow-hidden bg-[#1b3d2b] text-stone-100 py-16 sm:py-20 mb-8 border-b border-stone-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2d6a4f] rounded-full filter blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-900 rounded-full filter blur-3xl opacity-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-emerald-200 text-[10px] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full mb-4 backdrop-blur-md">
            <Sparkles size={11} className="text-amber-300" aria-hidden="true" />
            100% Handcrafted Jute Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-semibold tracking-tight mb-4">
            Curated Natural Living
          </h1>
          <p className="text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed font-light">
            Every fiber tells an artisan’s story. Explore conscious, zero-waste sustainable products handcrafted in India for modern lifestyle spaces.
          </p>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Controls Bar */}
        <div className="bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl p-3 sm:p-4 shadow-xs mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Category Pills Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categoryOptions.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1b3d2b] text-white shadow-sm'
                      : 'bg-stone-100/70 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box & Sort Controls */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 lg:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 focus:border-[#1b3d2b] focus:bg-white rounded-xl outline-none transition-all placeholder:text-stone-400 text-stone-800 focus:ring-2 focus:ring-[#1b3d2b]/10"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                  aria-label="Clear search input"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-600 shrink-0 hover:border-stone-300 transition-colors">
              <SlidersHorizontal size={14} className="text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-stone-800 outline-none cursor-pointer pr-1"
                aria-label="Sort catalog by"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High (₹)</option>
                <option value="price-high">Price: High to Low (₹)</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata & Active Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-1 mb-8 text-xs sm:text-sm text-stone-500 border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Showing <strong className="text-stone-900 font-semibold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>

            {/* Active Category Chip */}
            {activeCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#1b3d2b] border border-emerald-200/70 px-2.5 py-0.5 rounded-lg font-medium text-xs">
                Category: {activeCategory}
                <button onClick={() => handleCategoryChange('All')} className="hover:text-rose-600 transition-colors">
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Active Search Term Chip */}
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg font-medium text-xs">
                Search: "{searchTerm}"
                <button onClick={clearSearch} className="hover:text-rose-600 transition-colors">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              <FilterX size={13} /> Reset Filters
            </button>
          )}
        </div>

        {/* Catalog Content States */}
        {loading ? (
          /* Shimmer Skeleton Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-stone-200/60 space-y-4 animate-pulse">
                <div className="w-full h-52 bg-stone-200/80 rounded-xl" />
                <div className="h-4 bg-stone-200/80 rounded w-3/4" />
                <div className="h-3 bg-stone-200/60 rounded w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-stone-200/80 rounded w-1/3" />
                  <div className="w-8 h-8 bg-stone-200/80 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white border border-rose-100 rounded-3xl p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <PackageX size={28} />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Unable to load collection</h3>
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b3d2b] hover:bg-[#2d6a4f] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <RefreshCw size={14} /> Retry Connection
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search State */
          <div className="bg-white border border-stone-200/80 rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <Search size={30} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-stone-900 mb-2">No items found</h3>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              We couldn't find any products matching your active filters. Try adjusting your search term or category choices.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 rounded-xl bg-[#1b3d2b] hover:bg-[#2d6a4f] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
