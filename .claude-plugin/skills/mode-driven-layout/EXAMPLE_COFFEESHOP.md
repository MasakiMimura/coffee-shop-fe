# 実装例: CoffeeShop レジシステム

このドキュメントでは、CoffeeShopプロジェクトでのモード駆動型レイアウトパターンの具体的な実装例を示します。

## プロジェクト概要

**プロジェクト名:** Coffee Shop レジシステム
**技術スタック:** React 19.2.0 + TypeScript + Vite
**モード数:** 5モード（うち1モードのみ実装済み）

### モード一覧

| モードID | 表示名 | 状態 | 説明 |
|---------|--------|------|------|
| `register` | レジ | ✅ 実装済み | 商品選択・会員検索・決済処理 |
| `product-management` | 商品管理 | ⏳ 未実装 | 商品マスタのCRUD操作 |
| `recipe` | レシピ管理 | ⏳ 未実装 | レシピ（商品と材料の紐付け）管理 |
| `stock` | 在庫管理 | ⏳ 未実装 | 在庫確認・補充・消費履歴 |
| `material` | 材料管理 | ⏳ 未実装 | 材料マスタのCRUD操作 |

## プレースホルダー置換マッピング

### グローバル設定

```typescript
{Mode} → 'register' | 'product-management' | 'recipe' | 'stock' | 'material'
{DefaultMode} → 'register'
{SidebarTitle} → 'モード選択'
{SidebarWidth} → 200
{FeatureSelector} → 'ModeSelector'
{feature-selector} → 'mode-selector'
```

### モード設定

```typescript
{ModeTypes} → 'register' | 'product-management'

{ModeConfigList} →
  { id: 'register', label: 'レジ', enabled: true },
  { id: 'product-management', label: '商品管理', enabled: false },
  { id: 'recipe', label: 'レシピ管理', enabled: false },
  { id: 'stock', label: '在庫管理', enabled: false },
  { id: 'material', label: '材料管理', enabled: false }
```

### レジモード（register）

```typescript
{ModeName} → 'RegisterMode'
{mode-name} → 'register-mode'
{mode-id} → 'register'

{StateFields} →
  orderId: number | null;
  cartItems: CartItem[];
  member: Member | null;

{InitialStateValues} →
  orderId: null,
  cartItems: [],
  member: null
```

## ディレクトリ構造

### 実際のファイル構成

```
coffee-shop-fe/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.tsx          # メインレイアウト
│   │   │   └── MainLayout.css
│   │   ├── ModeSelector/
│   │   │   ├── ModeSelector.tsx        # モード選択コンポーネント
│   │   │   └── ModeSelector.css
│   │   ├── Dialog/
│   │   │   └── ConfirmDialog.tsx       # 共通ダイアログ
│   │   ├── Product/
│   │   │   ├── ProductList.tsx         # 商品一覧（レジモード用）
│   │   │   └── ProductCard.tsx
│   │   └── Order/
│   │       └── OrderPanel.tsx          # 注文パネル（レジモード用）
│   │
│   ├── pages/
│   │   └── RegisterMode/
│   │       ├── RegisterModeContent.tsx # レジモードのコンテンツ
│   │       └── RegisterModeContent.css
│   │
│   ├── services/
│   │   ├── api.ts                      # APIクライアント
│   │   ├── productService.ts
│   │   ├── stockService.ts
│   │   ├── userService.ts
│   │   ├── orderService.ts
│   │   └── pointService.ts
│   │
│   ├── mocks/
│   │   ├── mockData.ts                 # モックデータ
│   │   └── mockApi.ts                  # モックAPIハンドラー
│   │
│   ├── types/
│   │   └── index.ts                    # 型定義
│   │
│   └── App.tsx                         # エントリーポイント
│
└── .claude-plugin/                     # このテンプレート
    └── skills/mode-driven-layout/
```

## 実装コード例

### 1. MainLayout.tsx

```typescript
import { useState } from 'react';
import { ModeSelector, type Mode } from '../ModeSelector/ModeSelector';
import './MainLayout.css';

interface MainLayoutProps {
  children: (mode: Mode) => React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>('register');

  return (
    <div className="main-layout">
      <aside className="main-layout__sidebar">
        <h2 className="main-layout__sidebar-title">モード選択</h2>
        <ModeSelector selected={selectedMode} onSelect={setSelectedMode} />
      </aside>
      <main className="main-layout__content">
        {children(selectedMode)}
      </main>
    </div>
  );
}
```

### 2. ModeSelector.tsx

```typescript
import './ModeSelector.css';

export type Mode = 'register' | 'product-management';

interface ModeSelectorProps {
  selected: Mode;
  onSelect: (mode: Mode) => void;
}

export function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      <button
        className={`mode-button ${selected === 'register' ? 'active' : ''}`}
        onClick={() => onSelect('register')}
      >
        レジ
      </button>
      <button
        className={`mode-button ${selected === 'product-management' ? 'active' : ''}`}
        onClick={() => onSelect('product-management')}
      >
        商品管理
      </button>
      <button className="mode-button" disabled>
        レシピ管理
      </button>
      <button className="mode-button" disabled>
        在庫管理
      </button>
      <button className="mode-button" disabled>
        材料管理
      </button>
    </div>
  );
}
```

### 3. App.tsx

```typescript
import './App.css';
import { MainLayout } from './components/Layout/MainLayout';
import { RegisterModeContent } from './pages/RegisterMode/RegisterModeContent';

function App() {
  return (
    <div className="app">
      <MainLayout>
        {(mode) => {
          switch (mode) {
            case 'register':
              return <RegisterModeContent />;
            case 'product-management':
              return (
                <div className="placeholder-content">
                  <p>商品管理機能は未実装です</p>
                </div>
              );
            default:
              return (
                <div className="placeholder-content">
                  <p>選択されたモードは未実装です</p>
                </div>
              );
          }
        }}
      </MainLayout>
    </div>
  );
}

export default App;
```

### 4. RegisterModeContent.tsx（簡略版）

```typescript
import { useState, useEffect } from 'react';
import type { CartItem, Member, Product } from '../../types';
import { ProductList } from '../../components/Product/ProductList';
import { OrderPanel } from '../../components/Order/OrderPanel';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import './RegisterModeContent.css';

export function RegisterModeContent() {
  const [orderId, setOrderId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初回ロード時に注文を作成
  useEffect(() => {
    createOrder();
  }, []);

  const createOrder = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.createOrder(null);
      setOrderId(response.orderId);
      setCartItems([]);
      setMember(null);
    } catch (err) {
      setError('注文の作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    // 商品選択ロジック
  };

  const handleMemberSearch = async (cardNo: string) => {
    // 会員検索ロジック
  };

  const handleConfirm = async () => {
    // 注文確定ロジック
  };

  return (
    <div className="register-mode-content">
      <ProductList onProductSelect={handleProductSelect} />
      <OrderPanel
        cartItems={cartItems}
        totalAmount={calculateTotal()}
        member={member}
        onQuantityChange={handleQuantityChange}
        onConfirm={handleConfirm}
        onMemberSearch={handleMemberSearch}
      />
    </div>
  );
}
```

## レイアウト構造（実際の画面）

```
┌─────────────────────────────────────────────────────┐
│ Coffee Shop レジシステム                            │
├──────────┬──────────────────────────────────────────┤
│ [左列]   │ [右列（レジモードコンテンツ）]          │
│ 200px    │                                          │
│          │ ┌────────────────┬─────────────────────┐ │
│ モード選択│ │ ProductList   │ OrderPanel          │ │
│          │ │                │                     │ │
│ ●レジ    │ │ ・カテゴリタブ│ ・カート表示        │ │
│ ○商品管理│ │ ・商品カード  │ ・会員検索          │ │
│ ○レシピ  │ │   一覧        │ ・合計金額          │ │
│ ○在庫    │ │               │ ・確定ボタン        │ │
│ ○材料    │ │               │                     │ │
│          │ └────────────────┴─────────────────────┘ │
└──────────┴──────────────────────────────────────────┘
```

## API統合

### モックAPI vs 実API の切り替え

CoffeeShopでは、URLベースでモックAPIと実APIを切り替えます：

**モックAPI使用時:**
```typescript
// productService.ts
'/mock/categories'  // → mockApi.getCategories()
'/mock/products'    // → mockApi.getProducts()
```

**実API使用時:**
```typescript
// productService.ts
'/api/v1/categories'  // → 実APIサーバー
'/api/v1/products'    // → 実APIサーバー
```

詳細は [README.md の「モックAPI vs 実API の切り替え」](../../README.md#モックapi-vs-実api-の切り替え)を参照。

## モード追加の実例

### 例: 商品管理モードの追加手順

#### ステップ1: モード型定義の追加

```typescript
// src/components/ModeSelector/ModeSelector.tsx
export type Mode = 'register' | 'product-management' | 'recipe' | 'stock' | 'material';
```

#### ステップ2: ModeSelectorのボタン有効化

```typescript
// src/components/ModeSelector/ModeSelector.tsx
<button
  className={`mode-button ${selected === 'product-management' ? 'active' : ''}`}
  onClick={() => onSelect('product-management')}
  // disabledを削除
>
  商品管理
</button>
```

#### ステップ3: コンテンツコンポーネントの作成

```
src/pages/ProductManagement/
├── ProductManagementContent.tsx
└── ProductManagementContent.css
```

```typescript
// ProductManagementContent.tsx
export function ProductManagementContent() {
  return (
    <div className="product-management-content">
      <h1>商品管理</h1>
      {/* 商品CRUD機能の実装 */}
    </div>
  );
}
```

#### ステップ4: App.tsxにケース追加

```typescript
// src/App.tsx
import { ProductManagementContent } from './pages/ProductManagement/ProductManagementContent';

case 'product-management':
  return <ProductManagementContent />;
```

## ビルドとデプロイ

### ビルドコマンド

```bash
npm run build
```

### ビルド成果物

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
```

### Code Splitting（将来的な最適化）

各ModeContentを動的インポートすることで、初期ロード時間を短縮できます：

```typescript
import { lazy, Suspense } from 'react';

const RegisterModeContent = lazy(() => import('./pages/RegisterMode/RegisterModeContent'));
const ProductManagementContent = lazy(() => import('./pages/ProductManagement/ProductManagementContent'));

<MainLayout>
  {(mode) => (
    <Suspense fallback={<LoadingSpinner />}>
      {/* 動的インポートされたコンポーネント */}
    </Suspense>
  )}
</MainLayout>
```

## パフォーマンス

### 現在の構成

- **バンドルサイズ:** 208.26 kB (gzip: 65.17 kB)
- **ビルド時間:** 約500ms
- **モード数:** 2モード（1実装済み、1未実装）

### 5モード実装時の予測

- **バンドルサイズ:** 約400-500 kB（Code Splitting使用時）
- **初期ロード:** RegisterModeContentのみ（約100 kB）
- **モード切り替え:** 他モード初回アクセス時に動的ロード

## まとめ

CoffeeShopプロジェクトでは、モード駆動型レイアウトパターンを採用することで：

✅ **スケーラビリティ:** 5モードへの拡張が容易
✅ **保守性:** 各モードが独立して開発・テスト可能
✅ **チーム開発:** モードごとに担当を分けて並行開発
✅ **ユーザビリティ:** 左列のモード選択で直感的な操作

このパターンにより、将来的な機能追加にも柔軟に対応できる設計となっています。
