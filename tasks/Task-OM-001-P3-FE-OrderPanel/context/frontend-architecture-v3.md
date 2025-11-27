# フロントエンド設計詳細：注文管理 v3

このドキュメントは、Coffee Shopプロジェクトのフロントエンド（React + TypeScript）実装における詳細設計を定義します。PBI OM-001～OM-010の実装に必要な具体的なコード構造、型定義、コンポーネント設計を提供します。

---

## プロジェクト構造（シンプル設計）

```
src/
├── components/          # レジ画面コンポーネント
│   ├── Layout/          # 3列レイアウト
│   │   └── POSLayout.tsx
│   ├── Menu/            # 左メニュー
│   │   └── SideMenu.tsx
│   ├── Products/        # 中央：商品エリア
│   │   ├── CategoryTabs.tsx
│   │   └── ProductGrid.tsx
│   └── Order/           # 右：注文エリア
│       └── OrderPanel.tsx
├── hooks/               # 状態管理
│   └── usePOS.ts
├── api/                 # API呼び出し
│   └── index.ts
├── types/               # 型定義
│   └── index.ts
└── utils/               # ユーティリティ
    └── index.ts
```

---

## 型定義（シンプル構造）

### types/index.ts
```typescript
// レジ画面で使用する基本型定義
export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Product {
  productId: number;
  productName: string;
  price: number;
  isCampaign: boolean;
  campaignDiscountPercent: number;
  categoryId: number;
  categoryName: string;
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

// レジ画面の状態
export interface POSState {
  // 商品データ
  categories: Category[];
  products: Product[];
  selectedCategoryId: number;
  
  // 注文データ
  cartItems: CartItem[];
  totalAmount: number;
  
  // 会員データ
  member: Member | null;
  
  // UI状態
  currentStep: 'PRODUCT_SELECT' | 'MEMBER_SEARCH' | 'PAYMENT' | 'COMPLETE';
  isLoading: boolean;
  error: string | null;
}
```

---

## 状態管理（シンプル設計）

### hooks/usePOS.ts
```typescript
import { useState, useCallback } from 'react';
import { POSState, Category, Product, CartItem, Member } from '../types';
import * as api from '../api';

const initialState: POSState = {
  categories: [],
  products: [],
  selectedCategoryId: 1,
  cartItems: [],
  totalAmount: 0,
  member: null,
  currentStep: 'PRODUCT_SELECT',
  isLoading: false,
  error: null
};

export function usePOS() {
  const [state, setState] = useState<POSState>(initialState);
  
  // 商品・カテゴリ読み込み
  const loadProducts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await api.getProductsWithCategories();
      setState(prev => ({
        ...prev,
        categories: data.categories,
        products: data.products,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  }, []);
  
  // カテゴリ選択
  const selectCategory = useCallback((categoryId: number) => {
    setState(prev => ({ ...prev, selectedCategoryId: categoryId }));
  }, []);
  
  // 商品をカートに追加
  const addToCart = useCallback((product: Product) => {
    setState(prev => {
      const existingItem = prev.cartItems.find(
        item => item.product.productId === product.productId
      );
      
      let newCartItems: CartItem[];
      if (existingItem) {
        newCartItems = prev.cartItems.map(item =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCartItems = [...prev.cartItems, { product, quantity: 1 }];
      }
      
      const totalAmount = calculateTotal(newCartItems);
      
      return {
        ...prev,
        cartItems: newCartItems,
        totalAmount
      };
    });
  }, []);
  
  // 数量変更
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setState(prev => {
      let newCartItems: CartItem[];
      if (quantity === 0) {
        newCartItems = prev.cartItems.filter(
          item => item.product.productId !== productId
        );
      } else {
        newCartItems = prev.cartItems.map(item =>
          item.product.productId === productId
            ? { ...item, quantity }
            : item
        );
      }
      
      const totalAmount = calculateTotal(newCartItems);
      
      return {
        ...prev,
        cartItems: newCartItems,
        totalAmount
      };
    });
  }, []);
  
  // 会員設定
  const setMember = useCallback((member: Member | null) => {
    setState(prev => ({ ...prev, member }));
  }, []);
  
  // ステップ変更
  const setCurrentStep = useCallback((step: POSState['currentStep']) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);
  
  // リセット
  const reset = useCallback(() => {
    setState(prev => ({
      ...initialState,
      categories: prev.categories,
      products: prev.products
    }));
  }, []);
  
  // フィルタされた商品取得
  const getFilteredProducts = useCallback(() => {
    return state.products.filter(
      product => product.categoryId === state.selectedCategoryId
    );
  }, [state.products, state.selectedCategoryId]);
  
  return {
    // 状態
    ...state,
    filteredProducts: getFilteredProducts(),
    
    // 関数
    loadProducts,
    selectCategory,
    addToCart,
    updateQuantity,
    setMember,
    setCurrentStep,
    reset
  };
}

// 合計金額計算
function calculateTotal(cartItems: CartItem[]): number {
  return cartItems.reduce((total, item) => {
    const price = item.product.isCampaign
      ? item.product.price * (1 - item.product.campaignDiscountPercent / 100)
      : item.product.price;
    return total + (price * item.quantity);
  }, 0);
}
```

---

## レジ画面コンポーネント設計（wireframe準拠）

### components/Layout/POSLayout.tsx
```typescript
import React from 'react';
import { SideMenu } from '../Menu/SideMenu';
import { CategoryTabs } from '../Products/CategoryTabs';
import { ProductGrid } from '../Products/ProductGrid';
import { OrderPanel } from '../Order/OrderPanel';
import { usePOS } from '../../hooks/usePOS';

export function POSLayout() {
  const posState = usePOS();
  
  return (
    <div className="pos-layout">
      {/* 左：サイドメニュー */}
      <aside className="side-menu">
        <SideMenu currentMode="レジ" />
      </aside>
      
      {/* 中央：商品エリア */}
      <main className="product-area">
        <div className="category-section">
          <CategoryTabs
            categories={posState.categories}
            selectedCategoryId={posState.selectedCategoryId}
            onCategorySelect={posState.selectCategory}
          />
        </div>
        
        <div className="product-section">
          <ProductGrid
            products={posState.filteredProducts}
            onProductClick={posState.addToCart}
          />
        </div>
      </main>
      
      {/* 右：注文エリア */}
      <aside className="order-area">
        <OrderPanel
          cartItems={posState.cartItems}
          totalAmount={posState.totalAmount}
          member={posState.member}
          onQuantityChange={posState.updateQuantity}
          onConfirm={() => posState.setCurrentStep('MEMBER_SEARCH')}
        />
      </aside>
    </div>
  );
}
```

### components/Menu/SideMenu.tsx
```typescript
import React from 'react';

interface SideMenuProps {
  currentMode: string;
}

export function SideMenu({ currentMode }: SideMenuProps) {
  const menuItems = [
    'レジ',
    '商品管理',
    'レシピ管理',
    '在庫管理',
    '材料管理'
  ];
  
  return (
    <nav className="side-menu-nav">
      <div className="mode-title">モード選択</div>
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li
            key={item}
            className={`menu-item ${currentMode === item ? 'active' : ''}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### components/Products/CategoryTabs.tsx
```typescript
import React from 'react';
import { Category } from '../../types';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: number;
  onCategorySelect: (categoryId: number) => void;
}

export function CategoryTabs({ 
  categories, 
  selectedCategoryId, 
  onCategorySelect 
}: CategoryTabsProps) {
  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category.categoryId}
          className={`category-tab ${
            selectedCategoryId === category.categoryId ? 'active' : ''
          }`}
          onClick={() => onCategorySelect(category.categoryId)}
        >
          {category.categoryName}
        </button>
      ))}
    </div>
  );
}
```

### components/Products/ProductGrid.tsx
```typescript
import React from 'react';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <div
          key={product.productId}
          className="product-card"
          onClick={() => onProductClick(product)}
        >
          <div className="product-icon">☕</div>
          <div className="product-name">{product.productName}</div>
          <div className="product-price">¥{product.price}</div>
        </div>
      ))}
    </div>
  );
}
```

### components/Order/OrderPanel.tsx
```typescript
import React from 'react';
import { CartItem, Member } from '../../types';

interface OrderPanelProps {
  cartItems: CartItem[];
  totalAmount: number;
  member: Member | null;
  onQuantityChange: (productId: number, quantity: number) => void;
  onConfirm: () => void;
}

export function OrderPanel({
  cartItems,
  totalAmount,
  member,
  onQuantityChange,
  onConfirm
}: OrderPanelProps) {
  return (
    <div className="order-panel">
      <div className="order-header">注文</div>
      
      {/* ポイントカード表示 */}
      <div className="point-card-section">
        <input 
          type="text" 
          placeholder="ポイントカード" 
          className="point-card-input"
        />
        <button className="ok-button">OK</button>
      </div>
      
      {/* 会員情報表示 */}
      {member && (
        <div className="member-info">
          {member.lastName} {member.firstName}様 残高 {member.pointBalance}
        </div>
      )}
      
      {/* 注文アイテム */}
      <div className="order-items">
        {cartItems.map((item) => (
          <div key={item.product.productId} className="order-item">
            <span className="item-name">{item.product.productName}</span>
            <div className="quantity-controls">
              <button 
                onClick={() => 
                  onQuantityChange(item.product.productId, item.quantity - 1)
                }
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button 
                onClick={() => 
                  onQuantityChange(item.product.productId, item.quantity + 1)
                }
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 合計 */}
      <div className="order-total">
        <div className="total-label">合計</div>
        <div className="total-amount">¥{totalAmount}</div>
      </div>
      
      {/* 確定ボタン */}
      <button 
        className="confirm-button"
        onClick={onConfirm}
        disabled={cartItems.length === 0}
      >
        確定
      </button>
    </div>
  );
}
```

---

## API統合（シンプル設計）

### api/index.ts
```typescript
// API クライアント（シンプル版）
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
const API_KEY = process.env.REACT_APP_API_KEY || 'demo-api-key';

// 基本的なfetch関数
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || result;
}

// 商品・カテゴリ取得
export async function getProductsWithCategories() {
  return await apiRequest('/api/v1/products/with-categories');
}

// 在庫チェック
export async function checkStock(items: Array<{ productId: number; quantity: number }>) {
  return await apiRequest('/api/v1/stocks/availability-check', {
    method: 'POST',
    body: JSON.stringify({ items })
  });
}

// 会員検索（カード番号）
export async function getMemberByCardNo(cardNo: string) {
  return await apiRequest(`/api/v1/users/${cardNo}`);
}

// 会員検索（名前）
export async function searchMembersByName(name: string) {
  return await apiRequest(`/api/v1/users/search?name=${encodeURIComponent(name)}`);
}

// 注文作成
export async function createOrder() {
  return await apiRequest('/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

// 注文確定
export async function confirmOrder(orderData: {
  orderId: string;
  items: Array<{ productId: number; quantity: number; unitPrice: number }>;
  totalAmount: number;
}) {
  return await apiRequest(`/api/v1/orders/${orderData.orderId}/confirm`, {
    method: 'PUT',
    body: JSON.stringify(orderData)
  });
}
```

## ユーティリティ関数

### utils/index.ts
```typescript
// 通貨フォーマット
export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

// LocalStorage操作
export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // エラーは無視
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // エラーは無視
    }
  }
};
```

## CSS設計（基本スタイル）

```css
/* レジ画面の基本レイアウト */
.pos-layout {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  height: 100vh;
  gap: 1px;
  background: #ddd;
}

.side-menu {
  background: #f5f5f5;
  padding: 20px;
}

.product-area {
  background: white;
  display: flex;
  flex-direction: column;
}

.order-area {
  background: #f9f9f9;
  padding: 20px;
}

/* カテゴリタブ */
.category-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 10px;
}

.category-tab {
  padding: 10px 20px;
  border: none;
  background: #f0f0f0;
  margin-right: 5px;
  cursor: pointer;
}

.category-tab.active {
  background: #007bff;
  color: white;
}

/* 商品グリッド */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  padding: 20px;
  overflow-y: auto;
}

.product-card {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  background: white;
  border-radius: 8px;
}

.product-card:hover {
  background: #f0f0f0;
}

/* 注文パネル */
.order-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.order-items {
  flex: 1;
  overflow-y: auto;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.confirm-button {
  width: 100%;
  padding: 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.confirm-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

---

これでwireframeに沿った**シンプルで実装しやすい**フロントエンド設計が完成しました。深い構造を避け、レジ画面の3列レイアウト（メニュー・商品・注文）に特化した実用的な設計です。