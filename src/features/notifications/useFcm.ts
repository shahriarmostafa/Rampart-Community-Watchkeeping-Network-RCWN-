"use client";

import { useEffect, useRef } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase/client";
import { saveFcmToken } from "@/features/users/userService";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export function useFcm(firebaseUid: string | undefined) {
  const registered = useRef(false);

  useEffect(() => {
    if (!firebaseUid || registered.current) return;
    if (!("Notification" in window) || !VAPID_KEY) return;

    registered.current = true;

    void (async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (!token) return;

        await saveFcmToken(firebaseUid, token);

        // Handle foreground messages — show a browser notification
        onMessage(messaging, (payload) => {
          const title = payload.notification?.title ?? "RCWN";
          const body = payload.notification?.body ?? "You have a new safety update.";

          if (Notification.permission === "granted") {
            new Notification(title, {
              body,
              icon: "/icons/icon192.png",
            });
          }
        });
      } catch {
        // Swallow — notifications are a best-effort feature
      }
    })();
  }, [firebaseUid]);
}
