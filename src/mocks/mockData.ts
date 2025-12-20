import type { Category, Product, Member } from '../types';

// モックカテゴリデータ
export const mockCategories: Category[] = [
  { categoryId: 1, categoryName: 'ドリンク' },
  { categoryId: 2, categoryName: 'フード' },
  { categoryId: 3, categoryName: 'デザート' },
];

// モック商品データ
export const mockProducts: Product[] = [
  // ドリンク
  {
    productId: 1,
    productName: 'ホットコーヒー(M)',
    price: 300,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 1,
    categoryName: 'ドリンク',
  },
  {
    productId: 2,
    productName: 'ホットコーヒー(L)',
    price: 500,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 1,
    categoryName: 'ドリンク',
  },
  {
    productId: 3,
    productName: 'カフェラテ(M)',
    price: 500,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 1,
    categoryName: 'ドリンク',
  },
  {
    productId: 4,
    productName: 'カフェラテ(L)',
    price: 700,
    isCampaign: true,
    campaignDiscountPercent: 14, // 700円 → 600円
    categoryId: 1,
    categoryName: 'ドリンク',
  },
  {
    productId: 5,
    productName: 'アイスコーヒー(M)',
    price: 350,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 1,
    categoryName: 'ドリンク',
  },
  {
    productId: 6,
    productName: 'アイスコーヒー(L)',
    price: 550,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 1,
    categoryName: 'ドリンク',
  },
  // フード
  {
    productId: 7,
    productName: 'サンドイッチ',
    price: 450,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 2,
    categoryName: 'フード',
  },
  {
    productId: 8,
    productName: 'ベーグル',
    price: 350,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 2,
    categoryName: 'フード',
  },
  {
    productId: 9,
    productName: 'クロワッサン',
    price: 300,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 2,
    categoryName: 'フード',
  },
  // デザート
  {
    productId: 10,
    productName: 'チーズケーキ',
    price: 500,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 3,
    categoryName: 'デザート',
  },
  {
    productId: 11,
    productName: 'チョコレートケーキ',
    price: 550,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 3,
    categoryName: 'デザート',
  },
  {
    productId: 12,
    productName: 'アップルパイ',
    price: 450,
    isCampaign: false,
    campaignDiscountPercent: 0,
    categoryId: 3,
    categoryName: 'デザート',
  },
];

// モック会員データ
export const mockMembers: Member[] = [
  {
    memberId: 'M001',
    memberCardNo: '1234567890',
    firstName: '太郎',
    lastName: '山田',
    pointBalance: 1500,
  },
  {
    memberId: 'M002',
    memberCardNo: '0987654321',
    firstName: '花子',
    lastName: '佐藤',
    pointBalance: 2300,
  },
  {
    memberId: 'M003',
    memberCardNo: '1111111111',
    firstName: '次郎',
    lastName: '鈴木',
    pointBalance: 500,
  },
];

// カテゴリ別商品を取得
export function getProductsByCategory(categoryId?: number): Product[] {
  if (!categoryId) {
    return mockProducts;
  }
  return mockProducts.filter((p) => p.categoryId === categoryId);
}

// 会員カード番号で会員を検索
export function findMemberByCardNo(cardNo: string): Member | undefined {
  return mockMembers.find((m) => m.memberCardNo === cardNo);
}
