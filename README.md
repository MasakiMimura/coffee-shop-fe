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
│   ├── components/          # レジ画面コンポーネント
│   │   ├── Layout/          # 3列レイアウト
│   │   ├── Menu/            # 左メニュー
│   │   ├── Products/        # 中央：商品エリア
│   │   └── Order/           # 右：注文エリア
│   ├── hooks/               # 状態管理
│   ├── api/                 # API呼び出し
│   ├── types/               # 型定義
│   └── utils/               # ユーティリティ
├── tests/                   # テストファイル
│   └── e2e/                 # E2Eテスト
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
   必要に応じて`.env`ファイルを編集してください。

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

ビルド後のアプリケーションをローカルでプレビュー:

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
# テストを実行
npm run test

# UIモードでテストを実行
npm run test:ui
```

### E2Eテスト

```bash
# Playwrightでテストを実行
npm run test:e2e
```

## 環境変数

`.env.example`を参考にして、以下の環境変数を設定してください:

- `VITE_API_BASE_URL` - バックエンドAPIのベースURL (デフォルト: http://localhost:5000)
- `VITE_API_KEY` - API認証キー

## 主要機能

### レジモード (OM-001)
- 3列レイアウト (サイドメニュー、商品エリア、注文エリア)
- カテゴリ別商品表示
- カート機能
- 注文管理

### 今後の実装予定
- 会員検索機能 (OM-002)
- 決済機能 (OM-003)
- 注文履歴管理

## 開発ガイドライン

### コーディングスタイル
- TypeScriptの`strict`モードを使用
- ESLintルールに従う
- コンポーネントは関数コンポーネントとして作成
- 状態管理にはReact Hooksを使用

### コンポーネント設計
- シンプルな構造を維持
- 深い階層構造を避ける
- 再利用可能なコンポーネントを作成

## トラブルシューティング

### ポート3000が既に使用されている

`vite.config.ts`でポート番号を変更してください:

```typescript
export default defineConfig({
  server: {
    port: 3001 // 任意のポート番号に変更
  }
})
```

### TypeScriptのコンパイルエラー

```bash
# node_modulesとpackage-lock.jsonを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 参考資料

- [Vite公式ドキュメント](https://vitejs.dev/)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Vitest公式ドキュメント](https://vitest.dev/)
- [Playwright公式ドキュメント](https://playwright.dev/)

## ライセンス

Private
