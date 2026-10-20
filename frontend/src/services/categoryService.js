import api from './api';

export const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Bags & Totes', slug: 'bags', icon: 'ShoppingBag' },
  { id: 2, name: 'Home & Living', slug: 'home-decor', icon: 'Home' },
  { id: 3, name: 'Planters & Baskets', slug: 'planters', icon: 'Package' },
  { id: 4, name: 'Office & Tech', slug: 'tech-accessories', icon: 'Briefcase' },
];

/**
 * Fetch all product categories
 * GET /api/categories
 */
export const getCategories = async () => {
  try {
    const data = await api.get('/categories');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return FALLBACK_CATEGORIES;
  } catch (error) {
    console.warn('Backend categories unavailable, using fallback categories:', error.message);
    return FALLBACK_CATEGORIES;
  }
};

/**
 * Fetch category by ID
 * GET /api/categories/:id
 * @param {string|number} id
 */
export const getCategoryById = async (id) => {
  return await api.get(`/categories/${id}`);
};

/**
 * Create a new category
 * POST /api/categories
 * @param {Object} data - { name }
 */
export const createCategory = async (data) => {
  return await api.post('/categories', data);
};

/**
 * Update an existing category
 * PATCH /api/categories/:id
 * @param {string|number} id
 * @param {Object} data - { name }
 */
export const updateCategory = async (id, data) => {
  return await api.patch(`/categories/${id}`, data);
};

/**
 * Delete a category
 * DELETE /api/categories/:id
 * @param {string|number} id
 */
export const deleteCategory = async (id) => {
  return await api.delete(`/categories/${id}`);
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  FALLBACK_CATEGORIES,
};
