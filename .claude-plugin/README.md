# Implementation Templates Plugin

バックエンド（.NET Core）とフロントエンド（React+TypeScript）の実装コード例を提供するプラグインです。

## 概要

このプラグインは、CoffeeShopプロジェクトで使用する汎用的な実装パターンとテンプレートを提供します。プレースホルダーを置換するだけで、Entity、Repository、Service、Controller、フロントエンドコンポーネントを素早く実装できます。

## 対象プロジェクト

✅ **バックエンド (.NET Core 8.0)**
- Entity Framework Core を使用したデータアクセス層
- Repository パターン
- Service 層のビジネスロジック
- RESTful API Controller

✅ **フロントエンド (React + TypeScript)**
- コンポーネントベースのUI設計
- カスタムフックによる状態管理
- モード駆動型レイアウトパターン
- API統合

## ディレクトリ構造

```
.claude-plugin/
├── plugin.json                          # プラグイン情報
├── README.md                            # このファイル
└── skills/
    ├── backend-controller/              # バックエンド: Controllerパターン
    ├── backend-repository/              # バックエンド: Repositoryパターン
    ├── backend-service/                 # バックエンド: Serviceパターン
    ├── backend-architecture-layers.md   # バックエンド: アーキテクチャガイド
    ├── backend-test-patterns.md         # バックエンド: テストパターン
    ├── frontend-implementation/         # フロントエンド: 一般的な実装パターン
    └── mode-driven-layout/              # フロントエンド: モード駆動型レイアウト
        ├── SKILL.md                     # スキル概要
        ├── main-layout-pattern.tsx      # MainLayoutコンポーネント
        ├── mode-selector-pattern.tsx    # ModeSelectorコンポーネント
        ├── app-integration-pattern.tsx  # App.tsx統合
        ├── mode-content-pattern.tsx     # ModeContentコンポーネント
        ├── mode-config-pattern.ts       # モード設定管理
        ├── mode-driven-layout-patterns.md # 詳細設計ガイド
        ├── mode-integration-guide.md    # 統合ガイド
        └── EXAMPLE_COFFEESHOP.md        # 実装例
```

## バックエンドテンプレート

### Backend Controller

RESTful APIコントローラーのテンプレート。

**主なパターン:**
- CRUD操作の実装
- HTTPメソッド（GET, POST, PUT, DELETE）
- リクエスト/レスポンスのバリデーション
- エラーハンドリング

**使用方法:**
```bash
# テンプレートを参照
.claude-plugin/skills/backend-controller/
```

### Backend Repository

Entity Framework Coreを使用したRepositoryパターンのテンプレート。

**主なパターン:**
- 基本的なCRUD操作
- クエリメソッド（検索、フィルタリング）
- トランザクション管理

**使用方法:**
```bash
# テンプレートを参照
.claude-plugin/skills/backend-repository/
```

### Backend Service

ビジネスロジック層のServiceパターンのテンプレート。

**主なパターン:**
- ビジネスルールの実装
- 複数Repositoryの調整
- トランザクション境界の管理

**使用方法:**
```bash
# テンプレートを参照
.claude-plugin/skills/backend-service/
```

### アーキテクチャガイド

バックエンドの層構造とベストプラクティス。

**参照:**
```bash
.claude-plugin/skills/backend-architecture-layers.md
.claude-plugin/skills/backend-test-patterns.md
```

## フロントエンドテンプレート

### Frontend Implementation

一般的なReactコンポーネントの実装パターン。

**主なパターン:**
- 関数コンポーネント
- カスタムフック（状態管理）
- API統合
- コンポーネントテスト

**使用方法:**
```bash
# テンプレートを参照
.claude-plugin/skills/frontend-implementation/
```

詳細は [frontend-component-patterns.md](skills/frontend-implementation/frontend-component-patterns.md) を参照。

### Mode-Driven Layout

複数のモード（機能）を持つアプリケーション向けのレイアウトパターン。

**適用シナリオ:**
- ✅ 複数の独立した機能を持つ業務アプリケーション
- ✅ 各機能が独自のUIとビジネスロジックを持つ
- ✅ モード切り替えが頻繁に発生する
- ✅ 並行開発を行う予定がある

**提供するテンプレート:**
1. `main-layout-pattern.tsx` - 2カラムレイアウト
2. `mode-selector-pattern.tsx` - モード選択UI
3. `app-integration-pattern.tsx` - App.tsx統合
4. `mode-content-pattern.tsx` - モード固有のコンテンツ
5. `mode-config-pattern.ts` - モード設定管理

**クイックスタート:**

```bash
# テンプレートをコピー
cp .claude-plugin/skills/mode-driven-layout/main-layout-pattern.tsx src/components/Layout/MainLayout.tsx
cp .claude-plugin/skills/mode-driven-layout/mode-selector-pattern.tsx src/components/ModeSelector/ModeSelector.tsx
cp .claude-plugin/skills/mode-driven-layout/app-integration-pattern.tsx src/App.tsx

# プレースホルダーを置換
# {Mode} → 'register' | 'product-management'
# {DefaultMode} → 'register'
# {SidebarTitle} → 'モード選択'
```

詳細は [skills/mode-driven-layout/SKILL.md](skills/mode-driven-layout/SKILL.md) を参照。

## プレースホルダー置換

すべてのテンプレートファイルには、`{}` で囲まれたプレースホルダーが含まれています。

### バックエンド共通プレースホルダー

| プレースホルダー | 説明 | 例 |
|---------------|------|-----|
| `{EntityName}` | エンティティ名 | `Product`, `Order` |
| `{RepositoryName}` | リポジトリ名 | `ProductRepository` |
| `{ServiceName}` | サービス名 | `ProductService` |
| `{ControllerName}` | コントローラー名 | `ProductController` |

### フロントエンド共通プレースホルダー

| プレースホルダー | 説明 | 例 |
|---------------|------|-----|
| `{ComponentName}` | コンポーネント名 | `ProductList` |
| `{HookName}` | カスタムフック名 | `useProduct` |
| `{ApiServiceName}` | APIサービス名 | `ProductService` |

### モード駆動型レイアウト プレースホルダー

| プレースホルダー | 説明 | 例 |
|---------------|------|-----|
| `{Mode}` | モード型定義 | `'register' \| 'product-management'` |
| `{DefaultMode}` | デフォルトモード | `'register'` |
| `{SidebarTitle}` | サイドバータイトル | `'モード選択'` |
| `{ModeName}` | モード名 | `'RegisterMode'` |

## 実装例

### CoffeeShop レジシステム

**バックエンド:**
- Product Entity + Repository + Service + Controller
- Order Entity + Repository + Service + Controller
- User Entity + Repository + Service + Controller

**フロントエンド:**
- モード駆動型レイアウト（5モード）
  - レジモード（実装済み）
  - 商品管理（未実装）
  - レシピ管理（未実装）
  - 在庫管理（未実装）
  - 材料管理（未実装）

詳細は [skills/mode-driven-layout/EXAMPLE_COFFEESHOP.md](skills/mode-driven-layout/EXAMPLE_COFFEESHOP.md) を参照。

## 使用方法

### バックエンド実装

1. 適切なスキルディレクトリからテンプレートを参照
2. プレースホルダーを実際のエンティティ名に置換
3. ビジネスロジックを実装
4. テストを作成

### フロントエンド実装

#### 一般的なコンポーネント

1. `frontend-implementation/component-pattern.tsx` を参照
2. プレースホルダーを置換
3. UIとロジックを実装

#### モード駆動型レイアウト

1. テンプレートファイルをコピー
2. プレースホルダーを置換
3. 各ModeContentを実装
4. App.tsxに統合

詳細は各スキルの `SKILL.md` または `README.md` を参照してください。

## ドキュメント

### バックエンド

| ドキュメント | 説明 |
|------------|------|
| `backend-architecture-layers.md` | レイヤードアーキテクチャの設計原則 |
| `backend-test-patterns.md` | ユニットテスト・統合テストのパターン |

### フロントエンド

| ドキュメント | 説明 |
|------------|------|
| `frontend-implementation/frontend-component-patterns.md` | コンポーネント設計パターン |
| `frontend-implementation/frontend-test-patterns.md` | テストパターン |
| `mode-driven-layout/SKILL.md` | モード駆動型レイアウトスキル概要 |
| `mode-driven-layout/mode-driven-layout-patterns.md` | 詳細設計パターンガイド |
| `mode-driven-layout/mode-integration-guide.md` | 既存プロジェクトへの統合ガイド |

## ベストプラクティス

### バックエンド

- ✅ レイヤードアーキテクチャを維持
- ✅ Repositoryは純粋なデータアクセスのみ
- ✅ Serviceにビジネスロジックを集約
- ✅ Controllerは薄く保つ
- ✅ 適切なHTTPステータスコードを返す

### フロントエンド

- ✅ 単一責任の原則を守る
- ✅ カスタムフックで状態管理を抽出
- ✅ コンポーネントを小さく保つ
- ✅ 型安全性を確保（TypeScript）
- ✅ アクセシビリティを考慮

### モード駆動型レイアウト

- ✅ 各モードを独立させる
- ✅ モード間の依存を避ける
- ✅ モード設定を集約管理
- ✅ 型安全性を維持
- ✅ Code Splittingを検討（モード数が多い場合）

## FAQ

### Q1: バックエンドとフロントエンドのテンプレートを組み合わせて使えますか？

はい、むしろ推奨されます。例えば、Productエンティティのバックエンド実装と、商品管理モードのフロントエンド実装を組み合わせることで、フルスタック機能を素早く実装できます。

### Q2: テンプレートをカスタマイズしても良いですか？

はい。テンプレートはあくまで出発点です。プロジェクトの要件に応じて自由にカスタマイズしてください。

### Q3: 新しいテンプレートを追加できますか？

はい。プロジェクトチームで有用なパターンが見つかった場合、このプラグインに追加することを推奨します。

### Q4: 他のプロジェクトでも使用できますか？

はい。このプラグインは汎用的なパターンを提供しているため、同じ技術スタック（.NET Core + React + TypeScript）を使用する任意のプロジェクトで使用できます。

## トラブルシューティング

### バックエンド

**問題:** Entity Framework のマイグレーションエラー
- [backend-architecture-layers.md](skills/backend-architecture-layers.md) のマイグレーション手順を参照

**問題:** トランザクションの範囲が不明
- Serviceレイヤーでトランザクション境界を管理

### フロントエンド

**問題:** モード切り替え時に状態がリセットされない
- [mode-driven-layout-patterns.md](skills/mode-driven-layout/mode-driven-layout-patterns.md#トラブルシューティング) を参照

**問題:** TypeScript型エラー
- プレースホルダーがすべて置換されているか確認
- Mode型定義が最新か確認

## ライセンス

このプラグインはCoffeeShopプロジェクト固有のテンプレート集であり、プロジェクト内で自由に使用・変更できます。

## 貢献

新しいパターンやテンプレートを追加したい場合は、プロジェクトチームに連絡してください。

## 変更履歴

### v1.0.0 (2025-01-XX)

**バックエンド:**
- Controller、Repository、Serviceのテンプレート
- アーキテクチャガイド
- テストパターンガイド

**フロントエンド:**
- 一般的なコンポーネント実装パターン
- モード駆動型レイアウトパターン（9テンプレート + 4ドキュメント）

## サポート

質問や問題がある場合は、各スキルのドキュメントを参照してください。

**バックエンド:**
- `skills/backend-architecture-layers.md`
- `skills/backend-test-patterns.md`

**フロントエンド:**
- `skills/frontend-implementation/SKILL.md`
- `skills/mode-driven-layout/SKILL.md`

それでも解決しない場合は、プロジェクトチームに問い合わせてください。
