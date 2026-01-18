import './ModeSelector.css';

export type Mode = 'register' | 'product-management';

interface ModeSelectorProps {
  selected: Mode;
  onSelect: (mode: Mode) => void;
}

export function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      <button
        className={`mode-button ${selected === 'register' ? 'active' : ''}`}
        onClick={() => onSelect('register')}
      >
        レジ
      </button>
      <button
        className={`mode-button ${selected === 'product-management' ? 'active' : ''}`}
        onClick={() => onSelect('product-management')}
      >
        商品管理
      </button>
      <button className="mode-button" disabled>
        レシピ管理
      </button>
      <button className="mode-button" disabled>
        在庫管理
      </button>
      <button className="mode-button" disabled>
        材料管理
      </button>
    </div>
  );
}
