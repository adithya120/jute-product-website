import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ToastNotification from './components/ToastNotification';
import AuthModal from './components/AuthModal';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDescription from './pages/ProductDescription';
import Cart from './pages/Cart';
import Favourites from './pages/Favourites';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-brand-bg text-brand-dark antialiased font-sans">
              <ScrollToTop />
              <Navbar />
              
              <main className="flex-1 w-full">
                <Routes>
                  {/* 1. Home */}
                  <Route path="/" element={<Home />} />

                  {/* 2. Products Catalog */}
                  <Route path="/products" element={<Products />} />

                  {/* 3. Product Description / Details (both by ID and by slug) */}
                  <Route path="/products/:id" element={<ProductDescription />} />
                  <Route path="/products/slug/:slug" element={<ProductDescription />} />

                  {/* 4. Cart */}
                  <Route path="/cart" element={<Cart />} />

                  {/* 5. Favourites / Wishlist */}
                  <Route path="/favourites" element={<Favourites />} />
                  <Route path="/wishlist" element={<Favourites />} />

                  {/* 6. Our Story / About */}
                  <Route path="/about" element={<About />} />

                  {/* 7. Contact & Support */}
                  <Route path="/contact" element={<Contact />} />

                  {/* 8. 404 Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
              <AuthModal />
              <ToastNotification />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
