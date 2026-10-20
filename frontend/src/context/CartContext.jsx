import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import authService from '../services/authService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('jute_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Sync with backend cart if user is authenticated
  const fetchBackendCart = useCallback(async () => {
    if (!authService.isAuthenticated()) return;
    try {
      setLoading(true);
      const res = await cartService.getCart();
      const serverItems = res?.cart || (Array.isArray(res) ? res : []);
      if (serverItems.length > 0) {
        const mapped = serverItems.map((item) => ({
          cartItemId: String(item.cart_item_id || item.id),
          serverCartItemId: item.cart_item_id || item.id,
          productId: item.product_id,
          variantId: item.variant_id,
          name: item.product_name || item.name,
          slug: item.slug,
          image: item.image_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80',
          price: Number(item.discount_price || item.price || 599),
          originalPrice: Number(item.price || item.discount_price || 599),
          color: item.color || null,
          size: item.size || null,
          sku: item.sku || null,
          quantity: Number(item.quantity || 1),
        }));
        setCartItems(mapped);
      }
    } catch (err) {
      console.warn('Could not sync with backend cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackendCart();
  }, [fetchBackendCart]);

  useEffect(() => {
    try {
      localStorage.setItem('jute_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  /**
   * Add product to cart (calls backend API if variant_id and user token are available)
   */
  const addToCart = async (product, variant = null, quantity = 1) => {
    const variantId = variant?.id || product.variant_id || (product.variants?.[0]?.id);
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated && variantId) {
      try {
        await cartService.addToCart({
          variant_id: variantId,
          quantity: Math.max(1, quantity),
        });
        await fetchBackendCart();
        showToast(`Added "${product.name}" to your cart!`);
        return;
      } catch (err) {
        console.warn('Backend addToCart error, falling back to local cart:', err.message);
      }
    }

    // Local cart fallback
    setCartItems((prevItems) => {
      const variantKey = variant ? `${product.id}-${variant.sku || variant.id}` : `${product.id}-default`;
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === variantKey);

      const price = variant?.discountPrice || variant?.price || product.discount_price || product.price || 599;
      const originalPrice = variant?.price || product.price || price;
      const image = variant?.image || product.image || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80';

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartItemId: variantKey,
            productId: product.id,
            variantId: variantId || null,
            name: product.name,
            slug: product.slug,
            image,
            price: Number(price),
            originalPrice: Number(originalPrice),
            color: variant?.color || null,
            size: variant?.size || null,
            sku: variant?.sku || null,
            quantity: Math.max(1, quantity),
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to your cart!`);
  };

  /**
   * Update item quantity (calls backend if serverCartItemId exists)
   */
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (authService.isAuthenticated() && item?.serverCartItemId) {
      try {
        await cartService.updateCartItem(item.serverCartItemId, newQuantity);
      } catch (err) {
        console.warn('Backend updateCartItem failed:', err.message);
      }
    }

    setCartItems((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  /**
   * Remove item from cart (calls backend if serverCartItemId exists)
   */
  const removeFromCart = async (cartItemId) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (authService.isAuthenticated() && item?.serverCartItemId) {
      try {
        await cartService.removeCartItem(item.serverCartItemId);
      } catch (err) {
        console.warn('Backend removeCartItem failed:', err.message);
      }
    }

    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    showToast('Item removed from cart');
  };

  /**
   * Clear all items
   */
  const clearCart = async () => {
    if (authService.isAuthenticated()) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.warn('Backend clearCart failed:', err.message);
      }
    }
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toastMessage,
        loading,
        fetchBackendCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
