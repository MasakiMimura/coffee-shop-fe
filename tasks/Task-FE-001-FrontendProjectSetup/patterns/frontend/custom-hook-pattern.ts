import { useState, useEffect, useCallback } from 'react';
import { {EntityName}API } from '../api/{entity-name}-api';
import { {EntityName}, {EntityName}State } from '../types';

/**
 * use{EntityName}
 * {EntityName}管理のためのカスタムフック
 * useState/useEffectベースのシンプルな状態管理
 *
 * Features:
 * - {EntityName}データのCRUD操作
 * - ローディング状態管理
 * - エラーハンドリング
 * - API呼び出しの最適化（useCallback）
 */

export function use{EntityName}() {
  const [state, setState] = useState<{EntityName}State>({
    {entityListVariable}: [],
    selected{EntityName}: null,
    isLoading: false,
    error: null
  });

  /**
   * {EntityName}一覧を取得
   */
  const fetch{EntityName}List = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await {EntityName}API.getAll();
      setState(prev => ({ ...prev, {entityListVariable}: data, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      }));
    }
  }, []);

  /**
   * IDで{EntityName}を取得
   */
  const fetch{EntityName}ById = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await {EntityName}API.getById(id);
      setState(prev => ({ ...prev, selected{EntityName}: data, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      }));
    }
  }, []);

  /**
   * 新規{EntityName}を作成
   */
  const create{EntityName} = useCallback(async (data: Omit<{EntityName}, 'id'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const created = await {EntityName}API.create(data);
      setState(prev => ({
        ...prev,
        {entityListVariable}: [...prev.{entityListVariable}, created],
        isLoading: false
      }));
      return created;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  /**
   * {EntityName}を更新
   */
  const update{EntityName} = useCallback(async (id: number, data: Partial<{EntityName}>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const updated = await {EntityName}API.update(id, data);
      setState(prev => ({
        ...prev,
        {entityListVariable}: prev.{entityListVariable}.map(item =>
          item.id === id ? updated : item
        ),
        isLoading: false
      }));
      return updated;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  /**
   * {EntityName}を削除
   */
  const delete{EntityName} = useCallback(async (id: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await {EntityName}API.delete(id);
      setState(prev => ({
        ...prev,
        {entityListVariable}: prev.{entityListVariable}.filter(item => item.id !== id),
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  /**
   * 初期化時に{EntityName}一覧を取得
   */
  useEffect(() => {
    fetch{EntityName}List();
  }, [fetch{EntityName}List]);

  return {
    ...state,
    fetch{EntityName}List,
    fetch{EntityName}ById,
    create{EntityName},
    update{EntityName},
    delete{EntityName}
  };
}
