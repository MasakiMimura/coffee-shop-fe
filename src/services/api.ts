import { mockApi } from '../mocks/mockApi';

// API Base Configuration
// 空文字列にすることで、プロキシ経由での相対パスリクエストになる
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_KEY = import.meta.env.VITE_API_KEY || 'shop-system-key';

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}

export class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = API_BASE_URL, apiKey: string = API_KEY) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // /mock/* のリクエストはモックAPIを使用
    if (endpoint.startsWith('/mock/')) {
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

    // /mock/products -> getProducts
    if (endpoint.startsWith('/mock/products')) {
      if (method === 'GET') {
        const match = endpoint.match(/\/mock\/products\/(\d+)/);
        if (match) {
          const productId = parseInt(match[1]);
          return await mockApi.getProduct(productId) as T;
        }
        const url = new URL(endpoint, 'http://localhost');
        const categoryId = url.searchParams.get('categoryId');
        return await mockApi.getProducts(categoryId ? parseInt(categoryId) : undefined) as T;
      }
    }

    // /mock/users/members/:cardNo -> getMember
    if (endpoint.startsWith('/mock/users/') && method === 'GET') {
      const cardNo = endpoint.split('/').pop() || '';
      return await mockApi.getMember(cardNo) as T;
    }

    // /mock/stocks/check -> checkAvailability
    if (endpoint === '/mock/stocks/check' && method === 'POST') {
      return await mockApi.checkAvailability(body) as T;
    }

    // /mock/stocks/consume -> consumeStock
    if (endpoint === '/mock/stocks/consume' && method === 'POST') {
      return await mockApi.consumeStock(body) as T;
    }

    throw new Error(`Mock API not implemented: ${method} ${endpoint}`);
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
