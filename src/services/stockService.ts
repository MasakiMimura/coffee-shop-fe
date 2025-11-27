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
   */
  async checkAvailability(data: StockAvailabilityRequest): Promise<StockAvailabilityResponse> {
    return apiClient.post<StockAvailabilityResponse>('/api/v1/stocks/availability-check', data);
  }

  /**
   * 在庫を消費
   */
  async consumeStock(data: StockConsumptionRequest): Promise<StockConsumptionResponse> {
    return apiClient.post<StockConsumptionResponse>('/api/v1/stocks/consumption', data);
  }
}

export const stockService = new StockService();
