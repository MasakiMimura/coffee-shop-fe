import './{FeatureSelector}.css';

/**
 * モード型定義
 *
 * アプリケーションで使用可能なすべてのモードを定義します。
 * 新しいモードを追加する場合は、この型定義に追加してください。
 *
 * @example
 * type Mode = 'register' | 'product-management' | 'inventory';
 */
export type {Mode} = {ModeTypes};

/**
 * モード設定インターフェース
 *
 * 各モードの表示設定を定義します。
 */
export interface ModeConfig {
  /** モードID（Mode型で定義された値） */
  id: {Mode};
  /** モード表示名 */
  label: string;
  /** モードが有効かどうか */
  enabled: boolean;
  /** アイコン（オプション） */
  icon?: string;
}

interface {FeatureSelector}Props {
  /** 現在選択されているモード */
  selected: {Mode};
  /** モード選択時のコールバック関数 */
  onSelect: (mode: {Mode}) => void;
  /** モード設定配列（オプション） */
  modes?: ModeConfig[];
}

/**
 * デフォルトモード設定
 *
 * モード設定が提供されない場合に使用されます。
 * プロジェクトに応じて、この設定を変更してください。
 */
const DEFAULT_MODES: ModeConfig[] = [
  {ModeConfigList}
];

/**
 * {FeatureSelector}コンポーネント
 *
 * モード選択UIを提供します。
 * ボタンリストとして表示され、選択されたモードはアクティブ状態で表示されます。
 *
 * @param selected - 現在選択されているモード
 * @param onSelect - モード選択時のコールバック関数
 * @param modes - モード設定配列（オプション、未指定時はDEFAULT_MODESを使用）
 *
 * @example
 * ```tsx
 * <{FeatureSelector}
 *   selected={currentMode}
 *   onSelect={(mode) => setCurrentMode(mode)}
 * />
 * ```
 *
 * @example カスタムモード設定を使用
 * ```tsx
 * const customModes: ModeConfig[] = [
 *   { id: 'mode-a', label: 'モードA', enabled: true },
 *   { id: 'mode-b', label: 'モードB', enabled: false }
 * ];
 *
 * <{FeatureSelector}
 *   selected={currentMode}
 *   onSelect={(mode) => setCurrentMode(mode)}
 *   modes={customModes}
 * />
 * ```
 */
export function {FeatureSelector}({ selected, onSelect, modes = DEFAULT_MODES }: {FeatureSelector}Props) {
  return (
    <div className="{feature-selector}">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={`{feature-selector}__button ${selected === mode.id ? 'active' : ''}`}
          onClick={() => onSelect(mode.id)}
          disabled={!mode.enabled}
        >
          {mode.icon && <span className="{feature-selector}__icon">{mode.icon}</span>}
          <span className="{feature-selector}__label">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
