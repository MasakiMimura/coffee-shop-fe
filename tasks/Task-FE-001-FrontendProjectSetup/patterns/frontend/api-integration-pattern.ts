import { {EntityName} } from '../types';

/**
 * {EntityName}API
 * {EntityName}管理のためのAPI統合モジュール
 * REST API呼び出しとエラーハンドリング
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const API_VERSION = 'v1';
const ENDPOINT = '{route_prefix}';

/**
 * APIエラーハンドリング
 */
class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * レスポンスエラーチェック
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new APIError(
      errorData.message || 'API request failed',
      response.status,
      errorData.detail
    );
  }
  return response.json();
}

export const {EntityName}API = {
  /**
   * 全{EntityName}を取得
   * GET /api/v1/{route_prefix}
   */
  getAll: async (): Promise<{EntityName}[]> => {
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/${ENDPOINT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return handleResponse<{EntityName}[]>(response);
  },

  /**
   * IDで{EntityName}を取得
   * GET /api/v1/{route_prefix}/{id}
   */
  getById: async (id: number): Promise<{EntityName}> => {
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/${ENDPOINT}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return handleResponse<{EntityName}>(response);
  },

  /**
   * 新規{EntityName}を作成
   * POST /api/v1/{route_prefix}
   */
  create: async (data: Omit<{EntityName}, 'id'>): Promise<{EntityName}> => {
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/${ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse<{EntityName}>(response);
  },

  /**
   * {EntityName}を更新
   * PUT /api/v1/{route_prefix}/{id}
   */
  update: async (id: number, data: Partial<{EntityName}>): Promise<{EntityName}> => {
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse<{EntityName}>(response);
  },

  /**
   * {EntityName}を削除
   * DELETE /api/v1/{route_prefix}/{id}
   */
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/${ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || 'Delete failed',
        response.status,
        errorData.detail
      );
    }
  }
};
