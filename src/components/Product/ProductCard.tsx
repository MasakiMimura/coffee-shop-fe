import React from 'react';
import type { Product } from '../../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const displayPrice = product.isCampaign
    ? Math.floor(product.price * (1 - product.campaignDiscountPercent / 100))
    : product.price;

  return (
    <div className="product-card" onClick={() => onProductClick(product)}>
      <div className="product-image-placeholder">
        ☕
      </div>
      <div className="product-info">
        <div className="product-name">{product.productName}</div>
        <div className="product-price-section">
          {product.isCampaign ? (
            <>
              <span className="original-price">¥{product.price}</span>
              <span className="campaign-price">¥{displayPrice}</span>
            </>
          ) : (
            <span className="regular-price">¥{product.price}</span>
          )}
        </div>
        {product.isCampaign && (
          <div className="campaign-badge">キャンペーン中</div>
        )}
      </div>
    </div>
  );
}
