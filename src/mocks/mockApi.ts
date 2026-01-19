import type { CreateOrderResponse, AddItemRequest, ConfirmOrderResponse, PayOrderRequest, PayOrderResponse } from '../services/orderService';
import type { Category, Product } from '../types';
import { mockCategories, mockProducts, getProductsByCategory, findMemberByCardNo } from './mockData';

interface ProductsWithCategoriesResponse {
  products: Product[];
  categories: Category[];
}

// モック注文管理
let mockOrderId = 1000;
interface MockOrder {
  orderId: number;
  status: string;
  items: Array<{ productId: number; quantity: number; productName: string; productPrice: number }>;
  total: number;
  memberCardNo: string | null;
}

const mockOrders: Map<number, MockOrder> = new Map();

export const mockApi = {
  // 商品一覧とカテゴリ一覧を取得
  getProducts: async (categoryId?: number): Promise<ProductsWithCategoriesResponse> => {
    await delay(300);
    const products = getProductsByCategory(categoryId);
    return { products, categories: mockCategories };
  },

  // 商品詳細取得
  getProduct: async (productId: number) => {
    await delay(200);
    const product = mockProducts.find(p => p.productId === productId);
    if (!product) {
      throw new Error('商品が見つかりません');
    }
    return product;
  },

  // 会員情報取得
  getMember: async (cardNo: string) => {
    await delay(300);
    const member = findMemberByCardNo(cardNo);
    if (!member) {
      throw new Error('会員が見つかりません');
    }
    return member;
  },

  // 注文作成
  createOrder: async (memberCardNo: string | null): Promise<CreateOrderResponse> => {
    await delay(200);
    const orderId = mockOrderId++;
    const order: MockOrder = {
      orderId,
      status: 'IN_ORDER',
      items: [],
      total: 0,
      memberCardNo,
    };
    mockOrders.set(orderId, order);

    return {
      orderId,
      status: 'IN_ORDER',
      total: 0,
      items: [],
    };
  },

  // 注文にアイテムを追加
  addItemToOrder: async (orderId: number, item: AddItemRequest): Promise<CreateOrderResponse> => {
    await delay(200);
    const order = mockOrders.get(orderId);
    if (!order) {
      throw new Error('注文が見つかりません');
    }

    const product = mockProducts.find(p => p.productId === item.productId);
    if (!product) {
      throw new Error('商品が見つかりません');
    }

    // 既存アイテムを更新または追加
    const existingItemIndex = order.items.findIndex(i => i.productId === item.productId);
    if (existingItemIndex >= 0) {
      order.items[existingItemIndex].quantity = item.quantity;
    } else {
      order.items.push({
        productId: item.productId,
        quantity: item.quantity,
        productName: product.productName,
        productPrice: product.price,
      });
    }

    // 合計金額を計算
    order.total = order.items.reduce((sum, i) => {
      const prod = mockProducts.find(p => p.productId === i.productId);
      const price = prod?.isCampaign
        ? prod.price * (1 - prod.campaignDiscountPercent / 100)
        : (prod?.price || 0);
      return sum + price * i.quantity;
    }, 0);

    return {
      orderId: order.orderId,
      status: order.status,
      total: order.total,
      items: order.items,
    };
  },

  // 注文確定
  confirmOrder: async (orderId: number): Promise<ConfirmOrderResponse> => {
    await delay(300);
    const order = mockOrders.get(orderId);
    if (!order) {
      throw new Error('注文が見つかりません');
    }

    order.status = 'CONFIRMED';

    return {
      orderId: order.orderId,
      status: 'CONFIRMED',
      total: order.total,
      confirmed: true,
      confirmedAt: new Date().toISOString(),
    };
  },

  // 決済処理
  payOrder: async (orderId: number, paymentData: PayOrderRequest): Promise<PayOrderResponse> => {
    await delay(400);
    const order = mockOrders.get(orderId);
    if (!order) {
      throw new Error('注文が見つかりません');
    }

    order.status = 'PAID';

    // ポイント計算（簡易版）
    const pointsEarned = Math.floor(order.total * 0.1);

    return {
      orderId: order.orderId,
      status: 'PAID',
      total: order.total,
      paymentMethod: paymentData.paymentMethod,
      pointsUsed: 0,
      pointsEarned,
      memberNewBalance: undefined,
      paidAt: new Date().toISOString(),
      paid: true,
    };
  },

  // 在庫確認
  checkAvailability: async (data: { items: Array<{ productId: number; quantity: number }> }) => {
    await delay(200);
    return {
      available: true,
      items: data.items.map(item => ({
        productId: item.productId,
        available: true,
        availableQuantity: 100,
      })),
    };
  },

  // 在庫消費
  consumeStock: async (data: { orderId: number; items: Array<{ productId: number; quantity: number }> }) => {
    await delay(200);
    return {
      success: true,
      orderId: data.orderId,
      stockTransactions: [],
      consumedMaterials: [],
      processedAt: new Date().toISOString(),
    };
  },

  // ポイント付与
  accruePoints: async (data: {
    memberCardNo: string;
    points: number;
    orderId: number;
    reason: string;
    baseAmount: number;
  }) => {
    await delay(200);
    return {
      success: true,
      transactionId: `PT${Date.now()}`,
      memberCardNo: data.memberCardNo,
      pointsAdded: data.points,
      newBalance: 1500 + data.points, // 簡易版
    };
  },
};

// 遅延ヘルパー
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
