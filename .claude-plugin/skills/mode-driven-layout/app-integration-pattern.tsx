import './App.css';
import { MainLayout } from './components/Layout/MainLayout';
{ModeContentImports}

/**
 * アプリケーションエントリーポイント
 *
 * MainLayoutを使用してモード駆動型レイアウトを構築します。
 * 各モードに対応するコンテンツコンポーネントをswitch文で切り替えます。
 *
 * ## 新しいモードの追加手順
 *
 * 1. モード型定義に新しいモードを追加（{FeatureSelector}.tsx）
 * 2. 新しいModeContentコンポーネントを作成（pages/{ModeName}/）
 * 3. このファイルの上部でimport
 * 4. switch文に新しいcaseを追加
 *
 * @example 新しいモードの追加
 * ```typescript
 * // 1. import追加
 * import { NewModeContent } from './pages/NewMode/NewModeContent';
 *
 * // 2. switch文にケース追加
 * case 'new-mode':
 *   return <NewModeContent />;
 * ```
 */
function App() {
  return (
    <div className="app">
      <MainLayout sidebarTitle="{SidebarTitle}">
        {(mode) => {
          switch (mode) {
            {ModeCases}
            default:
              return (
                <div className="placeholder-content">
                  <p>選択されたモードは未実装です</p>
                </div>
              );
          }
        }}
      </MainLayout>
    </div>
  );
}

export default App;
