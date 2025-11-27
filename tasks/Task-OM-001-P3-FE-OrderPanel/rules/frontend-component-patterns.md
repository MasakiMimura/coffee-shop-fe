# フロントエンドコンポーネント設計パターン

## コンポーネント構造の原則

### 1. シンプルな構造
- 深いネストを避ける
- 1コンポーネント1責任
- Props の型定義を明確に

### 2. 状態管理
- useState/useEffectベースのカスタムフック
- 複雑な状態管理ライブラリ（Redux等）は使用しない
- API呼び出しはカスタムフックに集約

### 3. 型安全性
- TypeScriptの型定義を活用
- Props、State、API レスポンスすべてに型定義
- `any` 型の使用を避ける

### 4. コンポーネント分割
- 画面構造に沿った自然な分割
- 再利用可能なコンポーネントは `components/common/` に配置
- ドメイン固有のコンポーネントは `components/{domain}/` に配置

## ディレクトリ構造

```
src/
├── components/          # UIコンポーネント
│   ├── common/          # 共通コンポーネント
│   ├── {Domain}/        # ドメイン別コンポーネント
│   └── Layout/          # レイアウトコンポーネント
├── hooks/               # カスタムフック（状態管理）
│   └── use{Feature}.ts
├── api/                 # API呼び出し
│   └── {feature}-api.ts
├── types/               # 型定義
│   └── index.ts
└── utils/               # ユーティリティ
    └── index.ts
```

## コンポーネント命名規則

- **コンポーネント**: PascalCase（例: `OrderPanel`, `ProductList`）
- **ファイル名**: PascalCase（例: `OrderPanel.tsx`, `ProductList.tsx`）
- **カスタムフック**: useXxx（例: `useOrder`, `useProduct`）
- **API モジュール**: XxxAPI（例: `OrderAPI`, `ProductAPI`）

## Props インターフェース定義

```typescript
interface ComponentProps {
  // 必須プロパティ
  id: number;
  name: string;

  // オプショナルプロパティ
  description?: string;

  // イベントハンドラー
  onSelect?: (id: number) => void;
  onChange?: (value: string) => void;

  // 子要素
  children?: React.ReactNode;
}
```

## 状態管理パターン（カスタムフック）

```typescript
export function useFeature() {
  const [state, setState] = useState<FeatureState>(initialState);

  // API呼び出しはuseCallbackで最適化
  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const data = await API.fetchData();
      setState(prev => ({ ...prev, data, isLoading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error, isLoading: false }));
    }
  }, []);

  return { ...state, fetchData };
}
```

## コンポーネント実装パターン

```typescript
export const Component: React.FC<ComponentProps> = ({ id, name, onSelect }) => {
  const { data, isLoading, error, fetchData } = useFeature();

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Main content
  return (
    <div className="component">
      <h2>{name}</h2>
      {/* Component content */}
    </div>
  );
};
```

## API統合パターン

```typescript
export const FeatureAPI = {
  getAll: async (): Promise<Entity[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/entities`);
    return handleResponse<Entity[]>(response);
  },

  getById: async (id: number): Promise<Entity> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/entities/${id}`);
    return handleResponse<Entity>(response);
  },

  create: async (data: Omit<Entity, 'id'>): Promise<Entity> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Entity>(response);
  }
};
```

## CSS設計

- **基本スタイル**: CSS Modules または Styled Components
- **クラス名**: kebab-case（例: `order-panel`, `product-list`）
- **レスポンシブ対応**: モバイルファーストアプローチ
- **共通スタイル**: `styles/common.css` に定義

## エラーハンドリング

```typescript
try {
  const data = await API.fetchData();
  setState({ data, error: null });
} catch (error) {
  setState({
    error: error instanceof Error ? error.message : 'An error occurred'
  });
}
```

## パフォーマンス最適化

- **useCallback**: イベントハンドラーとAPI呼び出し関数
- **useMemo**: 計算コストの高い値
- **React.memo**: 再レンダリングの最適化（必要な場合のみ）

## アクセシビリティ

- セマンティックHTML要素の使用
- `aria-*` 属性の適切な使用
- キーボードナビゲーション対応
- スクリーンリーダー対応

## 品質チェックリスト

- [ ] TypeScript型定義が完全
- [ ] Props インターフェースが明確
- [ ] useState/useEffectが適切に使用されている
- [ ] API呼び出しがカスタムフックに集約されている
- [ ] エラーハンドリングが適切
- [ ] ローディング状態の表示がある
- [ ] CSS クラス名が一貫している
- [ ] アクセシビリティが考慮されている
