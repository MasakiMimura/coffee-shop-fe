import { apiClient } from './api';
import type { Category, Product } from '../types';

export interface ProductsWithCategoriesResponse {
  products: Product[];
  categories: Category[];
}

export class ProductService {
  /**
   * 商品一覧とカテゴリ一覧を取得
   * GET /api/v1/products または /api/v1/products?categoryId={id}
   */
  async getProductsWithCategories(categoryId?: number): Promise<ProductsWithCategoriesResponse> {
    const endpoint = categoryId
      ? `/api/v1/products?categoryId=${categoryId}`
      : '/api/v1/products';
    return apiClient.get<ProductsWithCategoriesResponse>(endpoint);
  }

  /**
   * カテゴリ一覧を取得（商品も一緒に取得して、カテゴリのみ返す）
   */
  async getCategories(): Promise<Category[]> {
    const response = await this.getProductsWithCategories();
    return response.categories;
  }

  /**
   * 商品一覧を取得（カテゴリ指定可能）
   */
  async getProducts(categoryId?: number): Promise<Product[]> {
    const response = await this.getProductsWithCategories(categoryId);
    return response.products;
  }
}

export const productService = new ProductService();
