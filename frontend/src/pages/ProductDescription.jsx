import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Star,
  ShieldCheck,
  Leaf,
  Truck,
  RotateCcw,
  Check,
  Share2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { getProductById, getProductBySlug, getProducts, FALLBACK_PRODUCTS } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';

// Currency Formatter
const formatINR = (amount) => {
  const numericVal = Number(amount);
  if (isNaN(numericVal)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericVal);
};

export default function ProductDescription() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeMedia, setActiveMedia] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('craft');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedData = null;

        if (slug) {
          const res = await getProductBySlug(slug);
          fetchedData = res?.product || res;
        } else if (id) {
          const res = await getProductById(id);
          fetchedData = res?.product || res;
        }

        if (!fetchedData) throw new Error('Product not found');

        const normalized = {
          id: fetchedData.id,
          name: fetchedData.name,
          slug: fetchedData.slug || `product-${fetchedData.id}`,
          description: fetchedData.description || 'Finely handcrafted using 100% natural organic jute fibers.',
          brand: fetchedData.brand || 'Jutology',
          status: fetchedData.status || 'active',
          rating: fetchedData.rating || 4.9,
          reviews_count: fetchedData.reviews_count || 48,
          category: fetchedData.category || {
            id: fetchedData.category_id,
            name: fetchedData.category_name || 'Handcrafted Jute',
          },
          images:
            fetchedData.images && fetchedData.images.length > 0
              ? fetchedData.images
              : [
                  { id: 1, url: fetchedData.image || DEFAULT_IMAGE, alt: fetchedData.name },
                  { id: 2, url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80', alt: 'Angle Detail' },
                  { id: 3, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', alt: 'Weave Detail' },
                ],
          variants:
            fetchedData.variants && fetchedData.variants.length > 0
              ? fetchedData.variants
              : [
                  {
                    id: 1,
                    sku: `${(fetchedData.slug || 'JUTE').toUpperCase()}-NAT-STD`,
                    color: 'Natural Golden',
                    size: 'Standard',
                    price: fetchedData.price || '1499',
                    discountPrice: fetchedData.discount_price || '1199',
                  },
                  {
                    id: 2,
                    sku: `${(fetchedData.slug || 'JUTE').toUpperCase()}-BRN-LRG`,
                    color: 'Earthy Sand',
                    size: 'Large',
                    price: fetchedData.price ? String(Number(fetchedData.price) + 400) : '1899',
                    discountPrice: fetchedData.discount_price ? String(Number(fetchedData.discount_price) + 300) : '1499',
                  },
                ],
        };

        setProduct(normalized);
        setActiveMedia(normalized.images[0]);
        setSelectedColor(normalized.variants[0]?.color || 'Natural Golden');
        setSelectedSize(normalized.variants[0]?.size || 'Standard');

        const allRes = await getProducts();
        const related = (allRes?.products || FALLBACK_PRODUCTS)
          .filter((p) => String(p.id) !== String(normalized.id))
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError(err.message || 'Product details currently unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id, slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center gap-3 text-stone-500">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-[#1b3d2b] rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest font-medium text-stone-600">Curating Artisan Details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-3xl text-stone-900 mb-2">Item Unavailable</h2>
        <p className="text-stone-500 text-sm max-w-sm mb-6">{error || "We couldn't locate this piece in the Jutology gallery."}</p>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-full bg-[#1b3d2b] text-white text-xs font-semibold tracking-wider uppercase transition-colors hover:bg-[#2d6a4f]"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];

  const currentVariant =
    product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    ) || product.variants[0];

  const displayPrice = Number(currentVariant.discountPrice || currentVariant.price);
  const originalPrice = Number(currentVariant.price);
  const hasDiscount = originalPrice > displayPrice;
  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, currentVariant, quantity);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-800 font-sans antialiased pb-28">
      
      {/* Top Navigation Bar */}
      <nav className="border-b border-stone-200/80 bg-white/50 backdrop-blur-md py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-stone-500">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-medium text-stone-800 hover:text-[#1b3d2b] transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} /> <span>Back to Catalog</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-stone-400">
            <Link to="/" className="hover:text-stone-700">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-stone-700">Products</Link>
            <span>/</span>
            <span className="text-stone-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Featured Hero Frame */}
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 group">
              <img
                src={activeMedia?.url || DEFAULT_IMAGE}
                alt={activeMedia?.alt || product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
              />
              
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[#1b3d2b] border border-white/60 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-xs">
                <Sparkles size={11} className="text-amber-500" />
                Handwoven Jute
              </span>

              <button
                type="button"
                onClick={handleShare}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-white/60 flex items-center justify-center text-stone-700 hover:text-[#1b3d2b] transition-all shadow-xs"
                title="Share piece"
              >
                {copiedLink ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} />}
              </button>
            </div>

            {/* Thumbnail Carousel Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveMedia(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeMedia?.id === img.id
                      ? 'border-[#1b3d2b] ring-2 ring-[#1b3d2b]/20 scale-102 opacity-100'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Buying & Details Panel (Sticky Desktop) */}
          <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-24">
            
            {/* Header Info */}
            <div className="border-b border-stone-200/80 pb-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-500">
                  <Star size={14} className="fill-amber-400" />
                  <span className="ml-1 text-xs font-semibold text-stone-800">{product.rating}</span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 font-light">{product.reviews_count} Reviews</span>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-stone-900">
                  {formatINR(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-400 line-through font-light">
                    {formatINR(originalPrice)}
                  </span>
                )}
                <span className="text-xs text-stone-400 font-light ml-auto">
                  Taxes included
                </span>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-sm text-stone-600 leading-relaxed font-light mb-6">
              {product.description}
            </p>

            {/* Variants Picker */}
            <div className="space-y-5 mb-8">
              {/* Color Selection */}
              {colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs text-stone-600 mb-2">
                    <span className="uppercase tracking-wider font-medium text-[10px] text-stone-400">Shade</span>
                    <span className="font-semibold text-stone-800">{selectedColor}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          selectedColor === c
                            ? 'bg-[#1b3d2b] text-white shadow-xs'
                            : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs text-stone-600 mb-2">
                    <span className="uppercase tracking-wider font-medium text-[10px] text-stone-400">Dimension</span>
                    <span className="font-semibold text-stone-800">{selectedSize}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          selectedSize === s
                            ? 'bg-[#1b3d2b] text-white shadow-xs'
                            : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons Block */}
            <div className="flex items-center gap-3 mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center bg-white border border-stone-200 rounded-xl h-12 px-2 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 text-sm font-semibold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 text-sm font-semibold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-12 rounded-xl bg-[#1b3d2b] hover:bg-[#2d6a4f] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <ShoppingBag size={15} /> Add to Bag • {formatINR(displayPrice * quantity)}
              </button>

              {/* Wishlist Toggle */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 rounded-xl border bg-white flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                  isFavorite ? 'border-rose-200 text-rose-600 bg-rose-50/50' : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
                title="Save to Favourites"
              >
                <Heart size={18} fill={isFavorite ? '#e63946' : 'none'} />
              </button>
            </div>

            {/* Value Guarantees Strip */}
            <div className="border-t border-stone-200/80 pt-6 space-y-3 text-xs text-stone-600">
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-[#1b3d2b] shrink-0" />
                <span>Complimentary Plastic-Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={16} className="text-[#1b3d2b] shrink-0" />
                <span>30-Day Hassle-Free Returns & Direct Support</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-[#1b3d2b] shrink-0" />
                <span>Fair-Trade Certified Artisan Creation</span>
              </div>
            </div>

            {/* Editorial Accordion Details */}
            <div className="border-t border-stone-200/80 mt-8 pt-2">
              
              {/* Accordion Item 1 */}
              <div className="border-b border-stone-200/80">
                <button
                  type="button"
                  onClick={() => toggleAccordion('craft')}
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-stone-900"
                >
                  <span>Craft & Heritage</span>
                  <ChevronDown
                    size={16}
                    className={`text-stone-400 transition-transform duration-200 ${
                      openAccordion === 'craft' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'craft' && (
                  <div className="pb-4 text-xs text-stone-600 leading-relaxed font-light space-y-2">
                    <p>Handwoven by skilled artisan clusters in West Bengal using golden jute harvested during monsoon season.</p>
                    <ul className="list-disc pl-4 space-y-1 text-stone-500">
                      <li>Material: 100% Organic Golden Jute</li>
                      <li>Dyes: Azo-Free Organic Vegetable Pigments</li>
                      <li>Finish: Sun-Bleached Natural Fiber</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion Item 2 */}
              <div className="border-b border-stone-200/80">
                <button
                  type="button"
                  onClick={() => toggleAccordion('planet')}
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-stone-900"
                >
                  <span>Planet & Sustainability Impact</span>
                  <ChevronDown
                    size={16}
                    className={`text-stone-400 transition-transform duration-200 ${
                      openAccordion === 'planet' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'planet' && (
                  <div className="pb-4 text-xs text-stone-600 leading-relaxed font-light space-y-2">
                    <p>Golden Jute absorbs 2.4x more carbon dioxide than standard commercial crops and leaves zero synthetic waste behind.</p>
                    <p className="text-emerald-800 font-medium">100% Biodegradable within 90 days of natural composting.</p>
                  </div>
                )}
              </div>

              {/* Accordion Item 3 */}
              <div className="border-b border-stone-200/80">
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-stone-900"
                >
                  <span>Care & Longevity</span>
                  <ChevronDown
                    size={16}
                    className={`text-stone-400 transition-transform duration-200 ${
                      openAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'care' && (
                  <div className="pb-4 text-xs text-stone-600 leading-relaxed font-light space-y-1">
                    <p>• Spot clean immediately with a damp cloth and mild neutral soap.</p>
                    <p>• Air dry in indirect sunlight. Avoid prolonged damp storage.</p>
                    <p>• Do not machine wash or submerge completely in hot water.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Related Products Carousel Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-stone-200/80">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium">
                You May Also Cherish
              </h2>
              <Link to="/products" className="text-xs font-semibold text-[#1b3d2b] hover:underline">
                View Collection &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating Bottom Conversion Bar (Mobile & Desktop Scroll) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 py-3 px-4 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex flex-col">
            <span className="font-serif text-sm font-semibold text-stone-900 truncate max-w-xs">{product.name}</span>
            <span className="text-xs text-stone-500">{selectedColor} / {selectedSize}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
            <span className="text-base font-bold text-stone-900">{formatINR(displayPrice)}</span>
            <button
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#1b3d2b] hover:bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
