import styles from "./Main.module.css";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flowers } from "../../flowers";

interface Flower {
  image: string;
  title: string;
  price: number;
  id: number;
}

interface CartItem extends Flower {
  quantity: number;
}

interface OrderForm {
  name: string;
  surName: string;
  phoneNumber: string;
}

interface OrderData extends OrderForm {
  items: CartItem[];
  total: number;
  orderDate: string;
}

const Main = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState<OrderForm>({
    name: "",
    surName: "",
    phoneNumber: "",
  });
  const [, setOrder] = useState<OrderData | null>(null);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const addToCart = (flower: Flower) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === flower.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === flower.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...flower, quantity: 1 }];
      }
    });
    // Скролл будет происходить только после обновления состояния
    setTimeout(scrollToForm, 100);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Please add at least one item to your cart before confirming.");
      return;
    }

    const orderData: OrderData = {
      ...formData,
      items: [...cart],
      total: getTotalPrice(),
      orderDate: new Date().toISOString(),
    };

    setOrder(orderData);

    console.log("Order data:", orderData);

    setFormData({
      name: "",
      surName: "",
      phoneNumber: "",
    });
    setCart([]);

    navigate("/payment");
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
                  <span>
                    <small>
                      <em>from</em>
                    </small>
                    <span>
                      <span>AED {f.price.toFixed(2)}</span>
                    </span>
                  </span>
                  <button className={styles.btn} onClick={() => addToCart(f)}>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <section className={styles.info__block}>
          <h2 className={styles.info__title}>
            Buy Anniversary Flowers in Dubai
          </h2>
          <p className={styles.info__description}>
            Celebrate love and milestones with the Anniversary Flowers
            Collection at Flowers.ae. From romantic roses to elegant lilies, our
            collection offers a variety of arrangements perfect for marking
            special occasions. Each bouquet is expertly designed to make your
            anniversary unforgettable.
          </p>
        </section>
        <section className={styles.info__block}>
          <h2 className={styles.info__title}>
            What Are the Most Popular Anniversary Flowers?
          </h2>
          <p className={styles.info__description}>
            Roses, especially red and pink, are timeless choices for
            anniversaries, but you can also explore lilies, carnations, and
            sunflowers. Learn more in our blog on the Top 10 Anniversary Flowers
            in Dubai.
          </p>
        </section>
        <section className={styles.info__block}>
          <h2 className={styles.info__title}>
            Can I Get Same-Day Anniversary Flower Delivery in Dubai?
          </h2>
          <p className={styles.info__description}>
            We offer free same-day delivery in Dubai, Sharjah, Abu Dhabi, Al
            Ain, Ras Al Khaimah, Ajman, and Umm Al Quwain with a minimum order
            of AED 245. To learn more, visit our FAQ page.
          </p>
        </section>

        {/* Показываем блок с формой и корзиной только когда корзина не пуста */}
        {cart.length > 0 && (
          <div className={styles.row}>
            <div className={styles.column__form}>
              <div ref={formRef} className={styles.form__wrapper}>
                <p>Recipient Information</p>
                <p>
                  Please fill in the details below to ensure a smooth and timely
                  delivery of your bouquet.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className={styles.input__block}>
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className={styles.input__block}>
                    <label>Surname</label>
                    <input
                      type="text"
                      name="surName"
                      value={formData.surName}
                      onChange={handleInputChange}
                      placeholder="Enter your surname"
                      required
                    />
                  </div>
                  <div className={styles.input__block}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="971501234567"
                      required
                    />
                  </div>
                  <button type="submit">Confirm Details</button>
                </form>
              </div>
            </div>
            <div className={styles.column__form}>
              <div className={styles.form__wrapper}>
                <p>Shopping Cart</p>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemInfo}>
                      <h4>{item.title}</h4>
                      <p>AED {item.price.toFixed(3)}</p>
                    </div>
                    <div className={styles.cartItemControls}>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className={styles.quantityBtn}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className={styles.quantityBtn}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={styles.removeBtn}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className={styles.cartTotal}>
                  <h3>Total: AED {getTotalPrice().toFixed(3)}</h3>
                </div>
              </div>
              <div className={styles.supported_cards}>
                <img
                  height="16"
                  alt="visa"
                  src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg"
                />
                <img
                  height="16"
                  alt="mc"
                  src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg"
                />
                <img
                  height="16"
                  alt="bcmc"
                  src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/bcmc.svg"
                />
                <img
                  height="16"
                  alt="amex"
                  src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/amex.svg"
                />
                <img
                  height="16"
                  alt="cup"
                  src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/cup.svg"
                />
                <img
                  height="16"
                  alt="diners"
                  src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/diners.svg"
                />
                <img
                  height="16"
                  alt="discover"
                  src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/discover.svg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Main;