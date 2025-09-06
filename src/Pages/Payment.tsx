// Payment.tsx
import styles from "./Payment.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      setPaymentData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
      setPaymentData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 3);
      setPaymentData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !paymentData.cardNumber ||
      !paymentData.cardHolder ||
      !paymentData.expiryDate ||
      !paymentData.cvv
    ) {
      alert("Please fill in all payment details");
      return;
    }

    if (paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }

    console.log("Payment data:", paymentData);
    navigate("/");
  };

  return (
    <div className={styles.payment__container}>
      <div className="container">
        <div className={styles.payment__wrapper}>
          <div className={styles.payment__header}>
            <h2>Payment Information</h2>
            <p>Complete your order by providing your payment details</p>
          </div>

          <div className={styles.payment__content}>
            <div className={styles.payment__form}>
              <form onSubmit={handleSubmit}>
                <div className={styles.input__block}>
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>

                <div className={styles.input__block}>
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={paymentData.cardHolder}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className={styles.form__row}>
                  <div className={styles.input__block}>
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className={styles.input__block}>
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className={styles.payment__total}></div>

                <div className={styles.payment__buttons}>
                  <button type="submit" className={styles.pay__btn}>
                    Pay Now
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.payment__security}>
              <div className={styles.security__info}>
                <h4>Secure Payment</h4>
                <p>Your payment information is encrypted and secure.</p>
                <div className={styles.security__badges}>
                  <span>🔒 SSL Secure</span>
                  <span>💳 PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
