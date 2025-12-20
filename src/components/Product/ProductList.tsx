import React, { useState, useEffect } from 'react';
import type { Category, Product } from '../../types';
import { ProductCard } from './ProductCard';
import { productService } from '../../services/productService';
import './ProductList.css';

interface ProductListProps {
  onProductSelect: (product: Product) => void;
}

export function ProductList({ onProductSelect }: ProductListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // カテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(categoriesData[0].categoryId);
        }
      } catch (err) {
        console.error('カテゴリ取得エラー:', err);
        setError('カテゴリの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 選択されたカテゴリの商品を取得
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategoryId) return;

      try {
        setIsLoading(true);
        setError(null);
        const productsData = await productService.getProducts(selectedCategoryId);
        setProducts(productsData);
      } catch (err) {
        console.error('商品取得エラー:', err);
        setError('商品の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  return (
    <div className="product-list-container">
      <div className="product-list-header">商品一覧</div>

      {/* カテゴリタブ */}
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category.categoryId}
            className={`category-tab ${
              selectedCategoryId === category.categoryId ? 'active' : ''
            }`}
            onClick={() => setSelectedCategoryId(category.categoryId)}
          >
            {category.categoryName}
          </button>
        ))}
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ローディング表示 */}
      {isLoading && (
        <div className="loading-message">
          読み込み中...
        </div>
      )}

      {/* 商品グリッド */}
      {!isLoading && !error && (
        <div className="products-grid">
          {products.length === 0 ? (
            <div className="no-products">商品がありません</div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onProductClick={onProductSelect}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
