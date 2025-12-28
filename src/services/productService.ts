import { apiClient } from './api';
import type { Category, Product } from '../types';

export interface GetCategoriesResponse {
  categories: Category[];
}

export interface GetProductsResponse {
  products: Product[];
}

export class ProductService {
  /**
   * カテゴリ一覧を取得
   * モック: '/mock/categories'
   * 実API: '/api/v1/categories'
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<GetCategoriesResponse>('/mock/categories');
    return response.categories;
  }

  /**
   * 商品一覧を取得（カテゴリ指定可能）
   * モック: '/mock/products' または '/mock/products?categoryId={id}'
   * 実API: '/api/v1/products' または '/api/v1/products?categoryId={id}'
   */
  async getProducts(categoryId?: number): Promise<Product[]> {
    const endpoint = categoryId
      ? `/mock/products?categoryId=${categoryId}`
      : '/mock/products';
    const response = await apiClient.get<GetProductsResponse>(endpoint);
    return response.products;
  }

  /**
   * 特定の商品を取得
   * モック: '/mock/products/{id}'
   * 実API: '/api/v1/products/{id}'
   */
  async getProduct(productId: number): Promise<Product> {
    return apiClient.get<Product>(`/mock/products/${productId}`);
  }
}

export const productService = new ProductService();
