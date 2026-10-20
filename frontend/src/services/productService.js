import api from './api';

// Curated fallback products showcasing handcrafted eco-friendly jute goods
export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Artisan Jute Tote Bag',
    slug: 'artisan-jute-tote-bag',
    description: 'Eco-friendly natural jute everyday shopping tote with reinforced cotton webbing handles.',
    category_id: 3,
    category_name: 'Bags',
    price: '799.00',
    discount_price: '649.00',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews_count: 42,
    badge: 'Best Seller',
    status: 'active'
  },
  {
    id: 2,
    name: 'Braided Jute Planter Basket',
    slug: 'braided-jute-planter-basket',
    description: 'Hand-woven rustic indoor planter basket made with 100% natural golden jute fiber.',
    category_id: 4,
    category_name: 'Home Decor',
    price: '599.00',
    discount_price: '499.00',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews_count: 28,
    badge: 'Eco Choice',
    status: 'active'
  },
  {
    id: 3,
    name: 'Natural Jute Floor Rug (Round)',
    slug: 'natural-jute-floor-rug-round',
    description: 'Circular woven jute area rug offering earthy warmth, high durability and natural texture.',
    category_id: 4,
    category_name: 'Home Decor',
    price: '2499.00',
    discount_price: '1999.00',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews_count: 19,
    badge: 'Popular',
    status: 'active'
  },
  {
    id: 4,
    name: 'Premium Jute Laptop Sleeve',
    slug: 'premium-jute-laptop-sleeve',
    description: 'Padded shock-absorbent jute canvas laptop case with smooth zipper and water-resistant lining.',
    category_id: 1,
    category_name: 'Accessories',
    price: '1199.00',
    discount_price: '949.00',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviews_count: 35,
    badge: 'New',
    status: 'active'
  },
  {
    id: 5,
    name: 'Handcrafted Jute Table Placemats (Set of 4)',
    slug: 'jute-table-placemats-set',
    description: 'Set of 4 natural heat-resistant round jute placemats for dining table and kitchen decor.',
    category_id: 4,
    category_name: 'Home Decor',
    price: '899.00',
    discount_price: '749.00',
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews_count: 56,
    badge: 'Trending',
    status: 'active'
  },
  {
    id: 6,
    name: 'Organic Jute Market Grocery Bag',
    slug: 'organic-jute-market-bag',
    description: 'Heavy duty laminated jute grocery bag with spacious gusset and durable comfort grips.',
    category_id: 3,
    category_name: 'Bags',
    price: '449.00',
    discount_price: '349.00',
    image: 'https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews_count: 64,
    badge: 'Zero Plastic',
    status: 'active'
  }
];

/**
 * Fetch all products from API with optional query parameters
 * @param {Object} params - Query filters (e.g. category, search, sort)
 */
export const getProducts = async (params = {}) => {
  try {
    const data = await api.get('/products', { params });
    // Backend returns { success: true, products: [...] } or array directly
    const list = Array.isArray(data) ? data : (data?.products || []);
    if (list.length > 0) {
      return { success: true, products: list };
    }
    // If backend returns empty array, provide fallback products so UI displays properly
    return { success: true, products: FALLBACK_PRODUCTS };
  } catch (error) {
    console.warn('Backend products endpoint unavailable, using curated fallback catalog:', error.message);
    return { success: true, products: FALLBACK_PRODUCTS, isFallback: true };
  }
};

/**
 * Fetch single product details by numeric ID
 * @param {string|number} id - Product ID
 */
export const getProductById = async (id) => {
  try {
    const data = await api.get(`/products/${id}`);
    return data;
  } catch (error) {
    console.warn(`Product ID ${id} not found on server, searching fallback:`, error.message);
    const fallback = FALLBACK_PRODUCTS.find((p) => String(p.id) === String(id));
    if (fallback) {
      return fallback;
    }
    throw error;
  }
};

/**
 * Fetch single product details by slug (includes images & variants)
 * @param {string} slug - Product slug
 */
export const getProductBySlug = async (slug) => {
  try {
    const data = await api.get(`/products/slug/${slug}`);
    return data;
  } catch (error) {
    console.warn(`Product slug "${slug}" not found on server:`, error.message);
    const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug || String(p.id) === String(slug));
    if (fallback) {
      return {
        success: true,
        product: {
          id: fallback.id,
          name: fallback.name,
          slug: fallback.slug,
          description: fallback.description,
          brand: 'JuteCraft Organics',
          status: 'active',
          category: {
            id: fallback.category_id,
            name: fallback.category_name,
          },
          images: [
            { id: 1, url: fallback.image, alt: fallback.name, isPrimary: true, displayOrder: 1 },
            { id: 2, url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', alt: `${fallback.name} angle view`, isPrimary: false, displayOrder: 2 },
            { id: 3, url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80', alt: `${fallback.name} texture detail`, isPrimary: false, displayOrder: 3 },
          ],
          variants: [
            { id: 1, sku: `${fallback.slug.toUpperCase()}-NAT-S`, color: 'Natural Golden', size: 'Standard', price: fallback.price, discountPrice: fallback.discount_price, stock: 24, status: 'active' },
            { id: 2, sku: `${fallback.slug.toUpperCase()}-BRN-M`, color: 'Earthy Brown', size: 'Large', price: String(Number(fallback.price) + 200), discountPrice: String(Number(fallback.discount_price) + 150), stock: 15, status: 'active' },
          ]
        }
      };
    }
    throw error;
  }
};

/**
 * Create a new product (Admin)
 * @param {Object} productData
 */
export const createProduct = async (productData) => {
  return await api.post('/products', productData);
};

/**
 * Update an existing product (Admin)
 * @param {string|number} id
 * @param {Object} productData
 */
export const updateProduct = async (id, productData) => {
  return await api.patch(`/products/${id}`, productData);
};

/**
 * Delete a product (Admin)
 * @param {string|number} id
 */
export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`);
};

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  FALLBACK_PRODUCTS,
};