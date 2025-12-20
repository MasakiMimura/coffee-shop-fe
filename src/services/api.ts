import { mockApi } from '../mocks/mockApi';

// API Base Configuration
// 空文字列にすることで、プロキシ経由での相対パスリクエストになる
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_KEY = import.meta.env.VITE_API_KEY || 'shop-system-key';
const USE_MOCK = import.meta.env.VITE_USE_MOCK;

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}

export class ApiClient {
  private baseUrl: string;
  private apiKey: string;
  private useMock: string;

  constructor(baseUrl: string = API_BASE_URL, apiKey: string = API_KEY, useMock: string = USE_MOCK) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.useMock = useMock || 'false';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Order API以外はモックを使用する判定
    const isOrderApi = endpoint.includes('/api/v1/orders');
    const shouldUseMock = this.useMock === 'true' ||
                         (this.useMock === 'partial' && !isOrderApi);

    if (shouldUseMock) {
      return this.mockRequest<T>(endpoint, options);
    }

    // 実際のAPIリクエスト
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'UnknownError',
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        console.error('API Error Response:', errorData);
        const errorMessage = errorData.details
          ? `${errorData.message} - ${JSON.stringify(errorData.details)}`
          : errorData.message || `API request failed: ${response.status}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  private async mockRequest<T>(endpoint: string, options: RequestInit): Promise<T> {

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : undefined;

    // エンドポイントとメソッドに基づいてモックAPIを呼び出し
    try {
      // カテゴリAPI
      if (endpoint === '/api/v1/categories' && method === 'GET') {
        return await mockApi.getCategories() as T;
      }

      // 商品API
      if (endpoint.startsWith('/api/v1/products')) {
        if (method === 'GET') {
          const match = endpoint.match(/\/api\/v1\/products\/(\d+)/);
          if (match) {
            const productId = parseInt(match[1]);
            return await mockApi.getProduct(productId) as T;
          }
          const url = new URL(endpoint, 'http://localhost');
          const categoryId = url.searchParams.get('categoryId');
          return await mockApi.getProducts(categoryId ? parseInt(categoryId) : undefined) as T;
        }
      }

      // 会員API
      if (endpoint.startsWith('/api/v1/users/members/') && method === 'GET') {
        const cardNo = endpoint.split('/').pop() || '';
        return await mockApi.getMember(cardNo) as T;
      }

      // 注文API
      if (endpoint === '/api/v1/orders' && method === 'POST') {
        return await mockApi.createOrder(body?.memberCardNo || null) as T;
      }

      if (endpoint.match(/\/api\/v1\/orders\/\d+\/items/) && method === 'POST') {
        const orderId = parseInt(endpoint.split('/')[4]);
        return await mockApi.addItemToOrder(orderId, body) as T;
      }

      if (endpoint.match(/\/api\/v1\/orders\/\d+\/confirm/) && method === 'PUT') {
        const orderId = parseInt(endpoint.split('/')[4]);
        return await mockApi.confirmOrder(orderId) as T;
      }

      if (endpoint.match(/\/api\/v1\/orders\/\d+\/pay/) && method === 'PUT') {
        const orderId = parseInt(endpoint.split('/')[4]);
        return await mockApi.payOrder(orderId, body) as T;
      }

      // 在庫API
      if (endpoint === '/api/v1/stocks/check' && method === 'POST') {
        return await mockApi.checkAvailability(body) as T;
      }

      if (endpoint === '/api/v1/stocks/consume' && method === 'POST') {
        return await mockApi.consumeStock(body) as T;
      }

      // ポイントAPI
      if (endpoint === '/api/v1/points/accrue' && method === 'POST') {
        return await mockApi.accruePoints(body) as T;
      }

      throw new Error(`Mock API not implemented: ${method} ${endpoint}`);
    } catch (error) {
      console.error('Mock API error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
