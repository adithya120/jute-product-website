import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Favourites() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, null, 1);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex justify-center">
        <div className="max-w-md w-full bg-white border border-brand-border/80 rounded-3xl p-10 text-center flex flex-col items-center shadow-xs">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
            <Heart size={38} />
          </div>
          <span className="bg-primary-light text-primary text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full mb-3">
            <Sparkles size={12} className="inline mr-1" /> YOUR SAVED GEMS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-dark mb-2">
            Your Wishlist is Currently Empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mb-6">
            Spot something you adore while browsing our sustainable golden jute collections?
            Click the heart icon on any product to save it here for later consideration.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 transition-all"
          >
            Browse Eco Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-brand-border/60 pb-5 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-1">My Favourites</h1>
            <p className="text-xs sm:text-sm text-stone-500">
              You have {wishlist.length} {wishlist.length === 1 ? 'handcrafted item' : 'handcrafted items'} saved in your wishlist
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-primary hover:text-primary-hover hover:translate-x-1 transition-all"
          >
            Explore More &rarr;
          </Link>
        </div>

        {/* Favourites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const price = item.discount_price || item.price || '649.00';
            const originalPrice = item.price;
            const targetLink = item.slug ? `/products/slug/${item.slug}` : `/products/${item.id}`;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-border/80 shadow-xs hover:shadow-lg transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square w-full bg-brand-subtle overflow-hidden">
                  <Link to={targetLink}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-400 hover:text-rose-600 hover:bg-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    title="Remove from favourites"
                    aria-label="Remove from favourites"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {item.category_name && (
                    <span className="text-[11px] font-bold text-accent-sage uppercase tracking-wider mb-1">
                      {item.category_name}
                    </span>
                  )}

                  <Link
                    to={targetLink}
                    className="font-bold text-sm text-brand-dark hover:text-primary transition-colors block truncate mb-2"
                  >
                    {item.name}
                  </Link>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-base font-extrabold text-primary">${price}</span>
                    {originalPrice && Number(originalPrice) > Number(price) && (
                      <span className="text-xs text-stone-400 line-through">${originalPrice}</span>
                    )}
                  </div>

                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="w-full py-2.5 px-4 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <ShoppingBag size={14} /> Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
