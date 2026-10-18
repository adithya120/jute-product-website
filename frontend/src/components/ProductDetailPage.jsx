import React, { useState } from 'react';
import './ProductDetailPage.css';

export default function ProductDetailPage({ productData, onBack }) {
  const product = productData.product;
  
  // State for media preview and variant selection matching your JSON structure
  const [selectedMedia, setSelectedMedia] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size || '');

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];

  const currentVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  ) || product.variants[0];

  const handleAddToCart = () => {
    alert(`Added to cart: ${product.name} (${currentVariant.color}, ${currentVariant.size}) - SKU: ${currentVariant.sku}`);
  };

  return (
    <div className="product-detail-wrapper">
      <button className="back-button" onClick={onBack}>
        &larr; Back to Products
      </button>

      <div className="product-detail-container">
        {/* Left Side: Dynamic Gallery & Media Preview */}
        <div className="detail-gallery">
          <div className="main-preview">
            {selectedMedia.url.endsWith('.mp4') ? (
              <video src={selectedMedia.url} controls autoPlay muted />
            ) : (
              <img src={selectedMedia.url} alt={selectedMedia.alt} />
            )}
          </div>

          <div className="thumbnail-list">
            {product.images.map((img) => (
              <div 
                key={img.id} 
                className={`thumbnail ${selectedMedia.id === img.id ? 'active' : ''}`}
                onClick={() => setSelectedMedia(img)}
              >
                {img.url.endsWith('.mp4') ? (
                  <video src={img.url} />
                ) : (
                  <img src={img.url} alt={img.alt} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Product Information & Variant Selector */}
        <div className="detail-info">
          <span className="detail-category">{product.category.name}</span>
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-description">{product.description}</p>

          <div className="detail-pricing">
            <span className="detail-current-price">${currentVariant.discountPrice}</span>
            <span className="detail-original-price">${currentVariant.price}</span>
          </div>

          <div className="variants-section">
            {/* Color Selector */}
            <div className="variant-group">
              <label>Color: <strong>{selectedColor}</strong></label>
              <div className="variant-options">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`variant-chip ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="variant-group">
              <label>Size: <strong>{selectedSize}</strong></label>
              <div className="variant-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`variant-chip ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="stock-status">
              {currentVariant.stock > 0 ? (
                <span className="in-stock">In Stock ({currentVariant.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
          </div>

          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={currentVariant.stock <= 0}
          >
            {currentVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
