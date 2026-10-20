import api from './api';

/**
 * Get current user's cart from backend
 */
export const getCart = async () => {
  return await api.get('/cart');
};

/**
 * Add an item to user's cart
 * @param {Object} itemData - { variant_id or product_id, quantity }
 */
export const addToCart = async (itemData) => {
  return await api.post('/cart/items', itemData);
};

/**
 * Update quantity of a cart item
 * @param {string|number} itemId
 * @param {number} quantity
 */
export const updateCartItem = async (itemId, quantity) => {
  return await api.patch(`/cart/items/${itemId}`, { quantity });
};

/**
 * Remove an item from the cart
 * @param {string|number} itemId
 */
export const removeCartItem = async (itemId) => {
  return await api.delete(`/cart/items/${itemId}`);
};

/**
 * Clear all items from the cart
 */
export const clearCart = async () => {
  return await api.delete('/cart');
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
