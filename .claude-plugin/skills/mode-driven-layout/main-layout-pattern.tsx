import { useState } from 'react';
import { {FeatureSelector}, type {Mode} } from '../{FeatureSelector}/{FeatureSelector}';
import './MainLayout.css';

interface MainLayoutProps {
  children: (mode: {Mode}) => React.ReactNode;
  sidebarTitle?: string;
}

/**
 * メインレイアウトコンポーネント
 *
 * 2カラムレイアウト（左: モード選択、右: コンテンツエリア）を提供します。
 *
 * @param children - モードを受け取ってコンテンツを返す関数
 * @param sidebarTitle - サイドバーのタイトル（オプション、デフォルト: 'モード選択'）
 *
 * @example
 * ```tsx
 * <MainLayout sidebarTitle="機能選択">
 *   {(mode) => {
 *     switch (mode) {
 *       case 'mode-a':
 *         return <ModeAContent />;
 *       case 'mode-b':
 *         return <ModeBContent />;
 *       default:
 *         return <div>未実装</div>;
 *     }
 *   }}
 * </MainLayout>
 * ```
 */
export function MainLayout({ children, sidebarTitle = '{SidebarTitle}' }: MainLayoutProps) {
  const [selectedMode, setSelectedMode] = useState<{Mode}>('{DefaultMode}');

  return (
    <div className="main-layout">
      <aside className="main-layout__sidebar">
        <h2 className="main-layout__sidebar-title">{sidebarTitle}</h2>
        <{FeatureSelector} selected={selectedMode} onSelect={setSelectedMode} />
      </aside>
      <main className="main-layout__content">
        {children(selectedMode)}
      </main>
    </div>
  );
}
