import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const DEFAULT_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80';

// Helper for Indian Rupee Formatting
const formatINR = (amount) => {
  const numericVal = Number(amount);
  if (isNaN(numericVal)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericVal);
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [imgSrc, setImgSrc] = useState(product?.image || DEFAULT_FALLBACK_IMG);
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const {
    id,
    name,
    description,
    category_name,
    price,
    discount_price,
    slug,
    rating = 4.8,
    reviews_count,
    image_secondary,
    in_stock = true,
  } = product;

  const isFavorite = isInWishlist(id);
  const numericPrice = Number(price || 0);
  const numericDiscountPrice = Number(discount_price || 0);

  const hasDiscount =
    numericDiscountPrice > 0 &&
    numericPrice > 0 &&
    numericPrice > numericDiscountPrice;

  const discountPercent = hasDiscount
    ? Math.round(((numericPrice - numericDiscountPrice) / numericPrice) * 100)
    : null;

  const activePrice = hasDiscount ? numericDiscountPrice : numericPrice;

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(DEFAULT_FALLBACK_IMG);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, null, 1);

    // Feedback effect
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const targetLink = slug ? `/products/slug/${slug}` : `/products/${id}`;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:border-[#1b3d2b]/30 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left">
      <Link to={targetLink} className="flex flex-col h-full text-inherit">
        
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-[#FAF8F5] overflow-hidden">
          {/* Main Product Image */}
          <img
            src={imgSrc}
            alt={name}
            onError={handleImageError}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              image_secondary ? 'group-hover:opacity-0' : ''
            }`}
          />

          {/* Secondary Hover Image (If provided) */}
          {image_secondary && !imgError && (
            <img
              src={image_secondary}
              alt={`${name} detail`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out group-hover:scale-105"
            />
          )}

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {category_name && (
              <span className="bg-white/80 backdrop-blur-md text-stone-800 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-white/40">
                {category_name}
              </span>
            )}
            {discountPercent && (
              <span className="bg-[#1b3d2b] text-amber-300 text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full self-start shadow-xs">
                SAVE {discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/50 flex items-center justify-center text-stone-700 hover:text-rose-600 hover:bg-white transition-all shadow-xs active:scale-90"
            onClick={handleWishlistToggle}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={17}
              className={`transition-all duration-300 ${
                isFavorite
                  ? 'fill-rose-600 text-rose-600 scale-110'
                  : 'text-stone-700 hover:text-rose-600'
              }`}
            />
          </button>

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 via-black/20 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!in_stock}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
                isAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white hover:bg-[#1b3d2b] text-stone-900 hover:text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={14} className="animate-bounce" /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> Quick Add
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
          
          {/* Rating & Stock Status */}
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1 font-semibold text-stone-800">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span>{rating}</span>
              {reviews_count && (
                <span className="text-stone-400 font-normal">({reviews_count})</span>
              )}
            </div>
            
            <span className={`text-[11px] font-semibold ${in_stock ? 'text-emerald-700' : 'text-stone-400'}`}>
              {in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base font-bold text-stone-900 mb-1.5 line-clamp-1 group-hover:text-[#1b3d2b] transition-colors">
            {name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4 flex-1">
            {description || 'Artisanal 100% natural organic fiber creation.'}
          </p>

          {/* Pricing & Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-900">
                {formatINR(activePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through">
                  {formatINR(numericPrice)}
                </span>
              )}
            </div>

            <span className="text-xs font-semibold text-[#1b3d2b] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
              Explore &rarr;
            </span>
          </div>

        </div>
      </Link>
    </div>
  );
}
