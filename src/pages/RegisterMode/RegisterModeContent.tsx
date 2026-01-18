import { useState, useEffect } from 'react';
import type { CartItem, Member, Product } from '../../types';
import { ProductList } from '../../components/Product/ProductList';
import { OrderPanel } from '../../components/Order/OrderPanel';
import { ConfirmDialog } from '../../components/Dialog/ConfirmDialog';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import './RegisterModeContent.css';

export function RegisterModeContent() {
  const [orderId, setOrderId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // 初回ロード時に注文を作成
  useEffect(() => {
    checkAndCreateOrder();
  }, []);

  // IN_ORDER状態の注文をチェックし、必要に応じて新規作成
  const checkAndCreateOrder = async (showDialog = false) => {
    try {
      setIsLoading(true);
      setError(null);

      if (showDialog && orderId) {
        setShowClearDialog(true);
        setIsLoading(false);
        return;
      }

      const response = await orderService.createOrder(null);
      setOrderId(response.orderId);
      setCartItems([]);
      setMember(null);
    } catch (err) {
      console.error('注文作成エラー:', err);
      setError(`注文の作成に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 初期化確認ダイアログのOK処理
  const handleClearConfirm = async () => {
    setShowClearDialog(false);
    setCartItems([]);
    setMember(null);
    await checkAndCreateOrder(false);
  };

  // 初期化確認ダイアログのキャンセル処理
  const handleClearCancel = () => {
    setShowClearDialog(false);
  };

  // 商品選択時の処理
  const handleProductSelect = (product: Product) => {
    const existingItem = cartItems.find(
      (item) => item.product.productId === product.productId
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
  };

  // 数量変更処理
  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter((item) => item.product.productId !== productId));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.product.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // 合計金額計算
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.product.isCampaign
        ? item.product.price * (1 - item.product.campaignDiscountPercent / 100)
        : item.product.price;
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  // 会員検索処理
  const handleMemberSearch = async (cardNo: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const memberData = await userService.getUserByCardNo(cardNo);
      setMember(memberData);
    } catch (err) {
      console.error('会員検索エラー:', err);
      setError('会員が見つかりませんでした');
      setMember(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 注文確定処理
  const handleConfirm = async () => {
    if (!orderId) {
      setError('注文IDが見つかりません');
      return;
    }

    if (cartItems.length === 0) {
      setError('カートに商品がありません');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. 注文にアイテムを追加
      for (const item of cartItems) {
        const itemData = {
          productId: item.product.productId,
          quantity: item.quantity
        };
        await orderService.addItemToOrder(orderId, itemData);
      }

      // 2. 注文確定
      await orderService.confirmOrder(orderId);

      // 3. 決済処理
      const paymentData = {
        paymentMethod: 'OTHER' as const,
        memberCardNo: member?.memberCardNo || null
      };
      await orderService.payOrder(orderId, paymentData);

      alert(`注文を確定しました！\n注文ID: ${orderId}\n合計: ¥${calculateTotal()}`);

      // 新しい注文を作成
      await checkAndCreateOrder(false);
    } catch (err) {
      console.error('注文確定エラー:', err);
      setError(`注文の確定に失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-mode-content">
      {error && (
        <div className="error-banner">
          <strong>エラー:</strong> {error}
          <button className="error-close" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <ProductList onProductSelect={handleProductSelect} />
      <OrderPanel
        cartItems={cartItems}
        totalAmount={calculateTotal()}
        member={member}
        onQuantityChange={handleQuantityChange}
        onConfirm={handleConfirm}
        onMemberSearch={handleMemberSearch}
      />

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">処理中...</div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showClearDialog}
        title="注文のクリア"
        message="注文をクリアして新規注文を開始しますか？"
        onConfirm={handleClearConfirm}
        onCancel={handleClearCancel}
      />
    </div>
  );
}
