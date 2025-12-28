import { apiClient } from './api';

export interface StockAvailabilityRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface StockAvailabilityResponse {
  available: boolean;
  details?: any[];
}

export interface StockConsumptionRequest {
  orderId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface StockConsumptionResponse {
  success: boolean;
  orderId: number;
  stockTransactions: any[];
  consumedMaterials: any[];
  processedAt: string;
}

export class StockService {
  /**
   * 在庫可用性を確認
   * モック: '/mock/stocks/check'
   * 実API: '/api/v1/stocks/availability-check'
   */
  async checkAvailability(data: StockAvailabilityRequest): Promise<StockAvailabilityResponse> {
    return apiClient.post<StockAvailabilityResponse>('/mock/stocks/check', data);
  }

  /**
   * 在庫を消費
   * モック: '/mock/stocks/consume'
   * 実API: '/api/v1/stocks/consumption'
   */
  async consumeStock(data: StockConsumptionRequest): Promise<StockConsumptionResponse> {
    return apiClient.post<StockConsumptionResponse>('/mock/stocks/consume', data);
  }
}

export const stockService = new StockService();
