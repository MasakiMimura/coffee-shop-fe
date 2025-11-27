# コード生成タスク: Task FE-001 フロントエンドプロジェクト構築

## 1. 概要

- **ゴール:** Coffee Shop レジシステムのフロントエンド（React + TypeScript + Vite）プロジェクトを構築する
- **対象リポジトリ:** `coffee_shop_fe`
- **技術スタック:** React 18, TypeScript 5, Vite 5

## 2. 実装の指針

このタスクは、Coffee Shop レジシステムのフロントエンドプロジェクトの初期セットアップを行います。

**主な実施内容:**
1. Viteを使用したReact + TypeScriptプロジェクトの初期化
2. プロジェクトディレクトリ構造の作成
3. 必要な依存関係のインストール
4. TypeScript設定の調整
5. 基本的な型定義ファイルの作成

**プロジェクト構造:**
```
coffee_shop_fe/
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

---

## 3. 関連コンテキスト

### 3.1. プロジェクト要件

このフロントエンドプロジェクトは、以下のPBI（Product Backlog Item）の実装に使用されます：
- **OM-001**: レジモード起動機能（3パーツ構成版）
- **OM-002 〜 OM-010**: 注文管理機能

### 3.2. フロントエンドアーキテクチャ

フロントエンド設計の詳細は `context/frontend-architecture-v3.md` を参照してください。

**主要な設計方針:**
- **シンプル設計**: 深い階層構造を避け、実装しやすい構造
- **3列レイアウト**: サイドメニュー（左）、商品エリア（中央）、注文エリア（右）
- **状態管理**: React Hooks（useState, useCallback）を使用したシンプルな状態管理
- **API統合**: Product BE、Order BE、User BE との連携

### 3.3. 必要な依存関係

**コア依存関係:**
- `react`: ^18.3.0
- `react-dom`: ^18.3.0
- `typescript`: ^5.5.0
- `vite`: ^5.4.0

**開発依存関係:**
- `@vitejs/plugin-react`: ^4.3.0
- `@types/react`: ^18.3.0
- `@types/react-dom`: ^18.3.0

**テスト依存関係:**
- `@testing-library/react`: ^16.0.0
- `@testing-library/jest-dom`: ^6.5.0
- `@testing-library/user-event`: ^14.5.0
- `vitest`: ^2.0.0
- `playwright`: ^1.47.0

**ユーティリティ:**
- `@types/node`: ^22.0.0

### 3.4. TypeScript設定

`tsconfig.json` の推奨設定:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### 3.5. Vite設定

`vite.config.ts` の推奨設定:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

---

## 4. 最終コード生成プロンプト

以下のプロンプトをコピーし、コード生成AIに投入してください。

```
あなたは、React、TypeScript、Viteに精通したシニアフロントエンドエンジニアです。

**ゴール:**
Coffee Shop レジシステムのフロントエンド（React + TypeScript + Vite）プロジェクトを構築してください。

**要件:**
1. **プロジェクト初期化:**
   - Viteを使用してReact + TypeScriptプロジェクトを初期化
   - コマンド: `npm create vite@latest coffee_shop_fe -- --template react-ts`

2. **ディレクトリ構造作成:**
   以下のディレクトリ構造を作成してください：
   ```
   src/
   ├── components/
   │   ├── Layout/
   │   ├── Menu/
   │   ├── Products/
   │   └── Order/
   ├── hooks/
   ├── api/
   ├── types/
   └── utils/
   tests/
   └── e2e/
   ```

3. **依存関係インストール:**
   ```bash
   npm install
   npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest playwright
   ```

4. **基本型定義ファイル作成:**
   `src/types/index.ts` に以下の基本型定義を作成してください：
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
   ```

5. **環境変数設定:**
   `.env.example` ファイルを作成してください：
   ```
   VITE_API_BASE_URL=http://localhost:5000
   VITE_API_KEY=demo-api-key
   ```

6. **README.md作成:**
   プロジェクトのセットアップ手順、開発サーバーの起動方法、テスト実行方法を記載したREADME.mdを作成してください。

**参照ファイル（タスクディレクトリ内）:**
- コンテキスト情報: `context/` ディレクトリ
- 汎用パターン: `patterns/` ディレクトリ（必須）

**制約事項:**
- 既存のコードは一切存在しないため、新規プロジェクトとして作成してください
- Viteの最新安定版を使用してください
- TypeScriptの型定義は厳密に（`strict: true`）設定してください
- CSSフレームワークはこの段階では導入せず、プレーンCSSで進めてください

**成果物:**
1. 初期化されたReact + TypeScriptプロジェクト
2. 上記のディレクトリ構造
3. 基本的な型定義ファイル
4. package.json（必要な依存関係を含む）
5. tsconfig.json、vite.config.ts
6. README.md

**次のステップ:**
このプロジェクト構築完了後、以下のタスクで個別のコンポーネントを実装します：
- Task OM-001-P1-FE: SideMenuコンポーネント実装
- Task OM-001-P2-FE: CategoryTabs & ProductGridコンポーネント実装
- Task OM-001-P3-FE: OrderPanelコンポーネント実装
```

---

## 5. 検証手順

プロジェクト構築完了後、以下のコマンドで動作確認してください：

```bash
# 依存関係がインストールされていることを確認
npm list

# TypeScriptのコンパイルエラーがないことを確認
npx tsc --noEmit

# 開発サーバーが起動することを確認
npm run dev

# ブラウザで http://localhost:3000 にアクセスし、デフォルトのVite + Reactページが表示されることを確認
```

---

## 6. トラブルシューティング

### 問題: Viteプロジェクトの初期化が失敗する
**解決策:**
- Node.jsのバージョンを確認してください（推奨: 18.x以上）
- npmのキャッシュをクリアしてください: `npm cache clean --force`

### 問題: TypeScriptのコンパイルエラーが発生する
**解決策:**
- `tsconfig.json` の設定を確認してください
- `node_modules` と `package-lock.json` を削除して再インストール: `rm -rf node_modules package-lock.json && npm install`

### 問題: 開発サーバーが起動しない
**解決策:**
- ポート3000が既に使用されていないか確認: `lsof -i :3000`
- `vite.config.ts` でポート番号を変更してください

---

## 7. 参考資料

- **Vite公式ドキュメント**: https://vitejs.dev/
- **React公式ドキュメント**: https://react.dev/
- **TypeScript公式ドキュメント**: https://www.typescriptlang.org/
- **フロントエンド設計書**: `context/frontend-architecture-v3.md`
- **API統合設計書**: `context/api-integration-design-v2.md`
