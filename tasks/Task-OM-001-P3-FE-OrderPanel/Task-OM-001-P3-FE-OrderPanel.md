# コード生成タスク: Task OM-001-P3-FE OrderPanelフロントエンド実装

## 1. 概要

- **ゴール:** レジ画面右側の注文パネルコンポーネント（OrderPanel.tsx）を実装する
- **対象ファイル:** `src/components/Order/OrderPanel.tsx`
- **リポジトリ:** `coffee_shop_fe`

## 2. 実装の指針

フロントエンドテストで定義されたコンポーネント動作・プロパティに基づいて実装してください。

**必須要素:**
- React Hook使用パターン（props、イベントハンドリング）
- TypeScript型定義（OrderPanelProps）
- 注文アイテムリストの表示
- 数量増減コントロール
- 合計金額計算処理
- 確定ボタンの制御

---

## 3. 関連コンテキスト

### 3.1. 関連ビジネスルール & 受理条件

**パーツ3: 注文（右側）- OrderPanel.tsx**

#### 実装要否判定（新規プロジェクト基準）
- **Repository**: 必要 (理由: 新規プロジェクトで注文データのデータベース操作が必要)
- **Service**: 必要 (理由: 新規プロジェクトで注文作成のビジネスロジックが必要)
- **DTO**: 不要 (理由: 注文データに秘匿フィールドなし)
- **Controller**: 必要 (理由: 新規APIエンドポイント POST /api/v1/orders の提供が必要)
- **Frontend**: 必要 (理由: 注文パネルのUIコンポーネントが必要)

#### テストコード作成タスク（実装前・TDDファースト）

**Task OM-001-P3-FET: OrderPanelフロントエンド テストコード作成**【coffee_shop_fe】
- **ファイル**: `src/components/Order/__tests__/OrderPanel.test.tsx`
- **参考**: React Testing Library、Jest使用パターン
- **TDD目的**: コンポーネントのプロパティ・動作・状態管理を先に定義
- **テスト内容**:
  - 注文アイテムリストのレンダリング
  - 数量増減ボタンの動作
  - 合計金額の計算・表示
  - 確定ボタンのクリック動作
  - 空カート時のボタン無効化
  - API呼び出し（POST /api/v1/orders）のMock検証

#### 実装タスク（テストコード後・TDD準拠）

**Task OM-001-P3-FE: OrderPanelフロントエンド実装**【coffee_shop_fe】
- **ファイル**: `src/components/Order/OrderPanel.tsx`
- **参考**: `docs/frontend-architecture-v3.md` のOrderPanel設計
- **実装指針**: フロントエンドテストで定義されたコンポーネント動作・プロパティに基づいて実装
- **必須要素**:
  - React Hook使用パターン（props、イベントハンドリング）
  - TypeScript型定義（OrderPanelProps）
  - 注文アイテムリストの表示
  - 数量増減コントロール
  - 合計金額計算処理
  - 確定ボタンの制御

### 3.2. 関連データベーススキーマ

```sql
-- Order Service DB
-- 注文テーブル
CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    member_card_no VARCHAR(20), -- nullable
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('IN_ORDER', 'CONFIRMED', 'PAID'))
);

-- 注文明細テーブル
CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES "order"(order_id),
    product_id INTEGER NOT NULL, -- Product Serviceへの参照（外部キー制約なし）
    product_name VARCHAR(255) NOT NULL, -- スナップショット保存
    product_price NUMERIC(10,2) NOT NULL, -- スナップショット保存
    product_discount_percent NUMERIC(5,2) DEFAULT 0, -- スナップショット保存
    quantity INTEGER NOT NULL
);
```

### 3.3. 関連API仕様

**POST /api/v1/orders - 注文作成**

```http
# Request - 注文作成
POST /api/v1/orders
Headers: X-API-Key: shop-system-key
Content-Type: application/json
Body: {
  "memberCardNo": null
}

# Response - 注文作成
{
  "orderId": 123,
  "status": "IN_ORDER",
  "total": 0,
  "items": []
}
```

### 3.4. 関連アーキテクチャ & 既存コード

**components/Order/OrderPanel.tsx (設計)**

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

**型定義 (types/index.ts)**

```typescript
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
```

---

## 4. 最終コード生成プロンプト

以下のプロンプトをコピーし、コード生成AIに投入してください。

```
あなたは、React + TypeScriptに精通したシニアフロントエンドエンジニアです。

**ゴール:**
`src/components/Order/OrderPanel.tsx`のコードを生成してください。

**要件:**
- 上記の「実装の指針」に厳密に従ってください。
- 添付の「関連コンテキスト」で提供されたビジネスルール、DBスキーマ、API仕様をすべて満たすように実装してください。
- 参考コードのコーディングスタイル（命名規則、コンポーネント設計パターン、プロパティ定義）を完全に踏襲してください。
- 不要なコメントは含めず、クリーンで読みやすいコードを生成してください。

**実装の重要ポイント:**
1. **コンポーネントプロパティ**: OrderPanelPropsに従ったプロパティ定義
2. **注文アイテムリスト表示**: cartItemsをmapで展開し、商品名・数量・価格を表示
3. **数量増減コントロール**: onQuantityChangeコールバックを使用した数量変更
4. **合計金額表示**: totalAmountプロパティを使用した合計金額表示
5. **確定ボタン制御**: cartItemsが空の場合はボタンを無効化
6. **会員情報表示**: memberプロパティがnullでない場合に会員情報を表示

**参照ファイル（タスクディレクトリ内）:**
- コンテキスト情報: `context/` ディレクトリ
- 汎用パターン: `patterns/` ディレクトリ（必須）
- ルール定義: `rules/` ディレクトリ

**生成するコード:**

（ここに生成されたコードを記述してください）

```

---

## 5. 参照ファイル

このタスクを実施するために必要なすべてのファイルは、このディレクトリ内にまとめられています：

### コンテキスト情報 (`context/`)
- `database-schema.sql` - データベーススキーマ定義
- `api-integration-design-v2.md` - API仕様（POST /api/v1/orders）
- `frontend-architecture-v3.md` - フロントエンド設計（OrderPanel設計）

### 汎用パターン (`patterns/frontend/`)
- `component-pattern.tsx` - Reactコンポーネントの汎用パターン
- `custom-hook-pattern.ts` - カスタムフックの汎用パターン
- `api-integration-pattern.ts` - API統合の汎用パターン

### ルール定義 (`rules/`)
- `frontend-component-patterns.md` - フロントエンドコンポーネントパターンルール

---

## 6. 実装チェックリスト

- [ ] OrderPanelPropsインターフェース定義
- [ ] 注文ヘッダー表示
- [ ] ポイントカード入力フィールド
- [ ] 会員情報表示（条件付き）
- [ ] 注文アイテムリスト表示
- [ ] 数量増減ボタン実装
- [ ] 合計金額表示
- [ ] 確定ボタン実装（無効化制御）
- [ ] TypeScript型定義の正確性
- [ ] プロパティのバリデーション
- [ ] イベントハンドラの正確性

---

**作成日**: 2025-11-14
**タスクID**: Task OM-001-P3-FE
**リポジトリ**: coffee_shop_fe
