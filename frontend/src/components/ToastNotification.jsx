import React from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Leaf } from 'lucide-react';

export default function ToastNotification() {
  const { toastMessage: cartToast } = useCart();
  const { toastMessage: wishlistToast } = useWishlist();

  const message = cartToast || wishlistToast;

  if (!message) return null;

  return (
    <div
      className="fixed bottom-7 right-7 z-50 flex items-center gap-3 rounded-xl bg-[#1e1d1b] px-5 py-3.5 text-sm font-semibold text-white shadow-2xl border-l-4 border-accent-gold animate-in fade-in slide-in-from-bottom-5 duration-300"
      role="status"
      aria-live="polite"
    >
      <Leaf size={18} className="text-accent-sage flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
