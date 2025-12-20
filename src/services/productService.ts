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
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<GetCategoriesResponse>('/api/v1/categories');
    return response.categories;
  }

  /**
   * 商品一覧を取得（カテゴリ指定可能）
   */
  async getProducts(categoryId?: number): Promise<Product[]> {
    const endpoint = categoryId
      ? `/api/v1/products?categoryId=${categoryId}`
      : '/api/v1/products';
    const response = await apiClient.get<GetProductsResponse>(endpoint);
    return response.products;
  }

  /**
   * 特定の商品を取得
   */
  async getProduct(productId: number): Promise<Product> {
    return apiClient.get<Product>(`/api/v1/products/${productId}`);
  }
}

export const productService = new ProductService();
