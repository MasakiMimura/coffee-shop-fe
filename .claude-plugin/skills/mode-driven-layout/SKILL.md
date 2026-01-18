---
name: mode-driven-layout
description: React + TypeScriptを使用したモード駆動型2カラムレイアウトパターンを提供。複数の機能モードを持つアプリケーションの構造設計に使用。
---

# Mode-Driven Layout Skill

## 概要

このSkillは、複数のモード（機能）を持つReactアプリケーションで使用する**モード駆動型2カラムレイアウトパターン**を提供します。

## 適用対象アプリケーション

以下のような特徴を持つアプリケーションに適しています：

- **複数の機能モードを持つ**: レジ、在庫管理、商品管理、ユーザー管理など
- **モード間で画面が大きく異なる**: 各モードで表示する内容が全く異なる
- **モード選択UIが常時表示**: 左側にモード選択メニューを常に表示
- **SPAアーキテクチャ**: シングルページアプリケーション

## レイアウト構造

```
┌─────────────────────────────────────────────────────┐
│ App                                                 │
│ ┌─────────────────────────────────────────────────┐ │
│ │ MainLayout                                      │ │
│ ├──────────┬──────────────────────────────────────┤ │
│ │ [左列]   │ [右列（コンテンツエリア）]          │ │
│ │          │                                      │ │
│ │ モード   │ ┌──────────────────────────────────┐ │ │
│ │ 選択     │ │ {Mode}Content                    │ │ │
│ │          │ │                                  │ │ │
│ │ ・モードA│ │  モード固有のコンテンツ          │ │ │
│ │ ・モードB│ │  （各モードで完全に異なる）      │ │ │
│ │ ・モードC│ │                                  │ │ │
│ │          │ │                                  │ │ │
│ │          │ └──────────────────────────────────┘ │ │
│ └──────────┴──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## コンポーネント階層

```
App.tsx
└── MainLayout
    ├── ModeSelector (左列)
    │   └── モード選択ボタン群
    └── {Mode}Content (右列、モードに応じて切り替わる)
        ├── {ModeA}Content
        ├── {ModeB}Content
        └── {ModeC}Content
```

## 提供するパターン

### 1. main-layout-pattern.tsx

メインレイアウトコンポーネントのパターン：
- 2カラムレイアウト（左: モード選択、右: コンテンツ）
- モード状態管理（useState）
- children関数パターンによる柔軟なコンテンツ切り替え
- 設定可能なサイドバータイトル

**プレースホルダー:**
- `{Mode}`: モード型定義（例: `'register' | 'product-management'`）
- `{DefaultMode}`: デフォルトモード（例: `'register'`）
- `{SidebarTitle}`: サイドバータイトル（例: `'モード選択'`）

### 2. mode-selector-pattern.tsx

モード選択コンポーネントのパターン：
- モードボタンの表示
- アクティブ状態の管理
- 未実装モードのdisabled表示
- カスタマイズ可能なモード設定

**プレースホルダー:**
- `{Mode}`: モード型定義
- `{ModeConfig}`: モード設定配列（id, label, enabled）

### 3. app-integration-pattern.tsx

App.tsxでのモード統合パターン：
- MainLayoutとModeContentの統合
- switch文によるモード別コンテンツ表示
- プレースホルダーコンテンツの表示

**プレースホルダー:**
- `{Mode}`: モード型定義
- `{ModeContent}`: 各モードのコンテンツコンポーネント

### 4. mode-content-pattern.tsx

各モードのコンテンツコンポーネントパターン：
- モード固有のビジネスロジック
- 状態管理（useState, useEffect）
- API呼び出し
- モード内のレイアウト

**プレースホルダー:**
- `{ModeName}`: モード名（例: `Register`, `ProductManagement`）
- `{ModeState}`: モード固有の状態型定義
- `{ModeLogic}`: モード固有のビジネスロジック

### 5. mode-config-pattern.ts

モード設定の管理パターン：
- モード定義の集約
- 型安全なモード設定
- モード追加時の変更箇所の最小化

**プレースホルダー:**
- `{ModeId}`: モードID（例: `'register'`, `'product-management'`）
- `{ModeLabel}`: モード表示名（例: `'レジ'`, `'商品管理'`）
- `{ModeEnabled}`: モードの有効/無効フラグ

## 設計原則

### 1. 関心の分離 (Separation of Concerns)

- **MainLayout**: レイアウトのみに責任を持つ（モード選択UIと表示領域の管理）
- **ModeSelector**: モード選択UIのみに責任を持つ
- **各ModeContent**: そのモード固有のビジネスロジックとUIに責任を持つ

### 2. 単一責任の原則 (Single Responsibility Principle)

- 各コンポーネントは1つの明確な役割のみを持つ
- モード追加時、既存コンポーネントを変更しない

### 3. 開放/閉鎖の原則 (Open/Closed Principle)

- 新しいモードの追加は、既存コードの修正を最小限に
- モード設定の追加、App.tsxのswitch文へのケース追加、新しいContentコンポーネントの作成のみ

### 4. 拡張性 (Scalability)

- モード数が増えても構造を維持
- 5モード、10モードに拡張しても破綻しない設計

## ディレクトリ構造

```
src/
├── components/
│   ├── Layout/
│   │   ├── MainLayout.tsx       # メインレイアウト
│   │   └── MainLayout.css       # レイアウトスタイル
│   └── {FeatureSelector}/       # モード選択コンポーネント
│       ├── {FeatureSelector}.tsx
│       └── {FeatureSelector}.css
│
├── pages/                        # 各モードのページコンポーネント
│   ├── {ModeA}/
│   │   ├── {ModeA}Content.tsx   # モードAのコンテンツ
│   │   └── {ModeA}Content.css
│   ├── {ModeB}/
│   │   ├── {ModeB}Content.tsx   # モードBのコンテンツ
│   │   └── {ModeB}Content.css
│   └── {ModeC}/
│       ├── {ModeC}Content.tsx   # モードCのコンテンツ
│       └── {ModeC}Content.css
│
├── config/                       # 設定ファイル（オプション）
│   └── modes.ts                  # モード設定の集約
│
└── App.tsx                       # エントリーポイント
```

## 新しいモードの追加手順

### ステップ1: モード型定義の追加

`src/components/{FeatureSelector}/{FeatureSelector}.tsx`

```typescript
export type Mode = 'mode-a' | 'mode-b' | 'mode-c' | 'new-mode';
```

### ステップ2: モード設定の追加（設定ファイル使用時）

`src/config/modes.ts`

```typescript
{
  id: 'new-mode',
  label: '新モード',
  enabled: true
}
```

### ステップ3: ModeSelectorにボタン追加

```typescript
<button
  className={`mode-button ${selected === 'new-mode' ? 'active' : ''}`}
  onClick={() => onSelect('new-mode')}
>
  新モード
</button>
```

### ステップ4: コンテンツコンポーネントの作成

```
src/pages/NewMode/
├── NewModeContent.tsx
└── NewModeContent.css
```

### ステップ5: App.tsxにケース追加

```typescript
case 'new-mode':
  return <NewModeContent />;
```

## 実装例

### CoffeeShopプロジェクトでの使用例

```typescript
// プレースホルダー置換例
{Mode} → 'register' | 'product-management' | 'recipe' | 'stock' | 'material'
{DefaultMode} → 'register'
{SidebarTitle} → 'モード選択'
{FeatureSelector} → 'ModeSelector'

// モード設定
{ id: 'register', label: 'レジ', enabled: true }
{ id: 'product-management', label: '商品管理', enabled: false }
{ id: 'recipe', label: 'レシピ管理', enabled: false }
{ id: 'stock', label: '在庫管理', enabled: false }
{ id: 'material', label: '材料管理', enabled: false }
```

### 他プロジェクトでの使用例

**図書館管理システム:**
```typescript
{Mode} → 'search' | 'lending' | 'return' | 'user-management'
{DefaultMode} → 'search'
{SidebarTitle} → '機能選択'

// モード設定
{ id: 'search', label: '蔵書検索', enabled: true }
{ id: 'lending', label: '貸出処理', enabled: true }
{ id: 'return', label: '返却処理', enabled: true }
{ id: 'user-management', label: '利用者管理', enabled: true }
```

**ECバックオフィス:**
```typescript
{Mode} → 'orders' | 'products' | 'customers' | 'analytics'
{DefaultMode} → 'orders'
{SidebarTitle} → 'メニュー'

// モード設定
{ id: 'orders', label: '注文管理', enabled: true }
{ id: 'products', label: '商品管理', enabled: true }
{ id: 'customers', label: '顧客管理', enabled: true }
{ id: 'analytics', label: '分析', enabled: true }
```

## 利点と適用効果

### スケーラビリティ
- モード数が増えても構造を維持
- 左列のモード選択UIは変更不要
- 新モード追加は右列のコンテンツ追加のみ

### 保守性
- 各モードが独立したコンポーネント
- モード間の依存がない
- 変更箇所が明確（設定追加、Content作成、App.tsxのcase追加）

### チーム開発
- モードごとに担当を分けやすい
- 並行開発が可能
- コンフリクトが起きにくい

### テスタビリティ
- 各ModeContentを独立してテスト可能
- モード切り替えロジックのテストが容易

## 注意事項

### モード間のデータ共有

モード間でデータを共有する必要がある場合は、以下のパターンを検討してください：

1. **Context API**: アプリケーション全体で共有する状態
2. **URL State**: モード切り替え時にURLパラメータで状態を保持
3. **LocalStorage**: ブラウザリロード後も状態を保持

### パフォーマンス最適化

モード数が多い場合、以下の最適化を検討してください：

1. **React.lazy**: 各ModeContentの動的インポート
2. **Code Splitting**: モードごとにバンドルを分割
3. **React.memo**: 不要な再レンダリングの防止

### URL統合（オプション）

React Routerなどと統合する場合：

```typescript
// URLパスとモードを連携
'/register' → mode='register'
'/product-management' → mode='product-management'

// MainLayoutでURLからモードを決定
const location = useLocation();
const modeFromUrl = location.pathname.replace('/', '') as Mode;
```

## 参照ルール

このSkillと合わせて、以下のルールファイルが参照されます：

- `mode-driven-layout-patterns.md`: モード駆動型レイアウトの設計パターン詳細
- `mode-integration-guide.md`: モード統合のベストプラクティス

## 関連ドキュメント

- React公式ドキュメント: https://react.dev/
- TypeScript公式ドキュメント: https://www.typescriptlang.org/
- コンポーネント設計のベストプラクティス

## テンプレート使用時のチェックリスト

- [ ] すべてのプレースホルダー（`{}`で囲まれた部分）を実際の値に置換
- [ ] モード型定義が完全
- [ ] モード設定が定義されている
- [ ] 各ModeContentコンポーネントが作成されている
- [ ] App.tsxのswitch文にすべてのモードケースが追加されている
- [ ] サイドバータイトルがプロジェクトに適している
- [ ] CSS クラス名がプロジェクトの命名規則に従っている
- [ ] TypeScript型エラーがない
- [ ] ビルドが成功する
