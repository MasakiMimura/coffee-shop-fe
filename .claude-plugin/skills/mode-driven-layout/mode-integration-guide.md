# モード統合ガイド

このドキュメントでは、モード駆動型レイアウトパターンを新規プロジェクトまたは既存プロジェクトに統合する手順を説明します。

## 目次

1. [新規プロジェクトへの適用](#新規プロジェクトへの適用)
2. [既存プロジェクトへの統合](#既存プロジェクトへの統合)
3. [段階的移行戦略](#段階的移行戦略)
4. [チェックリスト](#チェックリスト)

## 新規プロジェクトへの適用

### ステップ1: プロジェクトのセットアップ

```bash
# Vite + React + TypeScript プロジェクトの作成
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### ステップ2: ディレクトリ構造の準備

```bash
# 必要なディレクトリを作成
mkdir -p src/components/Layout
mkdir -p src/components/{FeatureSelector}
mkdir -p src/pages
mkdir -p src/config
```

### ステップ3: テンプレートファイルのコピー

以下のファイルをテンプレートからコピーし、プレースホルダーを置換：

1. `main-layout-pattern.tsx` → `src/components/Layout/MainLayout.tsx`
2. `main-layout-pattern.css` → `src/components/Layout/MainLayout.css`
3. `mode-selector-pattern.tsx` → `src/components/{FeatureSelector}/{FeatureSelector}.tsx`
4. `mode-selector-pattern.css` → `src/components/{FeatureSelector}/{FeatureSelector}.css`
5. `app-integration-pattern.tsx` → `src/App.tsx`
6. `app-integration-pattern.css` → `src/App.css`
7. `mode-config-pattern.ts` → `src/config/modes.ts` (オプション)

### ステップ4: プレースホルダーの置換

プロジェクトに応じて以下のプレースホルダーを置換：

```typescript
// 必須の置換
{Mode} → あなたのモード型（例: 'dashboard' | 'settings' | 'reports'）
{DefaultMode} → デフォルトモード（例: 'dashboard'）
{SidebarTitle} → サイドバーのタイトル（例: 'メニュー'）
{FeatureSelector} → モード選択コンポーネント名（例: 'MenuSelector'）
{feature-selector} → CSSクラス名（例: 'menu-selector'）

// モード設定
{ModeTypes} → モード型の定義
{ModeConfigList} → モード設定の配列
```

### ステップ5: 最初のModeContentの実装

```bash
mkdir -p src/pages/{ModeName}
```

テンプレートから `mode-content-pattern.tsx` をコピーし、プレースホルダーを置換。

### ステップ6: 動作確認

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開き、モード選択が機能することを確認。

## 既存プロジェクトへの統合

### シナリオ1: 単一画面アプリからの移行

**現状:**
```typescript
// App.tsx（既存）
function App() {
  return (
    <div className="app">
      <Dashboard />
    </div>
  );
}
```

**移行手順:**

#### ステップ1: 既存コンポーネントをModeContentに変換

```bash
# 既存のDashboardをpagesディレクトリに移動
mkdir -p src/pages/Dashboard
mv src/Dashboard.tsx src/pages/Dashboard/DashboardContent.tsx
```

#### ステップ2: MainLayoutとModeSelectorの追加

テンプレートからコピーし、プレースホルダーを置換。

#### ステップ3: App.tsxの更新

```typescript
// App.tsx（更新後）
import { MainLayout } from './components/Layout/MainLayout';
import { DashboardContent } from './pages/Dashboard/DashboardContent';

function App() {
  return (
    <div className="app">
      <MainLayout>
        {(mode) => {
          switch (mode) {
            case 'dashboard':
              return <DashboardContent />;
            default:
              return <div>未実装</div>;
          }
        }}
      </MainLayout>
    </div>
  );
}
```

#### ステップ4: 段階的に新モードを追加

各新機能を新しいModeContentとして実装。

### シナリオ2: タブ切り替えUIからの移行

**現状:**
```typescript
function App() {
  const [tab, setTab] = useState('orders');

  return (
    <div className="app">
      <TabNavigation activeTab={tab} onTabChange={setTab} />
      {tab === 'orders' && <OrdersView />}
      {tab === 'products' && <ProductsView />}
      {tab === 'customers' && <CustomersView />}
    </div>
  );
}
```

**移行手順:**

#### ステップ1: タブをモードにマッピング

```typescript
// タブID → モードID のマッピング
'orders' → 'orders'
'products' → 'products'
'customers' → 'customers'
```

#### ステップ2: 各ViewをModeContentに変換

```bash
mkdir -p src/pages/Orders
mkdir -p src/pages/Products
mkdir -p src/pages/Customers

# ファイルをリネーム・移動
mv src/OrdersView.tsx src/pages/Orders/OrdersContent.tsx
mv src/ProductsView.tsx src/pages/Products/ProductsContent.tsx
mv src/CustomersView.tsx src/pages/Customers/CustomersContent.tsx
```

#### ステップ3: TabNavigationをModeSelectorに置き換え

ModeSelectorのボタンがタブの役割を果たします。

#### ステップ4: App.tsxの更新

```typescript
import { MainLayout } from './components/Layout/MainLayout';
import { OrdersContent } from './pages/Orders/OrdersContent';
import { ProductsContent } from './pages/Products/ProductsContent';
import { CustomersContent } from './pages/Customers/CustomersContent';

function App() {
  return (
    <div className="app">
      <MainLayout>
        {(mode) => {
          switch (mode) {
            case 'orders':
              return <OrdersContent />;
            case 'products':
              return <ProductsContent />;
            case 'customers':
              return <CustomersContent />;
            default:
              return <div>未実装</div>;
          }
        }}
      </MainLayout>
    </div>
  );
}
```

## 段階的移行戦略

既存の大規模アプリケーションを一度に移行するのはリスクが高いため、段階的に移行することを推奨します。

### フェーズ1: 基盤の構築（1-2週間）

**目標:** レイアウトの基盤を整備

- [ ] MainLayoutコンポーネントの実装
- [ ] ModeSelectorコンポーネントの実装
- [ ] モード型定義の作成
- [ ] App.tsxの更新

**成果物:**
- 既存機能が1つのモードとして動作する状態

### フェーズ2: 既存機能の移行（2-4週間）

**目標:** 既存の各機能をModeContentに変換

- [ ] 既存機能1 → ModeContent化
- [ ] 既存機能2 → ModeContent化
- [ ] 既存機能3 → ModeContent化

**成果物:**
- すべての既存機能がモードとして動作

### フェーズ3: 新機能の追加（継続的）

**目標:** 新機能を新しいモードとして追加

- [ ] 新モード1の実装
- [ ] 新モード2の実装

**成果物:**
- 新機能が独立したモードとして追加される

## チェックリスト

### 実装前チェックリスト

プロジェクトでモード駆動型レイアウトパターンを採用する前に確認：

- [ ] 複数の独立した機能を持つアプリケーションか？
- [ ] 各機能が独自のUIとビジネスロジックを持つか？
- [ ] モード切り替えが頻繁に発生するか？
- [ ] 並行開発を行う予定があるか？
- [ ] 将来的に機能が増える可能性があるか？

**3つ以上該当する場合、このパターンが適しています。**

### 実装後チェックリスト

実装完了後に確認：

#### 構造チェック

- [ ] MainLayoutコンポーネントが実装されている
- [ ] ModeSelectorコンポーネントが実装されている
- [ ] 各モードが独立したModeContentコンポーネントとして実装されている
- [ ] App.tsxでswitch文によるモードルーティングが実装されている
- [ ] ディレクトリ構造が整理されている（`pages/{ModeName}/`）

#### 型安全性チェック

- [ ] Mode型が定義されている
- [ ] すべてのプレースホルダーが置換されている
- [ ] TypeScriptのビルドエラーがない
- [ ] switch文にdefaultケースがある

#### 機能チェック

- [ ] モード選択ボタンが正しく表示される
- [ ] モード選択時にコンテンツが切り替わる
- [ ] アクティブなモードが視覚的に識別できる
- [ ] 無効なモードがdisabled表示される
- [ ] 未実装モードでプレースホルダーが表示される

#### パフォーマンスチェック

- [ ] モード切り替えがスムーズ（遅延がない）
- [ ] 不要な再レンダリングが発生していない
- [ ] バンドルサイズが適切（必要に応じてCode Splitting）

#### ユーザビリティチェック

- [ ] モード選択UIが直感的
- [ ] キーボードナビゲーションが機能する
- [ ] フォーカス状態が適切
- [ ] レスポンシブ対応（モバイル表示の確認）

#### ドキュメントチェック

- [ ] READMEにモード一覧が記載されている
- [ ] 新モード追加手順が文書化されている
- [ ] プレースホルダー置換マッピングが記載されている

## トラブルシューティング

### 移行時の一般的な問題

#### 問題1: 既存の状態管理との競合

**症状:** グローバルステートとモードローカルステートが競合

**解決策:**
1. Context APIで共有する状態を明確に定義
2. モードローカルな状態はModeContent内で管理
3. 必要に応じてモード切り替え時に状態をクリア

#### 問題2: ルーティングライブラリとの統合

**症状:** React RouterのURLとモードが同期しない

**解決策:**
```typescript
import { useLocation, useNavigate } from 'react-router-dom';

function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // URLパスからモードを決定
  const modeFromUrl = location.pathname.replace('/', '') as Mode || 'default-mode';

  const handleModeChange = (mode: Mode) => {
    navigate(`/${mode}`);
  };

  return (
    // ...
    <ModeSelector selected={modeFromUrl} onSelect={handleModeChange} />
    // ...
  );
}
```

#### 問題3: 既存のCSSとの競合

**症状:** MainLayoutのスタイルが既存CSSと競合

**解決策:**
1. CSS Modules を使用
2. クラス名にプレフィックスを付ける（例: `ml-` for MainLayout）
3. CSS specificity を適切に管理

## ベストプラクティス

### 移行時のベストプラクティス

1. **小さく始める:** 最初は1-2モードのみで開始
2. **段階的に移行:** 一度にすべてを変更しない
3. **テストを維持:** 移行中もテストを継続
4. **ドキュメント化:** 移行の進捗と決定事項を記録
5. **レビューを実施:** チームメンバーと設計をレビュー

### 運用時のベストプラクティス

1. **モード設定を集約:** `config/modes.ts` で一元管理
2. **型安全性を維持:** Mode型を厳密に定義
3. **コード分割を検討:** モード数が増えたら動的インポート
4. **パフォーマンス監視:** バンドルサイズを定期的に確認
5. **ユーザーフィードバック:** モード切り替えの使いやすさを継続的に改善

## まとめ

モード駆動型レイアウトパターンの統合は、以下の順序で進めることを推奨します：

1. ✅ プロジェクトの適合性を確認（チェックリスト使用）
2. ✅ 段階的移行計画を立てる
3. ✅ 基盤（MainLayout, ModeSelector）を実装
4. ✅ 既存機能を段階的に移行
5. ✅ 新機能を新モードとして追加
6. ✅ パフォーマンスとユーザビリティを継続的に改善

このガイドに従うことで、スムーズかつ安全に移行を完了できます。
