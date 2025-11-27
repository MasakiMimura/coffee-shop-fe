import React from 'react';
import type { CartItem, Member } from '../../types';

interface OrderPanelProps {
  cartItems: CartItem[];
  totalAmount: number;
  member: Member | null;
  onQuantityChange: (productId: number, quantity: number) => void;
  onConfirm: () => void;
}

export function OrderPanel({
  cartItems,
  totalAmount,
  member,
  onQuantityChange,
  onConfirm
}: OrderPanelProps) {
  return (
    <div className="order-panel">
      <div className="order-header">注文</div>

      {/* ポイントカード表示 */}
      <div className="point-card-section">
        <input
          type="text"
          placeholder="ポイントカード"
          className="point-card-input"
        />
        <button className="ok-button">OK</button>
      </div>

      {/* 会員情報表示 */}
      {member && (
        <div className="member-info">
          {member.lastName} {member.firstName}様 残高 {member.pointBalance}
        </div>
      )}

      {/* 注文アイテム */}
      <div className="order-items">
        {cartItems.map((item) => (
          <div key={item.product.productId} className="order-item">
            <span className="item-name">{item.product.productName}</span>
            <div className="quantity-controls">
              <button
                onClick={() =>
                  onQuantityChange(item.product.productId, item.quantity - 1)
                }
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button
                onClick={() =>
                  onQuantityChange(item.product.productId, item.quantity + 1)
                }
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 合計 */}
      <div className="order-total">
        <div className="total-label">合計</div>
        <div className="total-amount">¥{totalAmount}</div>
      </div>

      {/* 確定ボタン */}
      <button
        className="confirm-button"
        onClick={onConfirm}
        disabled={cartItems.length === 0}
      >
        確定
      </button>
    </div>
  );
}
