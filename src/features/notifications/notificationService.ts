import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase/client";

export async function requestNotificationToken() {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    return null;
  }

  return getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });
}
