import styles from "./Main.module.css";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flowers } from "../../flowers";
import { useCart } from "../../context/cartContext";
import Loading from "../Loading/Loading";

const Main = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const {
    state,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
  } = useCart();

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAddToCart = (flower: any) => {
    addToCart(flower);
    setTimeout(scrollToForm, 100);
  };

  const handleCheckout = async () => {
    if (state.cart.length === 0) {
      alert("Please add at least one item to your cart before checkout.");
      return;
    }
    console.log(getTotalPrice());
    try {
      setLoading(true);

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalPrice: getTotalPrice(),
          clientId: "flowers.ae",
        }),
      });

      const data = await res.json();
      if (data.sessionId) {
        // сохраняем sessionId в localStorage
        localStorage.setItem("currentSessionId", data.sessionId);
        localStorage.setItem("clientId", "flowers.ae");

        setLoading(false);
        navigate("/payment");
      } else {
        setLoading(false);
        alert("Не удалось получить sessionId.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an error processing your payment. Please try again.");
    }
  };

  return (
    <main>
      <h1 className={styles.title}>Anniversary Flowers</h1>
      <p className={styles.description}>
        Mark your special milestone with a stunning anniversary flower bouquet
        or elegant anniversary flower arrangement, perfect for celebrating love
        and togetherness. Flowers.ae offers same-day anniversary flower delivery
        across all Emirates.
      </p>
      <div className="container">
        <div className={styles.row}>
          {flowers.map((f) => (
            <div key={f.id} className={styles.column}>
              <div className={styles.item}>
                <div
                  onClick={() => navigate(`/flower/${f.id}`)}
                  className={styles.item__header}
                >
                  <img width={362} src={f.image} alt={f.title} />
                </div>
                <div className={styles.item__body}>
                  <span>{f.title}</span>
                  {f.discount && (
                    <span style={{ color: "red" }}>
                      {" "}
                      discount {f.discount}%
                    </span>
                  )}
                  <span className={styles.full_price}>
                    <span>
                      <span>AED {f.fullPrice.toFixed(2)}</span>
                    </span>
                  </span>
                  <span style={{ color: "red" }}>
                    <span>
                      <span>AED {f.price.toFixed(2)}</span>
                    </span>
                  </span>
                  <button
                    className={styles.btn}
                    onClick={() => handleAddToCart(f)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Показываем блок с корзиной только когда корзина не пуста */}
        {state.cart.length > 0 && (
          <div ref={formRef} className={styles.cartSection}>
            <h2 className={styles.cartTitle}>Your Shopping Cart</h2>
            <div className={styles.cartContainer}>
              <div className={styles.cartItems}>
                {state.cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemImage}>
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className={styles.cartItemDetails}>
                      <h3 className={styles.cartItemTitle}>{item.title}</h3>
                      <p className={styles.cartItemPrice}>
                        AED {item.price.toFixed(2)}
                      </p>
                      <div className={styles.cartItemControls}>
                        <div className={styles.quantityControls}>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className={styles.quantityBtn}
                          >
                            -
                          </button>
                          <span className={styles.quantity}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className={styles.quantityBtn}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className={styles.removeBtn}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className={styles.cartItemTotal}>
                      <span>AED {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.cartSummary}>
                <div className={styles.cartTotal}>
                  <h3>Total: AED {getTotalPrice().toFixed(2)}</h3>
                </div>

                <button onClick={handleCheckout} className={styles.submitBtn}>
                  Proceed to Checkout
                </button>

                <div className={styles.supportedCards}>
                  <p>We accept:</p>
                  <div className={styles.cardIcons}>
                    <img
                      height="24"
                      alt="visa"
                      src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg"
                    />
                    <img
                      height="24"
                      alt="mc"
                      src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg"
                    />
                    <img
                      height="24"
                      alt="amex"
                      src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/amex.svg"
                    />
                    <img
                      height="24"
                      alt="discover"
                      src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/discover.svg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Информационные блоки остаются без изменений */}

        <section className={styles.info__block}>
          <h2 className={styles.info__title}>
            How will I receive the flowers after payment
          </h2>
          <p className={styles.info__description}>
            After payment, our courier will call you immediately to arrange a
            meeting place.
          </p>
        </section>
        <section className={styles.info__block}>
          <h2 className={styles.info__title}>How can I pay for my order? </h2>
          <p className={styles.info__description}>
            To pay for your order, select a bouquet by clicking “Add to cart.”
            <br />
            After entering your contact details, you will need to pay for your
            order using your bank card.
          </p>
        </section>
      </div>
      <Loading isLoading={isLoading} />
    </main>
  );
};

export default Main;
