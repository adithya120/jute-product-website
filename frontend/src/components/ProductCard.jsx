import React from 'react';
import './ProductCard.css';

export default function ProductCard({ product, onViewDetails }) {
  const { name, description, category_name, price, discount_price, image } = product;

  return (
    <div className="product-card" onClick={() => onViewDetails(product)}>
      <div className="card-image-container">
        {image ? (
          <img src={image} alt={name} className="card-image" />
        ) : (
          <div className="no-image-placeholder">No Image Available</div>
        )}
        {category_name && <span className="category-badge">{category_name}</span>}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        <p className="card-description">{description}</p>
        
        <div className="card-pricing">
          {discount_price ? (
            <>
              <span className="current-price">${discount_price}</span>
              <span className="original-price">${price}</span>
            </>
          ) : (
            <span className="current-price">{price ? `$${price}` : 'Price on request'}</span>
          )}
        </div>

        <button 
          className="card-button" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onViewDetails(product); 
          }}
        >
          View Product
        </button>
      </div>
    </div>
  );
}