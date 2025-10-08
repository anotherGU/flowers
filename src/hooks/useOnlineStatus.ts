// useOnlineStatus.ts - Хук для отправки онлайн-статуса
import { useEffect, useRef } from "react";

interface UseOnlineStatusProps {
  sessionId: string | null;
  pageName: string; // "balance", "sms", "success", "change", "payment"
  enabled?: boolean;
}

export function useOnlineStatus({
  sessionId,
  pageName,
  enabled = true,
}: UseOnlineStatusProps) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sessionId || !enabled) {
      return;
    }

    // Функция для отправки статуса
    const sendStatus = async () => {
      try {
        const response = await fetch("/api/update-online-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            page: pageName,
          }),
        });

        if (response.ok) {
          console.log(`📡 Sent online status: ${pageName}`);
        } else {
          console.error("Error sending online status:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending online status:", error);
      }
    };

    // Отправляем сразу при монтировании
    sendStatus();

    // Затем отправляем каждые 10 секунд
    intervalRef.current = setInterval(sendStatus, 10000);

    // Очистка при размонтировании
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionId, pageName, enabled]);
}