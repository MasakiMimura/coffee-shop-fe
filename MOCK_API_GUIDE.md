# モックAPI統合ガイド

このドキュメントでは、Coffee Shop POSフロントエンドアプリケーションでのモックAPI統合機能について説明します。

## 概要

モックAPI機能により、バックエンドAPIサーバーなしでフロントエンド開発を進めることができます。

## 設定方法

### 環境変数

`.env.development`ファイルで以下の環境変数を設定します：

```env
# モックAPIを使用する設定（Order API以外）
VITE_USE_MOCK=partial

# API Base URL（空文字列でViteプロキシ経由）
VITE_API_BASE_URL=

# 店内システム用APIキー
VITE_API_KEY=shop-system-key
```

### モードの切り替え

#### Partial Mode（推奨・現在の設定）
`.env.development`で`VITE_USE_MOCK=partial`を設定
- **Order API**: 実サーバー（localhost:5011）を使用
- **その他のAPI**: モックを使用（Product, Category, Member, Stock, Point）

#### すべてモックAPIを使用する場合
`.env.development`で`VITE_USE_MOCK=true`を設定

#### すべて実際のAPIを使用する場合
`.env.development`で`VITE_USE_MOCK=false`を設定し、`VITE_API_BASE_URL`を設定

## モックデータ

### カテゴリ
- ドリンク（ID: 1）
- フード（ID: 2）
- デザート（ID: 3）

### 商品例
- ホットコーヒー(M): 300円
- ホットコーヒー(L): 500円
- カフェラテ(M): 500円
- **カフェラテ(L): 700円 → 600円（キャンペーン中）**
- サンドイッチ: 450円
- チーズケーキ: 500円
- その他多数

### 会員データ
以下のポイントカード番号でテストできます：

| ポイントカードNo | 名前 | ポイント残高 |
|---|---|---|
| 1234567890 | 山田 太郎 | 1,500pt |
| 0987654321 | 佐藤 花子 | 2,300pt |
| 1111111111 | 鈴木 次郎 | 500pt |

## 実装されているAPI

### 商品API
- `GET /api/v1/categories` - カテゴリ一覧取得
- `GET /api/v1/products` - 商品一覧取得
- `GET /api/v1/products?categoryId={id}` - カテゴリ別商品取得
- `GET /api/v1/products/{id}` - 商品詳細取得

### 会員API
- `GET /api/v1/users/members/{cardNo}` - 会員情報取得

### 注文API
- `POST /api/v1/orders` - 注文作成
- `POST /api/v1/orders/{orderId}/items` - 注文にアイテム追加
- `PUT /api/v1/orders/{orderId}/confirm` - 注文確定
- `PUT /api/v1/orders/{orderId}/pay` - 決済処理

### 在庫API
- `POST /api/v1/stocks/check` - 在庫確認
- `POST /api/v1/stocks/consume` - 在庫消費

### ポイントAPI
- `POST /api/v1/points/accrue` - ポイント付与

## 動作確認

1. 開発サーバーを起動
   ```bash
   npm run dev
   ```

2. ブラウザで`http://localhost:3001`を開く※その時の適切なポート

3. Order APIサーバー（localhost:5011）が起動していることを確認
   - Partial Modeでは、Order APIは実サーバーに接続されます

4. レジモードで以下の操作をテスト
   - カテゴリタブをクリックして商品一覧を切り替え
   - 商品をクリックして注文に追加
   - ポイントカード番号を入力（例: 1234567890）
   - 確定ボタンで注文完了

## トラブルシューティング

### Order APIが保存されない
- Order APIサーバー（localhost:5011）が起動しているか確認
- `.env.development`で`VITE_USE_MOCK=partial`が設定されているか確認
- ブラウザのネットワークタブで `/api/v1/orders` へのリクエストが実サーバーに送信されているか確認

### モックAPIが動作しない
- `.env.development`ファイルで`VITE_USE_MOCK`が正しく設定されているか確認
- 開発サーバーを再起動（環境変数の変更は再起動が必要）

### 商品が表示されない
- ブラウザのコンソールでエラーメッセージを確認
- モックデータが正しく読み込まれているか確認
- Partial Modeでは商品APIはモックを使用するため、サーバー起動は不要

## ファイル構成

```
src/
├── mocks/
│   ├── mockData.ts       # モックデータ定義
│   └── mockApi.ts        # モックAPIハンドラー
├── services/
│   ├── api.ts            # APIクライアント（モック対応）
│   ├── productService.ts # 商品サービス
│   ├── orderService.ts   # 注文サービス
│   └── userService.ts    # 会員サービス
└── pages/
    └── RegisterMode/     # レジモードページ
```

## 注意事項

- モックAPIはローカルストレージを使用しません（ページリロードでデータがリセット）
- レスポンス時間を実際のAPIに近づけるため、遅延を設定しています
- **Partial Mode（推奨）**: Order APIは実サーバー、その他はモックを使用
  - Order APIサーバー（localhost:5011）の起動が必要
  - 注文データはデータベースに永続化されます
- 本番環境では必ず`VITE_USE_MOCK=false`に設定してください
