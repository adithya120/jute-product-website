import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Leaf,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (couponCode.trim().toUpperCase() === 'ECO10') {
      setAppliedDiscount(0.1);
      setCouponSuccess('Coupon ECO10 applied: 10% off your eco order!');
    } else if (couponCode.trim().toUpperCase() === 'GOLDEN') {
      setAppliedDiscount(0.15);
      setCouponSuccess('Coupon GOLDEN applied: 15% off your order!');
    } else {
      setCouponError('Invalid promo code. Try "ECO10"');
    }
  };

  const discountAmount = cartSubtotal * appliedDiscount;
  const shippingFee = cartSubtotal >= 50 || cartSubtotal === 0 ? 0 : 9.0;
  const estimatedTax = (cartSubtotal - discountAmount) * 0.05;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + estimatedTax);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderPlaced(true);
      clearCart();
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="max-w-md w-full bg-white border border-brand-border/80 rounded-3xl p-8 sm:p-10 shadow-sm text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-accent-sage text-white flex items-center justify-center mb-5">
            <Check size={32} />
          </div>
          <span className="bg-primary-light text-primary text-xs font-bold px-3.5 py-1 rounded-full mb-3">
            Order #JC-{Math.floor(100000 + Math.random() * 900000)} Confirmed
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-dark mb-3">
            Thank you for supporting conscious artisans!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
            Your order has been received and will be packaged in 100% biodegradable zero-plastic craft
            materials. A confirmation receipt has been sent to your email.
          </p>
          <div className="flex items-center gap-2.5 bg-accent-sage-light text-accent-sage p-3.5 rounded-xl text-xs font-semibold mb-6 text-left w-full">
            <Leaf size={18} className="shrink-0" />
            <span>You prevented approximately 4 single-use plastic bags from entering ecosystems!</span>
          </div>
          <Link
            to="/products"
            onClick={() => setOrderPlaced(false)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors"
          >
            Continue Shopping <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex justify-center">
        <div className="max-w-md w-full bg-white border border-brand-border/80 rounded-3xl p-10 text-center flex flex-col items-center shadow-xs">
          <div className="w-20 h-20 rounded-full bg-brand-subtle text-primary flex items-center justify-center mb-6">
            <ShoppingBag size={40} />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-dark mb-2">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mb-6">
            You haven't added any handcrafted jute treasures to your cart yet.
            Every item purchased directly supports rural sustainable artisans!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 transition-all"
          >
            Explore Collection <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="flex items-end justify-between border-b border-brand-border/60 pb-5 mb-8 text-left">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-1">Your Conscious Cart</h1>
            <p className="text-xs sm:text-sm text-stone-500">
              {cartItems.length} unique {cartItems.length === 1 ? 'item' : 'items'} in your eco basket
            </p>
          </div>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <Trash2 size={14} /> Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cart Items Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4 text-left">
            <div className="bg-white rounded-3xl border border-brand-border/80 shadow-xs divide-y divide-brand-border/50 overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  {/* Thumbnail */}
                  <Link
                    to={item.slug ? `/products/slug/${item.slug}` : `/products/${item.productId}`}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-brand-subtle shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={item.slug ? `/products/slug/${item.slug}` : `/products/${item.productId}`}
                      className="font-bold text-sm sm:text-base text-brand-dark hover:text-primary transition-colors block truncate"
                    >
                      {item.name}
                    </Link>
                    {(item.color || item.size) && (
                      <p className="text-xs text-stone-500 mt-1">
                        {item.color && <span>Shade: <strong>{item.color}</strong></span>}
                        {item.color && item.size && <span> • </span>}
                        {item.size && <span>Size: <strong>{item.size}</strong></span>}
                      </p>
                    )}
                    <span className="text-xs text-stone-400 mt-0.5 block">
                      ${Number(item.price).toFixed(2)} each
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-brand-subtle border border-brand-border/80 rounded-full h-9 px-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-stone-600 hover:text-brand-dark rounded-full hover:bg-white cursor-pointer text-xs"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-brand-dark">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-stone-600 hover:text-brand-dark rounded-full hover:bg-white cursor-pointer text-xs"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="font-extrabold text-base text-primary shrink-0 min-w-16 text-right sm:text-left">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-500 hover:text-primary transition-colors self-start mt-2"
            >
              <ArrowLeft size={15} /> Continue Exploring Products
            </Link>
          </div>

          {/* Right Order Summary Column (4 cols) */}
          <div className="lg:col-span-4 text-left">
            <div className="bg-white rounded-3xl border border-brand-border/80 p-6 sm:p-7 shadow-sm sticky top-24">
              <h2 className="font-serif text-xl text-brand-dark pb-4 border-b border-brand-border/60 mb-5">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="mb-5">
                <div className="flex items-center bg-brand-subtle border border-brand-border/80 rounded-full p-1 pl-3.5 focus-within:border-accent-gold transition-colors">
                  <Tag size={15} className="text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. ECO10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-transparent text-xs text-brand-dark placeholder-stone-400 outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-brand-dark hover:bg-primary text-white text-xs font-bold rounded-full transition-colors shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-rose-600 font-medium mt-1.5 pl-2">{couponError}</p>}
                {couponSuccess && <p className="text-xs text-accent-sage font-medium mt-1.5 pl-2">{couponSuccess}</p>}
              </form>

              {/* Summary Calculations */}
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 mb-6">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <strong className="text-brand-dark">${cartSubtotal.toFixed(2)}</strong>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex items-center justify-between text-accent-sage font-semibold">
                    <span>Eco Discount ({appliedDiscount * 100}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Plastic-Free Packing</span>
                  <span className="text-[11px] font-bold text-accent-sage bg-accent-sage-light px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Standard Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-[11px] font-bold text-accent-sage bg-accent-sage-light px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>

                {cartSubtotal < 50 && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-800 leading-relaxed">
                    Add <strong>${(50 - cartSubtotal).toFixed(2)}</strong> more to qualify for <strong>FREE Shipping</strong>!
                  </div>
                )}

                <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between font-bold text-base text-brand-dark">
                  <span>Total (USD)</span>
                  <span className="text-2xl font-extrabold text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all cursor-pointer mb-5 disabled:opacity-70"
              >
                {isCheckingOut ? (
                  <span>Processing Eco Order...</span>
                ) : (
                  <>
                    Proceed to Checkout <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-brand-border/50 space-y-2 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-accent-sage" />
                  <span>256-Bit Encrypted Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf size={15} className="text-accent-sage" />
                  <span>100% Biodegradable Carbon-Neutral Packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
