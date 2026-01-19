// レジ画面で使用する基本型定義
export interface Category {
  categoryId: number;
  categoryName: string;
  displayOrder?: number;
}

export interface Product {
  productId: number;
  productName: string;
  price: number;
  isCampaign: boolean;
  campaignDiscountPercent: number;
  discountedPrice: number;
  categoryId: number;
  isActive?: boolean;
  categoryName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Member {
  memberId: string;
  memberCardNo: string;
  firstName: string;
  lastName: string;
  pointBalance: number;
}

export interface POSState {
  categories: Category[];
  products: Product[];
  selectedCategoryId: number;
  cartItems: CartItem[];
  totalAmount: number;
  member: Member | null;
  currentStep: 'PRODUCT_SELECT' | 'MEMBER_SEARCH' | 'PAYMENT' | 'COMPLETE';
  isLoading: boolean;
  error: string | null;
}
