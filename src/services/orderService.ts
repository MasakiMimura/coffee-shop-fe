import { apiClient } from './api';
import type { CartItem } from '../types';

export interface CreateOrderRequest {
  memberCardNo: string | null;
}

export interface CreateOrderResponse {
  orderId: number;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface AddItemRequest {
  productId: number;
  quantity: number;
}

export interface ConfirmOrderResponse {
  orderId: number;
  status: string;
  total: number;
  confirmed: boolean;
  confirmedAt: string;
}

export interface PayOrderRequest {
  paymentMethod: 'POINT' | 'OTHER';
  memberCardNo?: string | null;
  pointTransactionId?: string;
  pointEarnTransactionId?: string;
}

export interface PayOrderResponse {
  orderId: number;
  status: string;
  total: number;
  paymentMethod: string;
  pointsUsed?: number;
  pointsEarned?: number;
  memberNewBalance?: number;
  paidAt: string;
  paid: boolean;
}

export class OrderService {
  /**
   * 新規注文を作成
   */
  async createOrder(memberCardNo: string | null = null): Promise<CreateOrderResponse> {
    return apiClient.post<CreateOrderResponse>('/api/v1/orders', {
      memberCardNo,
    });
  }

  /**
   * 注文にアイテムを追加
   */
  async addItemToOrder(orderId: number, item: AddItemRequest): Promise<CreateOrderResponse> {
    return apiClient.post<CreateOrderResponse>(`/api/v1/orders/${orderId}/items`, item);
  }

  /**
   * 注文を確定
   */
  async confirmOrder(orderId: number): Promise<ConfirmOrderResponse> {
    return apiClient.put<ConfirmOrderResponse>(`/api/v1/orders/${orderId}/confirm`);
  }

  /**
   * 決済処理
   */
  async payOrder(orderId: number, paymentData: PayOrderRequest): Promise<PayOrderResponse> {
    return apiClient.put<PayOrderResponse>(`/api/v1/orders/${orderId}/pay`, paymentData);
  }
}

export const orderService = new OrderService();
