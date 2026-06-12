"use client";

import { useCallback, useState } from "react";
import { requestNotificationToken } from "@/features/notifications/notificationService";

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return null;
    }

    const nextToken = await requestNotificationToken();
    setToken(nextToken);
    return nextToken;
  }, []);

  return { token, requestPermission };
}
