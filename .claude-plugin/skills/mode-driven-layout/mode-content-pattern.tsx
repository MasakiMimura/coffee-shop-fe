import { useState, useEffect } from 'react';
import './{ModeName}Content.css';
{ModeContentImports}

/**
 * {ModeName}モードの状態型定義
 *
 * このモードで管理する状態を定義します。
 */
interface {ModeName}State {
  isLoading: boolean;
  error: string | null;
  {StateFields}
}

/**
 * 初期状態
 */
const initialState: {ModeName}State = {
  isLoading: false,
  error: null,
  {InitialStateValues}
};

/**
 * {ModeName}Contentコンポーネント
 *
 * {ModeName}モードのメインコンテンツを表示します。
 * このモード固有のビジネスロジック、状態管理、UI表示を担当します。
 *
 * ## 責務
 * - {ModeName}モード固有の状態管理
 * - API呼び出し（必要に応じて）
 * - {ModeName}モードのUIレイアウト
 * - ユーザーインタラクションの処理
 *
 * ## 実装ガイドライン
 * - モード内のレイアウトはこのコンポーネントで定義
 * - 複雑なロジックはカスタムフックに抽出を検討
 * - 再利用可能な部品はcomponents/配下に配置
 *
 * @example
 * ```tsx
 * // App.tsx での使用
 * case '{mode-id}':
 *   return <{ModeName}Content />;
 * ```
 */
export function {ModeName}Content() {
  const [state, setState] = useState<{ModeName}State>(initialState);

  // 初回ロード時の処理
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * 初期データの読み込み
   *
   * モード表示時に必要なデータをAPIから取得します。
   */
  const loadInitialData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // API呼び出し例
      // const data = await {ApiService}.{fetchMethod}();
      // setState(prev => ({ ...prev, data, isLoading: false }));

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err) {
      console.error('{ModeName}データ読み込みエラー:', err);
      setState(prev => ({
        ...prev,
        error: `データの読み込みに失敗しました: ${err instanceof Error ? err.message : String(err)}`,
        isLoading: false
      }));
    }
  };

  /**
   * ユーザーアクションの処理例
   *
   * ボタンクリックなどのユーザーインタラクションを処理します。
   */
  const handleAction = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // ビジネスロジックの実装
      // await {ApiService}.{actionMethod}();

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err) {
      console.error('{ModeName}アクション実行エラー:', err);
      setState(prev => ({
        ...prev,
        error: `処理に失敗しました: ${err instanceof Error ? err.message : String(err)}`,
        isLoading: false
      }));
    }
  };

  // エラー表示
  if (state.error) {
    return (
      <div className="{mode-name}-content">
        <div className="error-banner">
          <strong>エラー:</strong> {state.error}
          <button
            className="error-close"
            onClick={() => setState(prev => ({ ...prev, error: null }))}
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  // メインコンテンツ
  return (
    <div className="{mode-name}-content">
      {/* モード固有のレイアウトをここに実装 */}
      <div className="{mode-name}-content__header">
        <h1>{ModeName}モード</h1>
      </div>

      <div className="{mode-name}-content__body">
        {state.isLoading ? (
          <div className="loading-message">読み込み中...</div>
        ) : (
          <>
            {/* メインコンテンツ */}
            <div className="{mode-name}-content__main">
              {/* ここにモード固有のUIを実装 */}
              <p>コンテンツをここに実装してください</p>
            </div>
          </>
        )}
      </div>

      <div className="{mode-name}-content__footer">
        {/* アクションボタンなど */}
        <button
          className="action-button"
          onClick={handleAction}
          disabled={state.isLoading}
        >
          実行
        </button>
      </div>
    </div>
  );
}
