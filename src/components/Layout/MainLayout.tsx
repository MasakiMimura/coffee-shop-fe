import { useState } from 'react';
import { ModeSelector, type Mode } from '../ModeSelector/ModeSelector';
import './MainLayout.css';

interface MainLayoutProps {
  children: (mode: Mode) => React.ReactNode;
  sidebarTitle?: string;
}

/**
 * メインレイアウトコンポーネント
 *
 * 2カラムレイアウト（左: モード選択、右: コンテンツエリア）を提供します。
 *
 * @param children - モードを受け取ってコンテンツを返す関数
 * @param sidebarTitle - サイドバーのタイトル（オプション、デフォルト: 'モード選択'）
 */
export function MainLayout({ children, sidebarTitle = 'モード選択' }: MainLayoutProps) {
  const [selectedMode, setSelectedMode] = useState<Mode>('register');

  return (
    <div className="main-layout">
      <aside className="main-layout__sidebar">
        <h2 className="main-layout__sidebar-title">{sidebarTitle}</h2>
        <ModeSelector selected={selectedMode} onSelect={setSelectedMode} />
      </aside>
      <main className="main-layout__content">
        {children(selectedMode)}
      </main>
    </div>
  );
}
