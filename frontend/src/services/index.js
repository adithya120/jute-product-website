export { default as api } from './api';
export * from './productService';
export * from './cartService';
export * from './categoryService';
export * from './authService';
export * from './productImageService';

// Default grouped export for convenience: import apiServices from './services';
import productService from './productService';
import cartService from './cartService';
import categoryService from './categoryService';
import authService from './authService';
import productImageService from './productImageService';
import api from './api';

export default {
  api,
  products: productService,
  cart: cartService,
  categories: categoryService,
  auth: authService,
  images: productImageService,
};
