import './ModeSelector.css';

export type Mode = 'register' | 'product-management';

interface ModeSelectorProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      <div className="mode-selector-header">モード選択</div>
      <button
        className={`mode-button ${currentMode === 'register' ? 'active' : ''}`}
        onClick={() => onModeChange('register')}
      >
        レジ
      </button>
      <button
        className={`mode-button ${currentMode === 'product-management' ? 'active' : ''}`}
        onClick={() => onModeChange('product-management')}
        disabled
      >
        商品管理
      </button>
      <button className="mode-button" disabled>
        レジ
      </button>
      <button className="mode-button" disabled>
        商品管理
      </button>
      <button className="mode-button" disabled>
        商品管理
      </button>
    </div>
  );
}
