

# モード駆動型レイアウトパターン詳細ガイド

## 目次

1. [概要](#概要)
2. [アーキテクチャ原則](#アーキテクチャ原則)
3. [コンポーネント設計](#コンポーネント設計)
4. [実装パターン](#実装パターン)
5. [ベストプラクティス](#ベストプラクティス)
6. [アンチパターン](#アンチパターン)
7. [トラブルシューティング](#トラブルシューティング)

## 概要

モード駆動型レイアウトパターンは、複数の機能モードを持つアプリケーションで、各モードを独立したコンテンツとして管理する設計パターンです。

### 適用シナリオ

✅ **適している場合:**
- 複数の独立した機能を持つ業務アプリケーション
- モード間でUIが大きく異なる
- 各モードが独自のビジネスロジックを持つ
- モード切り替えが頻繁に発生する

❌ **適していない場合:**
- シンプルな単一画面アプリケーション
- モード間でUIの差が小さい
- ウィザード形式のステップ遷移（別パターンを検討）

## アーキテクチャ原則

### 1. 関心の分離 (Separation of Concerns)

各層が明確な責任を持ちます：

```
┌─────────────────────────────────────────┐
│ App (アプリケーション層)                │
│ - モードルーティング                    │
│ - グローバル状態管理                    │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ MainLayout (レイアウト層)               │
│ - 2カラムレイアウト提供                 │
│ - モード状態管理                        │
└─────────────────────────────────────────┘
         ↓
┌──────────────┬──────────────────────────┐
│ ModeSelector │ {Mode}Content            │
│ (UI層)       │ (ビジネスロジック層)     │
│ - モード選択 │ - モード固有の処理       │
└──────────────┴──────────────────────────┘
```

### 2. 単一責任の原則 (Single Responsibility)

**MainLayout の責務:**
- レイアウト構造の提供のみ
- モード状態の管理のみ
- ビジネスロジックは含まない

**ModeSelector の責務:**
- モード選択UIの提供のみ
- モード切り替えイベントの発火のみ

**ModeContent の責務:**
- そのモード固有のビジネスロジック
- そのモード固有のUI表示
- そのモード固有の状態管理

### 3. 依存性逆転の原則 (Dependency Inversion)

MainLayoutは具体的なModeContentに依存せず、抽象（children関数）に依存します：

```typescript
// ❌ 悪い例: MainLayoutが具体的なコンポーネントに依存
<MainLayout mode="register">
  {/* MainLayoutの内部でRegisterModeContentを直接参照 */}
</MainLayout>

// ✅ 良い例: MainLayoutは抽象に依存
<MainLayout>
  {(mode) => {
    // App.tsxが具体的なコンポーネントを決定
    return <RegisterModeContent />;
  }}
</MainLayout>
```

## コンポーネント設計

### MainLayout コンポーネント

**設計指針:**
- レイアウトロジックのみを持つ
- プレゼンテーションロジックは最小限
- カスタマイズ可能なpropsを提供

**プロパティ設計:**

```typescript
interface MainLayoutProps {
  // 必須: コンテンツ提供関数
  children: (mode: Mode) => React.ReactNode;

  // オプション: カスタマイズ可能な設定
  sidebarTitle?: string;
  sidebarWidth?: number;
  defaultMode?: Mode;
}
```

**状態管理:**

```typescript
// ローカル状態のみ
const [selectedMode, setSelectedMode] = useState<Mode>(defaultMode);

// グローバル状態が必要な場合はContext APIを使用
// const { mode, setMode } = useModeContext();
```

### ModeSelector コンポーネント

**設計指針:**
- プレゼンテーションコンポーネントとして設計
- 状態を持たない（controlled component）
- モード設定を外部から注入可能

**インターフェース設計:**

```typescript
interface ModeSelectorProps {
  // 現在のモード（親から注入）
  selected: Mode;

  // モード変更ハンドラ（親に通知）
  onSelect: (mode: Mode) => void;

  // モード設定（デフォルト値あり）
  modes?: ModeConfig[];
}
```

### ModeContent コンポーネント

**設計指針:**
- 完全に独立したコンポーネント
- 他のModeContentへの依存なし
- カスタムフックでロジックを抽出

**構造パターン:**

```typescript
export function {ModeName}Content() {
  // 1. カスタムフックで状態管理を抽出
  const { state, actions } = use{ModeName}();

  // 2. ローカル状態（UI状態のみ）
  const [showDialog, setShowDialog] = useState(false);

  // 3. 副作用（初期データ読み込みなど）
  useEffect(() => {
    actions.loadInitialData();
  }, []);

  // 4. レンダリング
  return (
    <div className="{mode-name}-content">
      {/* UIの実装 */}
    </div>
  );
}
```

## 実装パターン

### パターン1: 基本的な実装

最もシンプルな実装パターンです。

```typescript
// App.tsx
<MainLayout>
  {(mode) => {
    switch (mode) {
      case 'mode-a':
        return <ModeAContent />;
      case 'mode-b':
        return <ModeBContent />;
      default:
        return <div>未実装</div>;
    }
  }}
</MainLayout>
```

**適用ケース:**
- モード数が少ない（3-5個）
- 各モードが軽量
- Code Splittingが不要

### パターン2: 動的インポート

Code Splittingを使用した最適化パターンです。

```typescript
import { lazy, Suspense } from 'react';

// 動的インポート
const ModeAContent = lazy(() => import('./pages/ModeA/ModeAContent'));
const ModeBContent = lazy(() => import('./pages/ModeB/ModeBContent'));

function App() {
  return (
    <MainLayout>
      {(mode) => (
        <Suspense fallback={<LoadingSpinner />}>
          {(() => {
            switch (mode) {
              case 'mode-a':
                return <ModeAContent />;
              case 'mode-b':
                return <ModeBContent />;
              default:
                return <div>未実装</div>;
            }
          })()}
        </Suspense>
      )}
    </MainLayout>
  );
}
```

**適用ケース:**
- モード数が多い（5個以上）
- 各モードのバンドルサイズが大きい
- 初期ロード時間を短縮したい

### パターン3: レジストリパターン

設定駆動型の実装パターンです。

```typescript
// mode-registry.ts
import { ComponentType } from 'react';

interface ModeRegistryItem {
  id: Mode;
  component: ComponentType;
  label: string;
  enabled: boolean;
}

export const MODE_REGISTRY: ModeRegistryItem[] = [
  {
    id: 'mode-a',
    component: ModeAContent,
    label: 'モードA',
    enabled: true
  },
  {
    id: 'mode-b',
    component: ModeBContent,
    label: 'モードB',
    enabled: true
  }
];

// App.tsx
function App() {
  return (
    <MainLayout>
      {(mode) => {
        const registry = MODE_REGISTRY.find(r => r.id === mode);
        if (!registry) return <div>未実装</div>;

        const Component = registry.component;
        return <Component />;
      }}
    </MainLayout>
  );
}
```

**適用ケース:**
- モード数が非常に多い（10個以上）
- モード設定を動的に変更したい
- プラグインシステムを構築したい

### パターン4: Context API統合

モード状態をグローバルに管理するパターンです。

```typescript
// ModeContext.tsx
const ModeContext = createContext<{
  mode: Mode;
  setMode: (mode: Mode) => void;
} | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('default-mode');

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used within ModeProvider');
  return context;
}

// App.tsx
function App() {
  return (
    <ModeProvider>
      <MainLayout>
        {(mode) => {
          // コンテンツ内でもuseModeでモードにアクセス可能
        }}
      </MainLayout>
    </ModeProvider>
  );
}
```

**適用ケース:**
- モード状態を複数のコンポーネントで共有したい
- モード切り替え履歴を管理したい
- モード間でデータを受け渡したい

## ベストプラクティス

### 1. モード設定の集約

**推奨:**

```typescript
// config/modes.ts
export const MODES: ModeConfig[] = [
  { id: 'register', label: 'レジ', enabled: true },
  { id: 'inventory', label: '在庫管理', enabled: true }
];

// ModeSelector.tsx
<ModeSelector modes={MODES} />
```

**理由:**
- モード追加時の変更箇所が1箇所
- モード一覧の把握が容易
- テスト時にモック化しやすい

### 2. 型安全性の確保

**推奨:**

```typescript
// モード型を厳密に定義
export type Mode = 'register' | 'inventory' | 'product';

// switch文で網羅性チェック
function renderContent(mode: Mode): React.ReactNode {
  switch (mode) {
    case 'register':
      return <RegisterContent />;
    case 'inventory':
      return <InventoryContent />;
    case 'product':
      return <ProductContent />;
    default:
      // TypeScriptがエラーを出す（neverに到達）
      const _exhaustive: never = mode;
      return <div>未実装</div>;
  }
}
```

**理由:**
- モード追加時のcase漏れを防止
- リファクタリング時の安全性向上

### 3. ModeContent の独立性維持

**推奨:**

```typescript
// ✅ 良い例: 各ModeContentが独立
export function RegisterModeContent() {
  const { data, actions } = useRegister();
  return <div>{/* RegisterMode固有のUI */}</div>;
}

export function InventoryModeContent() {
  const { data, actions } = useInventory();
  return <div>{/* InventoryMode固有のUI */}</div>;
}
```

**非推奨:**

```typescript
// ❌ 悪い例: ModeContent間で状態を共有
export function RegisterModeContent({ sharedState }) {
  // 他のモードの状態に依存している
}
```

**理由:**
- 並行開発が可能
- テストが容易
- 変更の影響範囲が限定的

### 4. プレースホルダーコンテンツの提供

**推奨:**

```typescript
// App.tsx
<MainLayout>
  {(mode) => {
    switch (mode) {
      case 'register':
        return <RegisterModeContent />;
      default:
        return (
          <div className="placeholder-content">
            <h2>未実装機能</h2>
            <p>この機能は開発中です</p>
          </div>
        );
    }
  }}
</MainLayout>
```

**理由:**
- 未実装モードでもエラーにならない
- 開発中であることをユーザーに明示

## アンチパターン

### ❌ アンチパターン1: モード間の密結合

```typescript
// ❌ 悪い例
export function RegisterModeContent() {
  // 他のモードの状態を直接参照
  const inventoryState = useInventory();

  return (
    <div>
      {/* InventoryModeの状態に依存 */}
      {inventoryState.items.map(...)}
    </div>
  );
}
```

**問題点:**
- モード間の依存関係が発生
- テストが困難
- 変更の影響が波及

**解決策:**
Context APIやグローバルステートで共有状態を管理

### ❌ アンチパターン2: MainLayoutにビジネスロジックを含める

```typescript
// ❌ 悪い例
export function MainLayout({ children }: MainLayoutProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>('register');

  // ビジネスロジックをMainLayoutに含めている
  const handleOrderCreate = async () => {
    await createOrder();
  };

  return (
    <div className="main-layout">
      {/* ... */}
    </div>
  );
}
```

**問題点:**
- レイアウトコンポーネントの責務が曖昧
- 再利用性が低下

**解決策:**
ビジネスロジックは各ModeContentに配置

### ❌ アンチパターン3: switch文のdefaultケースを省略

```typescript
// ❌ 悪い例
switch (mode) {
  case 'register':
    return <RegisterModeContent />;
  case 'inventory':
    return <InventoryModeContent />;
  // defaultケースがない
}
```

**問題点:**
- 未定義のモードでundefinedが返る
- エラーが発生しにくく、バグの原因に

**解決策:**
必ずdefaultケースを定義

## トラブルシューティング

### 問題1: モード切り替え時に状態がリセットされない

**症状:**
前のモードの状態が次のモードに残る

**原因:**
React Keyが設定されていない

**解決策:**

```typescript
<MainLayout>
  {(mode) => {
    switch (mode) {
      case 'register':
        return <RegisterModeContent key="register" />;
      case 'inventory':
        return <InventoryModeContent key="inventory" />;
    }
  }}
</MainLayout>
```

### 問題2: モード切り替えが遅い

**症状:**
モード切り替え時に遅延が発生

**原因:**
すべてのModeContentを同時に読み込んでいる

**解決策:**
React.lazyで動的インポートを使用

```typescript
const RegisterModeContent = lazy(() => import('./pages/RegisterMode/RegisterModeContent'));
```

### 問題3: TypeScriptエラー: Mode型が一致しない

**症状:**
```
Type '"new-mode"' is not assignable to type 'Mode'
```

**原因:**
Mode型定義に新しいモードが追加されていない

**解決策:**

```typescript
// ModeSelector.tsx
export type Mode = 'register' | 'inventory' | 'new-mode'; // 追加
```

### 問題4: モード設定の変更が反映されない

**症状:**
MODES配列を変更してもUIに反映されない

**原因:**
ModeSelectorにmodesプロパティを渡していない

**解決策:**

```typescript
import { MODES } from './config/modes';

<ModeSelector
  selected={selectedMode}
  onSelect={setSelectedMode}
  modes={MODES} // プロパティを渡す
/>
```

## まとめ

モード駆動型レイアウトパターンは、以下の場合に非常に有効です：

- ✅ 複数の独立した機能を持つアプリケーション
- ✅ 各機能が独自のUIとビジネスロジックを持つ
- ✅ 並行開発を行いたい
- ✅ スケーラビリティを重視したい

このパターンを正しく適用することで、保守性が高く、拡張しやすいアプリケーションを構築できます。
