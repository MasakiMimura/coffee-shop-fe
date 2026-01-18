# アーキテクチャドキュメント

## 概要

このドキュメントでは、Coffee Shop レジシステムフロントエンドのアーキテクチャについて説明します。

## レイアウト構造

### メインレイアウト

アプリケーションは **MainLayout** コンポーネントを使用した2カラムレイアウトで構成されています：

```
┌─────────────────────────────────────────────────────┐
│ App.tsx                                             │
│ ┌─────────────────────────────────────────────────┐ │
│ │ MainLayout                                      │ │
│ ├──────────┬──────────────────────────────────────┤ │
│ │ [左列]   │ [右列（コンテンツエリア）]          │ │
│ │          │                                      │ │
│ │ モード   │ ┌──────────────────────────────────┐ │ │
│ │ 選択     │ │ RegisterModeContent (レジモード) │ │ │
│ │          │ ├───────────────┬──────────────────┤ │ │
│ │ ・レジ   │ │ ProductList   │ OrderPanel       │ │ │
│ │ ・商品管理│ │ (商品選択)    │ (注文詳細)       │ │ │
│ │ ・レシピ │ │               │                  │ │ │
│ │ ・在庫   │ │               │                  │ │ │
│ │ ・材料   │ │               │                  │ │ │
│ │          │ └───────────────┴──────────────────┘ │ │
│ └──────────┴──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### レイアウトの利点

1. **左列の独立性**: モード選択UIは全モード共通で、変更不要
2. **右列の柔軟性**: 選択されたモードに応じて異なるコンテンツを表示
3. **スケーラビリティ**: 新しいモードを追加する際、左列は触らずに右列のコンテンツのみ追加

## コンポーネント構造

### ディレクトリ構成

```
src/
├── components/               # 再利用可能なUIコンポーネント
│   ├── Layout/
│   │   ├── MainLayout.tsx   # メインレイアウト（2カラム）
│   │   └── MainLayout.css
│   ├── ModeSelector/
│   │   ├── ModeSelector.tsx # モード選択ボタン群
│   │   └── ModeSelector.css
│   ├── Product/
│   │   └── ProductList.tsx  # 商品一覧表示
│   ├── Order/
│   │   └── OrderPanel.tsx   # 注文パネル
│   └── Dialog/
│       └── ConfirmDialog.tsx
│
├── pages/                    # 各モードのページコンポーネント
│   └── RegisterMode/
│       ├── RegisterModeContent.tsx   # レジモードの中身
│       └── RegisterModeContent.css
│
└── App.tsx                   # エントリーポイント（モード切り替えロジック）
```

### コンポーネント階層

```
App
└── MainLayout
    ├── ModeSelector (左列)
    └── モード別コンテンツ (右列、モードに応じて切り替わる)
        ├── RegisterModeContent (レジモード)
        │   ├── ProductList
        │   └── OrderPanel
        ├── ProductManagementContent (商品管理) ※未実装
        ├── RecipeManagementContent (レシピ管理) ※未実装
        ├── StockManagementContent (在庫管理) ※未実装
        └── MaterialManagementContent (材料管理) ※未実装
```

## データフロー

### モード選択のフロー

```
1. ユーザーがModeSelector内のボタンをクリック
   ↓
2. MainLayoutの状態(selectedMode)が更新される
   ↓
3. MainLayoutがchildren関数を呼び出し、新しいmodeを渡す
   ↓
4. App.tsxのswitch文で適切なコンテンツコンポーネントを選択
   ↓
5. 選択されたコンテンツが右列に表示される
```

### 実装コード（App.tsx）

```tsx
<MainLayout>
  {(mode) => {
    switch (mode) {
      case 'register':
        return <RegisterModeContent />;
      case 'product-management':
        return <ProductManagementContent />;
      default:
        return <div>未実装</div>;
    }
  }}
</MainLayout>
```

## 設計原則

### 1. 関心の分離 (Separation of Concerns)

- **MainLayout**: レイアウトのみに責任を持つ
- **ModeSelector**: モード選択UIのみに責任を持つ
- **各ModeContent**: そのモード固有のビジネスロジックとUIに責任を持つ

### 2. 単一責任の原則 (Single Responsibility Principle)

- 各コンポーネントは1つの明確な役割のみを持つ
- 例: RegisterModeContentはレジモードの機能のみを実装

### 3. 開放/閉鎖の原則 (Open/Closed Principle)

- 新しいモードの追加は、既存のコードを変更せずに実現可能
- App.tsxのswitch文にケースを追加するだけ

## 新しいモードの追加手順

### 1. モード型定義の追加

[src/components/ModeSelector/ModeSelector.tsx](src/components/ModeSelector/ModeSelector.tsx)

```tsx
export type Mode = 'register' | 'product-management' | 'new-mode';
```

### 2. ModeSelectorにボタン追加

```tsx
<button
  className={`mode-button ${selected === 'new-mode' ? 'active' : ''}`}
  onClick={() => onSelect('new-mode')}
>
  新モード
</button>
```

### 3. コンテンツコンポーネントの作成

```
src/pages/NewMode/
├── NewModeContent.tsx
└── NewModeContent.css
```

### 4. App.tsxにケース追加

```tsx
case 'new-mode':
  return <NewModeContent />;
```

## APIアーキテクチャ

### モックAPIとの統合

`src/services/api.ts` は `/mock/*` で始まるエンドポイントを自動的にインターセプトし、`src/mocks/mockApi.ts` にルーティングします。

```typescript
// /mock/products → mockApi.getProducts()
// /api/v1/products → 実際のAPIサーバー
```

詳細は [README.md](README.md) の「モックAPI vs 実API の切り替え」を参照してください。

## パフォーマンス考慮事項

### コンポーネントの再レンダリング最適化

- 各ModeContentは独立しているため、モード切り替え時のみ再マウントされる
- 同一モード内での操作は不要な再レンダリングを発生させない

### 将来的な改善案

1. **React.lazy** を使用した動的インポート
   ```tsx
   const RegisterModeContent = lazy(() => import('./pages/RegisterMode/RegisterModeContent'));
   ```

2. **React.memo** を使用した最適化
   - ProductList、OrderPanelなど頻繁に更新されるコンポーネントに適用

## まとめ

このアーキテクチャにより：

- ✅ スケーラブルなモード追加が可能
- ✅ 各モードの独立性が保たれる
- ✅ コードの保守性が向上
- ✅ テストが容易になる
- ✅ チーム開発がしやすくなる
