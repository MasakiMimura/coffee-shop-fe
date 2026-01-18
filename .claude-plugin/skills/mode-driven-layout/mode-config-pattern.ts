/**
 * モード設定パターン
 *
 * アプリケーションで使用する全モードの設定を集約管理します。
 * この設定ファイルを変更することで、モードの追加・削除・変更を一元管理できます。
 *
 * ## 使用方法
 *
 * ### 基本的な使用
 * ```typescript
 * import { MODES, getEnabledModes } from './config/modes';
 *
 * // すべてのモード設定を取得
 * const allModes = MODES;
 *
 * // 有効なモードのみを取得
 * const enabledModes = getEnabledModes();
 * ```
 *
 * ### ModeSelector での使用
 * ```typescript
 * <ModeSelector
 *   selected={currentMode}
 *   onSelect={setCurrentMode}
 *   modes={MODES}
 * />
 * ```
 */

import type { {Mode}, ModeConfig } from '../components/{FeatureSelector}/{FeatureSelector}';

/**
 * モード設定定義
 *
 * 各モードの設定を定義します。
 * 新しいモードを追加する場合は、この配列に追加してください。
 *
 * @property id - モードID（Mode型で定義された値）
 * @property label - モード表示名
 * @property enabled - モードが有効かどうか
 * @property icon - アイコン（オプション）
 * @property description - モードの説明（オプション）
 */
export const MODES: ModeConfig[] = [
  {
    id: '{mode-1-id}',
    label: '{Mode1Label}',
    enabled: {Mode1Enabled},
    icon: '{Mode1Icon}',
  },
  {
    id: '{mode-2-id}',
    label: '{Mode2Label}',
    enabled: {Mode2Enabled},
    icon: '{Mode2Icon}',
  },
  {
    id: '{mode-3-id}',
    label: '{Mode3Label}',
    enabled: {Mode3Enabled},
    icon: '{Mode3Icon}',
  },
  // 新しいモードをここに追加
];

/**
 * デフォルトモードを取得
 *
 * 有効なモードの中から最初のモードを返します。
 * すべてのモードが無効な場合は、最初のモードを返します。
 *
 * @returns デフォルトモード
 */
export function getDefaultMode(): {Mode} {
  const enabledMode = MODES.find(mode => mode.enabled);
  return (enabledMode?.id ?? MODES[0]?.id) as {Mode};
}

/**
 * 有効なモードのみを取得
 *
 * enabled=true のモードのみをフィルタリングして返します。
 *
 * @returns 有効なモード設定の配列
 */
export function getEnabledModes(): ModeConfig[] {
  return MODES.filter(mode => mode.enabled);
}

/**
 * モードIDからモード設定を取得
 *
 * @param modeId - モードID
 * @returns モード設定（見つからない場合はundefined）
 */
export function getModeConfig(modeId: {Mode}): ModeConfig | undefined {
  return MODES.find(mode => mode.id === modeId);
}

/**
 * モードが有効かどうかを判定
 *
 * @param modeId - モードID
 * @returns モードが有効な場合true
 */
export function isModeEnabled(modeId: {Mode}): boolean {
  const config = getModeConfig(modeId);
  return config?.enabled ?? false;
}

/**
 * モード設定のバリデーション
 *
 * モード設定に重複するIDがないかチェックします。
 * アプリケーション起動時に実行することを推奨します。
 *
 * @throws Error モード設定に問題がある場合
 */
export function validateModeConfig(): void {
  const ids = MODES.map(mode => mode.id);
  const uniqueIds = new Set(ids);

  if (ids.length !== uniqueIds.size) {
    throw new Error('モード設定に重複するIDが存在します');
  }

  if (MODES.length === 0) {
    throw new Error('モード設定が空です。少なくとも1つのモードを定義してください');
  }

  const hasEnabledMode = MODES.some(mode => mode.enabled);
  if (!hasEnabledMode) {
    console.warn('警告: すべてのモードが無効化されています');
  }
}

// 開発環境でのみバリデーションを実行
if (import.meta.env.DEV) {
  validateModeConfig();
}
