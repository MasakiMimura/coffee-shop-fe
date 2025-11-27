import { useState, useEffect } from 'react'
import './App.css'
import { OrderPanel } from './components/Order/OrderPanel'
import type { CartItem, Member } from './types'
import { orderService } from './services/orderService'
import { userService } from './services/userService'
import { stockService } from './services/stockService'
import { pointService } from './services/pointService'

function App() {
  const [orderId, setOrderId] = useState<number | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: {
        productId: 1,
        productName: 'ブレンドコーヒー',
        price: 300,
        isCampaign: false,
        campaignDiscountPercent: 0,
        categoryId: 1,
        categoryName: 'ドリンク'
      },
      quantity: 2
    },
    {
      product: {
        productId: 2,
        productName: 'カフェラテ',
        price: 400,
        isCampaign: true,
        campaignDiscountPercent: 10,
        categoryId: 1,
        categoryName: 'ドリンク'
      },
      quantity: 1
    }
  ])

  const [member, setMember] = useState<Member | null>({
    memberId: 'M001',
    memberCardNo: '1234567890',
    firstName: '太郎',
    lastName: '山田',
    pointBalance: 1500
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // コンポーネントマウント時に注文を作成
  useEffect(() => {
    createNewOrder()
  }, [])

  const createNewOrder = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // ゲスト注文としてテスト（memberCardNo = null）
      const response = await orderService.createOrder(null)
      setOrderId(response.orderId)
      console.log('注文作成成功:', response)
    } catch (err) {
      console.error('注文作成エラー:', err)
      setError(`注文の作成に失敗しました: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.product.isCampaign
        ? item.product.price * (1 - item.product.campaignDiscountPercent / 100)
        : item.product.price
      return total + discountedPrice * item.quantity
    }, 0)
  }

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.product.productId !== productId))
    } else {
      setCartItems(cartItems.map(item =>
        item.product.productId === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const handleConfirm = async () => {
    if (!orderId) {
      setError('注文IDが見つかりません')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // 1. 注文にアイテムを追加
      console.log('注文にアイテムを追加中...')
      for (const item of cartItems) {
        await orderService.addItemToOrder(orderId, {
          productId: item.product.productId,
          quantity: item.quantity
        })
      }
      console.log('アイテム追加完了')

      // 2. 在庫確認（オプショナル - サービスが利用できない場合はスキップ）
      try {
        console.log('在庫確認中...')
        const stockCheckData = {
          items: cartItems.map(item => ({
            productId: item.product.productId,
            quantity: item.quantity
          }))
        }
        const stockCheck = await stockService.checkAvailability(stockCheckData)

        if (!stockCheck.available) {
          setError('在庫が不足しています')
          return
        }
        console.log('在庫確認完了')
      } catch (err) {
        console.warn('在庫サービスが利用できません。在庫確認をスキップします。', err)
      }

      // 3. 注文確定
      console.log('注文確定中...')
      const confirmResponse = await orderService.confirmOrder(orderId)
      console.log('注文確定成功:', confirmResponse)

      // 4. 在庫消費（オプショナル - サービスが利用できない場合はスキップ）
      try {
        console.log('在庫消費中...')
        const consumptionData = {
          orderId,
          items: cartItems.map(item => ({
            productId: item.product.productId,
            quantity: item.quantity
          }))
        }
        await stockService.consumeStock(consumptionData)
        console.log('在庫消費完了')
      } catch (err) {
        console.warn('在庫サービスが利用できません。在庫消費をスキップします。', err)
      }

      // 5. ポイント処理（オプショナル - サービスが利用できない場合はスキップ）
      if (member) {
        try {
          console.log('ポイント付与中...')
          const earnedPoints = Math.floor(calculateTotal() * 0.1)
          await pointService.accruePoints({
            memberCardNo: member.memberCardNo,
            points: earnedPoints,
            orderId,
            reason: 'ORDER_PAYMENT',
            baseAmount: calculateTotal()
          })
          console.log(`ポイント付与完了: ${earnedPoints}pt`)
        } catch (err) {
          console.warn('ポイントサービスが利用できません。ポイント付与をスキップします。', err)
        }
      }

      // 6. 決済処理
      console.log('決済処理中...')
      const paymentData = {
        paymentMethod: 'OTHER' as const,
        memberCardNo: member?.memberCardNo || null
      }
      const paymentResponse = await orderService.payOrder(orderId, paymentData)
      console.log('決済完了:', paymentResponse)

      alert(`注文を確定しました！\n注文ID: ${orderId}\n合計: ¥${calculateTotal()}`)

      // 新しい注文を作成
      await createNewOrder()
      setCartItems([])
    } catch (err) {
      console.error('注文確定エラー:', err)
      setError(`注文の確定に失敗しました: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Coffee Shop POS</h1>
      {error && (
        <div className="error-message" style={{
          backgroundColor: '#fee',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px',
          color: '#c00'
        }}>
          <strong>エラー:</strong> {error}
        </div>
      )}
      {isLoading && (
        <div className="loading-message" style={{
          backgroundColor: '#eff',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px'
        }}>
          処理中...
        </div>
      )}
      <div style={{
        backgroundColor: '#efe',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px'
      }}>
        <strong>注文ID:</strong> {orderId || '作成中...'}
      </div>
      <OrderPanel
        cartItems={cartItems}
        totalAmount={calculateTotal()}
        member={member}
        onQuantityChange={handleQuantityChange}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default App
