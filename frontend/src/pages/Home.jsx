// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   ArrowRight,
//   Leaf,
//   Sparkles,
//   ShieldCheck,
//   Award,
//   RefreshCw,
//   ShoppingBag,
//   Star,
//   ChevronRight
// } from 'lucide-react';
// import ProductCard from '../components/ProductCard';
// import { getProducts } from '../services/productService';
// import { getCategories } from '../services/categoryService';

// export default function Home() {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadHomeData = async () => {
//       try {
//         const [prodData, catData] = await Promise.all([
//           getProducts(),
//           getCategories(),
//         ]);
//         setFeaturedProducts(prodData?.products?.slice(0, 4) || []);
//         setCategories(catData || []);
//       } catch (err) {
//         console.error('Error loading home data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadHomeData();
//   }, []);

//   return (
//     <div className="flex flex-col">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden py-14 sm:py-20 bg-gradient-to-b from-[#fbf8f3] via-brand-bg to-brand-bg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
//           {/* Hero Left Content */}
//           <div className="lg:col-span-7 flex flex-col items-start text-left">
//             <div className="inline-flex items-center gap-2 bg-accent-sage-light text-accent-sage text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6">
//               <Sparkles size={13} /> 100% Sustainable & Handcrafted
//             </div>

//             <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-dark leading-[1.15] tracking-tight mb-5">
//               The Golden Fiber, <br />
//               <span className="text-primary italic font-normal">Reimagined</span> For Modern Living.
//             </h1>

//             <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed mb-8">
//               Ditch plastic without compromising elegance. Explore our conscious collection of
//               hand-braided jute bags, earthy home decor, and organic lifestyle essentials
//               crafted ethically by master artisans.
//             </p>

//             <div className="flex items-center gap-4 flex-wrap mb-10 w-full sm:w-auto">
//               <Link
//                 to="/products"
//                 className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
//               >
//                 Explore Collection <ArrowRight size={17} />
//               </Link>
//               <Link
//                 to="/about"
//                 className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-brand-subtle text-brand-dark border border-brand-border text-sm font-bold transition-all duration-200"
//               >
//                 Our Sustainability Story
//               </Link>
//             </div>

//             {/* Hero Stats */}
//             <div className="w-full max-w-lg grid grid-cols-3 gap-4 pt-6 border-t border-brand-border/60">
//               <div>
//                 <span className="block font-serif text-2xl sm:text-3xl font-extrabold text-brand-dark">100%</span>
//                 <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Biodegradable</span>
//               </div>
//               <div className="border-l border-brand-border/60 pl-4">
//                 <span className="block font-serif text-2xl sm:text-3xl font-extrabold text-brand-dark">5,000+</span>
//                 <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Happy Homes</span>
//               </div>
//               <div className="border-l border-brand-border/60 pl-4">
//                 <span className="block font-serif text-2xl sm:text-3xl font-extrabold text-brand-dark">0%</span>
//                 <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Plastic Waste</span>
//               </div>
//             </div>
//           </div>

//           {/* Hero Right Visual */}
//           <div className="lg:col-span-5 relative flex justify-center">
//             <div className="relative w-full max-w-md">
//               <img
//                 src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
//                 alt="Artisan Handcrafted Jute Tote"
//                 className="w-full h-[460px] sm:h-[500px] object-cover rounded-3xl shadow-2xl border-8 border-white"
//               />

//               {/* Floating Badge 1 */}
//               <div className="absolute top-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/80 flex items-center gap-3 animate-pulse">
//                 <div className="w-8 h-8 rounded-full bg-accent-sage-light text-accent-sage flex items-center justify-center shrink-0">
//                   <Leaf size={16} />
//                 </div>
//                 <div>
//                   <strong className="block text-xs text-brand-dark font-bold">Carbon Negative</strong>
//                   <p className="text-[10px] text-stone-500 m-0">Absorbs 15T CO2/ha</p>
//                 </div>
//               </div>

//               {/* Floating Badge 2 */}
//               <div className="absolute bottom-8 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/80 flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-full bg-amber-100 text-primary flex items-center justify-center shrink-0">
//                   <Award size={16} />
//                 </div>
//                 <div>
//                   <strong className="block text-xs text-brand-dark font-bold">Artisan Certified</strong>
//                   <p className="text-[10px] text-stone-500 m-0">100% Fair Trade</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Trust Badges Strip */}
//       <section className="bg-white border-y border-brand-border/60 py-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           <div className="flex items-center gap-4 text-left">
//             <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
//               <Leaf size={24} />
//             </div>
//             <div>
//               <h3 className="font-bold text-sm text-brand-dark">Zero Plastic</h3>
//               <p className="text-xs text-stone-500 leading-relaxed">Pure raw golden jute & cotton webbing</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 text-left">
//             <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
//               <RefreshCw size={24} />
//             </div>
//             <div>
//               <h3 className="font-bold text-sm text-brand-dark">Circular Living</h3>
//               <p className="text-xs text-stone-500 leading-relaxed">Composts into rich soil in &lt;90 days</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 text-left">
//             <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
//               <ShieldCheck size={24} />
//             </div>
//             <div>
//               <h3 className="font-bold text-sm text-brand-dark">Built to Endure</h3>
//               <p className="text-xs text-stone-500 leading-relaxed">Heavy-duty natural fiber strength</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 text-left">
//             <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
//               <ShoppingBag size={24} />
//             </div>
//             <div>
//               <h3 className="font-bold text-sm text-brand-dark">Direct Fair Trade</h3>
//               <p className="text-xs text-stone-500 leading-relaxed">Sustaining rural craftswomen clusters</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Curated Category Cards */}
//       <section className="py-16 sm:py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-end justify-between mb-10 text-left">
//             <div>
//               <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary block mb-1">
//                 DISCOVER BY ROOM & USE
//               </span>
//               <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark">Curated Collections</h2>
//             </div>
//             <Link
//               to="/products"
//               className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-hover hover:translate-x-1 transition-all"
//             >
//               View All Categories <ChevronRight size={17} />
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Link
//               to="/products?category=Bags"
//               className="group relative h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?auto=format&fit=crop&w=600&q=80"
//                 alt="Jute Bags & Totes"
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-7 text-left text-white">
//                 <h3 className="font-serif text-2xl font-bold mb-1">Bags & Everyday Totes</h3>
//                 <p className="text-xs text-stone-300 mb-3">Spacious, chic & durable market carryalls</p>
//                 <span className="text-xs font-bold text-accent-gold group-hover:translate-x-1 transition-transform">
//                   Shop Totes &rarr;
//                 </span>
//               </div>
//             </Link>

//             <Link
//               to="/products?category=Home+Decor"
//               className="group relative h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
//                 alt="Jute Floor Rugs"
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-7 text-left text-white">
//                 <h3 className="font-serif text-2xl font-bold mb-1">Handwoven Floor Rugs</h3>
//                 <p className="text-xs text-stone-300 mb-3">Textured rugs bringing organic warmth</p>
//                 <span className="text-xs font-bold text-accent-gold group-hover:translate-x-1 transition-transform">
//                   Shop Rugs &rarr;
//                 </span>
//               </div>
//             </Link>

//             <Link
//               to="/products?category=Planters"
//               className="group relative h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80"
//                 alt="Baskets and Planters"
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-7 text-left text-white">
//                 <h3 className="font-serif text-2xl font-bold mb-1">Planters & Storage</h3>
//                 <p className="text-xs text-stone-300 mb-3">Rustic braided baskets for your houseplants</p>
//                 <span className="text-xs font-bold text-accent-gold group-hover:translate-x-1 transition-transform">
//                   Shop Baskets &rarr;
//                 </span>
//               </div>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Trending Products Grid */}
//       <section className="py-16 sm:py-20 bg-white border-y border-brand-border/60">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-end justify-between mb-10 text-left">
//             <div>
//               <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary block mb-1">
//                 CONSCIOUS CRAFTSMANSHIP
//               </span>
//               <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark">Trending This Season</h2>
//             </div>
//             <Link
//               to="/products"
//               className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-hover hover:translate-x-1 transition-all"
//             >
//               Browse Entire Catalog <ChevronRight size={17} />
//             </Link>
//           </div>

//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-500">
//               <div className="w-8 h-8 border-3 border-brand-border border-t-primary rounded-full animate-spin" />
//               <p className="text-sm">Fetching sustainable goods...</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {featuredProducts.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Why Jute Section */}
//       <section className="py-20 bg-[#f4eee3]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//           <div className="relative">
//             <img
//               src="https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80"
//               alt="Raw jute plant and hand weaving process"
//               className="w-full h-[460px] object-cover rounded-3xl shadow-xl"
//             />
//           </div>

//           <div className="flex flex-col text-left">
//             <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary block mb-1">
//               THE PLANET'S STRONGEST FIBER
//             </span>
//             <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark mb-4">
//               Why Conscious Shoppers Are Choosing Jute
//             </h2>
//             <p className="text-base text-stone-600 leading-relaxed mb-6">
//               Jute is nicknamed the <em>"Golden Fiber"</em> because of its shimmering organic sheen
//               and exceptional environmental footprint.
//             </p>

//             <div className="space-y-5 mb-8">
//               <div className="flex items-start gap-4">
//                 <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
//                   1
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-sm text-brand-dark mb-0.5">100% Rainfed & Pesticide Free</h4>
//                   <p className="text-xs text-stone-600 leading-relaxed">
//                     Jute thrives primarily on monsoon rainfall, requiring virtually zero synthetic pesticides.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
//                   2
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-sm text-brand-dark mb-0.5">High Carbon Sequestration</h4>
//                   <p className="text-xs text-stone-600 leading-relaxed">
//                     One hectare of jute crops absorbs 15 tonnes of CO2 and releases 11 tonnes of pure oxygen in 120 days.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
//                   3
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-sm text-brand-dark mb-0.5">Enriches Soil Upon Harvest</h4>
//                   <p className="text-xs text-stone-600 leading-relaxed">
//                     Naturally sheds leaves that compost and nourish topsoil for future crops.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <Link
//               to="/about"
//               className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-primary/20 transition-colors"
//             >
//               Read Full Sustainability Impact &rarr;
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Customer Reviews Section */}
//       <section className="py-16 sm:py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-2xl mx-auto mb-12">
//             <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary block mb-1">
//               VOICES OF CONSCIOUS HOMES
//             </span>
//             <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark">Loved By Our Community</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
//             <div className="bg-white border border-brand-border/80 rounded-2xl p-7 shadow-xs flex flex-col">
//               <div className="flex gap-1 mb-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} size={15} fill="#d4a373" color="#d4a373" />
//                 ))}
//               </div>
//               <p className="text-sm text-stone-600 italic leading-relaxed mb-6 flex-1">
//                 "The Artisan Tote bag is breathtaking! The craftsmanship is visibly superior to ordinary canvas bags. It easily holds my 15-inch laptop, water bottle, and grocery haul."
//               </p>
//               <div className="flex items-center gap-3 pt-4 border-t border-brand-border/50">
//                 <div className="w-10 h-10 rounded-full bg-accent-sage-light text-accent-sage font-bold flex items-center justify-center text-sm">
//                   EP
//                 </div>
//                 <div>
//                   <strong className="block text-sm text-brand-dark">Emma Peterson</strong>
//                   <span className="text-xs text-stone-400">Eco-Living Advocate</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white border border-brand-border/80 rounded-2xl p-7 shadow-xs flex flex-col">
//               <div className="flex gap-1 mb-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} size={15} fill="#d4a373" color="#d4a373" />
//                 ))}
//               </div>
//               <p className="text-sm text-stone-600 italic leading-relaxed mb-6 flex-1">
//                 "We replaced our synthetic rugs with the natural round jute floor rug. It immediately gave our living room a serene, earthy sanctuary feeling. Highly recommend!"
//               </p>
//               <div className="flex items-center gap-3 pt-4 border-t border-brand-border/50">
//                 <div className="w-10 h-10 rounded-full bg-accent-sage-light text-accent-sage font-bold flex items-center justify-center text-sm">
//                   MC
//                 </div>
//                 <div>
//                   <strong className="block text-sm text-brand-dark">Marcus Chen</strong>
//                   <span className="text-xs text-stone-400">Interior Architect</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white border border-brand-border/80 rounded-2xl p-7 shadow-xs flex flex-col">
//               <div className="flex gap-1 mb-4">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} size={15} fill="#d4a373" color="#d4a373" />
//                 ))}
//               </div>
//               <p className="text-sm text-stone-600 italic leading-relaxed mb-6 flex-1">
//                 "Super quick delivery and completely plastic-free packing with recycled craft paper. Knowing this supports fair-trade rural artisans makes it even more special."
//               </p>
//               <div className="flex items-center gap-3 pt-4 border-t border-brand-border/50">
//                 <div className="w-10 h-10 rounded-full bg-accent-sage-light text-accent-sage font-bold flex items-center justify-center text-sm">
//                   SR
//                 </div>
//                 <div>
//                   <strong className="block text-sm text-brand-dark">Sophia Reynolds</strong>
//                   <span className="text-xs text-stone-400">Verified Buyer</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
import React from 'react'

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home