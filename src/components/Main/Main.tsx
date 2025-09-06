import styles from "./Main.module.css";
import { useRef, useState } from "react";

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

const flowers = [
  {
    id: 1,
    image: "/assets/flowers/CoralineVipGrand_420x.webp",
    title: "Caroline",
    price: 2.195,
  },
  {
    id: 2,
    image: "/assets/flowers/AriannaClassic_420x.webp",
    title: "Arianna",
    price: 2.195,
  },
  {
    id: 3,
    image: "/assets/flowers/BiancaVipGrand_420x.webp",
    title: "Bianca",
    price: 2.195,
  },
  {
    id: 4,
    image: "/assets/flowers/AmelieClassic_420x.webp",
    title: "Amelie",
    price: 2.195,
  },
  {
    id: 5,
    image:
      "/assets/flowers/Caraline-HB_27e7e0e3-ad23-4360-813d-88ff965be07f_420x.webp",
    title: "Caroline Hatbox",
    price: 1.995,
  },
  {
    id: 6,
    image:
      "/assets/flowers/Arianna_41bbade1-3991-45f1-ba65-f67ddcd67c74_420x.webp",
    title: "Arianna Hatbox",
    price: 1.995,
  },
  {
    id: 7,
    image:
      "/assets/flowers/1Tall-HB-Bianca_5ce33e97-a4cb-453d-8836-78245a42f660_420x.webp",
    title: "Bianca Hatbox",
    price: 1.995,
  },
  {
    id: 8,
    image: "/assets/flowers/Violet-HB_420x.webp",
    title: "Violet Hatbox",
    price: 1.995,
  },
  {
    id: 9,
    image:
      "/assets/flowers/RED365_6c6b0243-9efe-4a1c-9f41-8d97582521bb_420x.webp",
    title: "365 Red Roses",
    price: 3.995,
  },
  {
    id: 10,
    image:
      "/assets/flowers/Red365_37b2d92b-f405-4ec7-b6d5-ab237b5001f1_420x.webp",
    title: "365 Red Roses Hatbox",
    price: 3.995,
  },
  {
    id: 11,
    image: "/assets/flowers/200REDs_420x.webp",
    title: "365 Red Roses Basket",
    price: 3.995,
  },
  {
    id: 12,
    image: "/assets/flowers/red_868e4eae-cb20-4342-836d-c9532a0ec3ac_420x.webp",
    title: "365 Red Roses Stand",
    price: 4.495,
  },
  {
    id: 13,
    image:
      "/assets/flowers/Pink365_84ca3c0d-bf39-40ba-b59a-c753a173be11_420x.webp",
    title: "365 Pink Roses",
    price: 3.995,
  },
  {
    id: 14,
    image:
      "/assets/flowers/Pink365_0b93a36e-79b9-4240-9929-ca42d160126b_420x.webp",
    title: "365 Pink Roses Hatbox",
    price: 3.995,
  },
  {
    id: 15,
    image:
      "/assets/flowers/365Pinks_a06dd531-3b32-4fb5-bfd1-ecb4f0c375cf_420x.webp",
    title: "365 Pink Roses Basket",
    price: 3.995,
  },
  {
    id: 16,
    image:
      "/assets/flowers/Pink_faa911db-f4a2-41c5-89e2-fb81b169eabc_420x.webp",
    title: "365 Pink Roses Stand",
    price: 4.495,
  },
  {
    id: 17,
    image: "/assets/flowers/365HandtiedBlush_420x.webp",
    title: "365 Blush",
    price: 3.995,
  },
  {
    id: 18,
    image:
      "/assets/flowers/Blush365_eaea9ec2-d1ea-4b9a-9503-b7d4c548c180_420x.webp",
    title: "365 Blush Roses Hatbox",
    price: 3.995,
  },
  {
    id: 19,
    image:
      "/assets/flowers/NEW365Whitests_47cda495-2360-4b22-8a05-67cfef40b5ff_420x.webp",
    title: "365 White Roses Basket",
    price: 3.995,
  },
  {
    id: 20,
    image:
      "/assets/flowers/White365_8540f020-e1dd-4ba7-a4c5-af2b9f47bfab_420x.webp",
    title: "365 White Roses Hatbox",
    price: 3.995,
  },
  {
    id: 21,
    image: "/assets/flowers/500White_420x.webp",
    title: "500 Red Roses Basket",
    price: 5.995,
  },
  {
    id: 22,
    image:
      "/assets/flowers/500-PINK_50486bc3-047e-4efd-9f02-d54d1acf8eb4_420x.webp",
    title: "500 Pink Roses Basket",
    price: 5.995,
  },
  {
    id: 23,
    image:
      "/assets/flowers/500-ALL-White_06ee0bf0-b3ea-4d2e-9ae6-53268ac4c436_420x.webp",
    title: "500 White Roses Basket",
    price: 5.995,
  },
  {
    id: 24,
    image: "/assets/flowers/Blush-White_420x.webp",
    title: "500 Blush Roses Basket",
    price: 5.995,
  },
  {
    id: 25,
    image: "/assets/flowers/EDitedTall-HB-Coraline_420x.webp",
    title: "Royale Coraline Hatbox",
    price: 4.995,
  },
  {
    id: 26,
    image:
      "/assets/flowers/Arianna_6f7a7dee-db1b-46a8-9728-7e6574a19e2a_420x.webp",
    title: "Royale Arianna Hatbox",
    price: 4.995,
  },
  {
    id: 27,
    image:
      "/assets/flowers/1Tall-HB-Bianca_5ce33e97-a4cb-453d-8836-78245a42f660_420x.webp",
    title: "Royale Bianca Hatbox",
    price: 4.995,
  },
  {
    id: 28,
    image:
      "/assets/flowers/Tall-HB-Violet_7ead499c-20db-4764-aaa2-40536045a126_420x.webp",
    title: "Royale Violet Hatbox",
    price: 4.995,
  },
  {
    id: 29,
    image: "/assets/flowers/500White_420x.webp",
    title: "500 Red Roses XXL",
    price: 5.995,
  },
  {
    id: 30,
    image:
      "/assets/flowers/500-PINK_50486bc3-047e-4efd-9f02-d54d1acf8eb4_420x.webp",
    title: "500 Pink Roses XXL",
    price: 5.995,
  },
  {
    id: 31,
    image:
      "/assets/flowers/500-ALL-White_06ee0bf0-b3ea-4d2e-9ae6-53268ac4c436_420x.webp",
    title: "500 White Roses XXL",
    price: 5.995,
  },
  {
    id: 32,
    image: "/assets/flowers/Blush-White_420x.webp",
    title: "500 Blush Roses XXL",
    price: 5.995,
  },
  {
    id: 33,
    image:
      "/assets/flowers/999White_4529b7ab-d2a8-4be5-b670-922950f1d4c7_420x.webp",
    title: "999 Red Roses Hatbox",
    price: 11.995,
  },
  {
    id: 34,
    image:
      "/assets/flowers/999WithPodium_404e5341-400f-4a3e-8733-f5991cf716d8_420x.webp",
    title: "999 Red Roses Stand",
    price: 13.995,
  },
  {
    id: 35,
    image:
      "/assets/flowers/Teddy_bf4028b2-fd1c-4868-a1e3-493f446cbd14_420x.webp",
    title: "Teddy",
    price: 16.995,
  },
  {
    id: 36,
    image: "/assets/flowers/NEWWWWWW_420x.webp",
    title: "Labubu",
    price: 34.995,
  },
];

const Main = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState<OrderForm>({
    fullName: "",
    phoneNumber: "",
    deliveryAddress: "",
    deliveryTime: "",
  });
  const [order, setOrder] = useState<OrderData | null>(null);

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

    // Here you would typically send the orderData to your server
    console.log("Order data:", orderData);

    // Reset form and cart if needed
    // setFormData({ fullName: "", phoneNumber: "", deliveryAddress: "", deliveryTime: "" });
    // setCart([]);
  };

  return (
    <main>
      <div className="container">
        <div className={styles.row}>
          {flowers.map((f) => (
            <div key={f.id} className={styles.column}>
              <div className={styles.item}>
                <div className={styles.item__header}>
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
