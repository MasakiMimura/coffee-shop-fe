import { apiClient } from './api';

export interface PointRedemptionRequest {
  memberCardNo: string;
  points: number;
  orderId: number;
  reason: string;
}

export interface PointRedemptionResponse {
  success: boolean;
  memberCardNo: string;
  pointsRedeemed: number;
  previousBalance: number;
  currentBalance: number;
  transactionId: string;
  processedAt: string;
}

export interface PointAccrualRequest {
  memberCardNo: string;
  points: number;
  orderId: number;
  reason: string;
  baseAmount: number;
}

export interface PointAccrualResponse {
  success: boolean;
  memberCardNo: string;
  pointsEarned: number;
  previousBalance: number;
  currentBalance: number;
  transactionId: string;
  processedAt: string;
}

export class PointService {
  /**
   * ポイントを減算（使用）
   */
  async redeemPoints(data: PointRedemptionRequest): Promise<PointRedemptionResponse> {
    return apiClient.post<PointRedemptionResponse>('/api/v1/points/redemption', data);
  }

  /**
   * ポイントを加算（付与）
   */
  async accruePoints(data: PointAccrualRequest): Promise<PointAccrualResponse> {
    return apiClient.post<PointAccrualResponse>('/api/v1/points/accrual', data);
  }
}

export const pointService = new PointService();
