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
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  deliveryTime: string;
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
    fullName: "",
    phoneNumber: "",
    deliveryAddress: "",
    deliveryTime: "",
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
    scrollToForm();
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
      fullName: "",
      phoneNumber: "",
      deliveryAddress: "",
      deliveryTime: "",
    });
    setCart([]);

    navigate("/payment");
  };

  return (
    <main>
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
                      <span>AED {f.price.toFixed(3)}</span>
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
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
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
                <div className={styles.input__block}>
                  <label>Delivery Address</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your delivery address"
                    required
                  />
                </div>
                <div className={styles.input__block}>
                  <label>Preferred Delivery Time</label>
                  <input
                    type="datetime-local"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
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
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
