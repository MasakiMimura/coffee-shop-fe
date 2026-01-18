# Coffee Shop レジシステム - フロントエンド

Coffee Shop レジシステムのフロントエンドアプリケーションです。React + TypeScript + Viteを使用して構築されています。

## 技術スタック

- **React** 19.2.0 - UIライブラリ
- **TypeScript** 5.9.x - 型安全性
- **Vite** 7.2.x - ビルドツール
- **Vitest** - ユニットテスト
- **Playwright** - E2Eテスト
- **Testing Library** - Reactコンポーネントテスト

## プロジェクト構造

```
coffee-shop-fe/
├── src/
│   ├── components/          # 再利用可能なUIコンポーネント
│   │   ├── Dialog/          # ダイアログ
│   │   ├── Layout/          # レイアウトコンポーネント
│   │   │   └── MainLayout   # メインレイアウト（左: モード選択、右: コンテンツ）
│   │   ├── ModeSelector/    # モード選択
│   │   ├── Order/           # 注文パネル
│   │   └── Product/         # 商品表示
│   ├── pages/               # 各モードのページコンポーネント
│   │   └── RegisterMode/    # レジモード
│   │       └── RegisterModeContent  # レジモードのコンテンツ（商品選択 + 注文）
│   ├── services/            # API呼び出し
│   │   ├── api.ts           # APIクライアント（モックインターセプト機能付き）
│   │   ├── productService.ts
│   │   ├── stockService.ts
│   │   ├── userService.ts
│   │   ├── orderService.ts
│   │   └── pointService.ts
│   ├── mocks/               # モックデータ
│   │   ├── mockData.ts      # テストデータ
│   │   └── mockApi.ts       # モックAPIハンドラー
│   ├── types/               # 型定義
│   └── test/                # テストセットアップ
├── tests/                   # E2Eテスト
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## セットアップ

### 前提条件

- Node.js 18.x以上
- npm 9.x以上

### インストール手順

1. リポジトリをクローン:
   ```bash
   git clone <repository-url>
   cd coffee-shop-fe
   ```

2. 依存関係をインストール:
   ```bash
   npm install
   ```

3. 環境変数を設定:
   ```bash
   cp .env.example .env
   ```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

### ビルド

```bash
npm run build
```

ビルドされたファイルは`dist/`ディレクトリに出力されます。

### プレビュー

```bash
npm run preview
```

### リント

```bash
npm run lint
```

## テスト

### ユニットテスト

```bash
npm run test        # テストを実行
npm run test:ui     # UIモードでテストを実行
```

### E2Eテスト

```bash
npm run test:e2e    # Playwrightでテストを実行
```

## モックAPI vs 実API の切り替え

このアプリケーションは、URLを書き換えるだけでモックAPIと実APIを切り替えられます。

### 現在の設定（モックAPI使用中）

各サービスファイルで `/mock/*` のエンドポイントを使用:

- [src/services/productService.ts](src/services/productService.ts)
  - `/mock/categories` - カテゴリ一覧
  - `/mock/products` - 商品一覧
  - `/mock/products/{id}` - 商品詳細

- [src/services/stockService.ts](src/services/stockService.ts)
  - `/mock/stocks/check` - 在庫確認
  - `/mock/stocks/consume` - 在庫消費

- [src/services/userService.ts](src/services/userService.ts)
  - `/mock/users/{cardNo}` - 会員検索

### 実APIへの切り替え方法

各サービスファイルで `/mock/` を `/api/v1/` に置換:

```typescript
// 例: productService.ts

// モックAPI使用時
'/mock/categories'  → '/api/v1/categories'
'/mock/products'    → '/api/v1/products'

// 例: stockService.ts
'/mock/stocks/check'   → '/api/v1/stocks/availability-check'
'/mock/stocks/consume' → '/api/v1/stocks/consumption'
```

### モックデータ

#### カテゴリ
- ドリンク（ID: 1）
- フード（ID: 2）
- デザート（ID: 3）

#### 商品例
- ホットコーヒー(M): 300円
- カフェラテ(L): 700円（キャンペーン中: 600円）
- サンドイッチ: 450円
- チーズケーキ: 500円

#### 会員テストデータ

| カード番号 | 名前 | ポイント残高 |
|---|---|---|
| 1234567890 | 山田 太郎 | 1,500pt |
| 0987654321 | 佐藤 花子 | 2,300pt |
| 1111111111 | 鈴木 次郎 | 500pt |

### Viteプロキシ設定

[vite.config.ts](vite.config.ts)で以下のように設定:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000',  // 実APIサーバー
    changeOrigin: true,
  },
  '/mock': {
    target: 'http://localhost:80',    // 使用されない（内部モック）
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/mock/, '')
  }
}
```

**注意**: `/mock/*` へのリクエストは [src/services/api.ts](src/services/api.ts) で自動的にインターセプトされ、`src/mocks/mockApi.ts` のモック関数を呼び出します。外部サーバーへのリクエストは発生しません。

## 環境変数

`.env.example`を参考に以下を設定:

```bash
# API Base URL（空文字列でプロキシ経由）
VITE_API_BASE_URL=

# API Key
VITE_API_KEY=shop-system-key
```

## アーキテクチャ

### レイアウト構造

アプリケーションは2カラムのメインレイアウトで構成されています：

```
┌─────────────────────────────────────────┐
│ MainLayout                              │
├──────────┬──────────────────────────────┤
│ [左列]   │ [右列（中央+右のコンテンツ）]│
│          │                              │
│ モード   │ ┌──────────────────────────┐ │
│ 選択     │ │ RegisterModeContent      │ │
│          │ ├────────────┬─────────────┤ │
│ ・レジ   │ │ 商品選択   │ 注文詳細    │ │
│ ・商品管理│ │ エリア     │ エリア      │ │
│ ・レシピ │ │            │             │ │
│ ・在庫   │ └────────────┴─────────────┘ │
│ ・材料   │                              │
└──────────┴──────────────────────────────┘
```

### コンポーネント階層

- **App.tsx**: アプリケーションのエントリーポイント
  - **MainLayout**: メインレイアウト（左: モード選択、右: コンテンツエリア）
    - **ModeSelector**: モード選択ボタン群
    - **モード別コンテンツ** (選択されたモードに応じて切り替わる)
      - **RegisterModeContent**: レジモードのコンテンツ
        - **ProductList**: 商品選択エリア
        - **OrderPanel**: 注文詳細エリア

### 新しいモードの追加方法

1. `src/pages/{NewMode}/` ディレクトリを作成
2. `{NewMode}Content.tsx` を実装
3. `src/components/ModeSelector/ModeSelector.tsx` に新しいモードタイプを追加
4. `src/App.tsx` の switch 文に新しいケースを追加

## 主要機能

### レジモード
- 2列レイアウト（商品選択エリア、注文詳細エリア）
- カテゴリ別商品表示
- カート機能
- 会員検索
- 注文管理
- 決済処理

## 開発ガイドライン

### コーディングスタイル
- TypeScriptの`strict`モードを使用
- ESLintルールに従う
- コンポーネントは関数コンポーネントで作成
- 状態管理にはReact Hooksを使用

### コンポーネント設計
- シンプルな構造を維持
- 深い階層構造を避ける
- 再利用可能なコンポーネントを作成

## トラブルシューティング

### ポート3000が使用中

`vite.config.ts`でポート番号を変更:

```typescript
export default defineConfig({
  server: {
    port: 3001  // 任意のポートに変更
  }
})
```

### TypeScriptのコンパイルエラー

```bash
rm -rf node_modules package-lock.json
npm install
```

### モックAPIが動作しない

1. ブラウザのコンソールでエラー確認
2. エンドポイントが `/mock/` で始まっているか確認
3. 開発サーバーを再起動

## 参考資料

- [Vite公式ドキュメント](https://vitejs.dev/)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Vitest公式ドキュメント](https://vitest.dev/)
- [Playwright公式ドキュメント](https://playwright.dev/)

## ライセンス

Private
