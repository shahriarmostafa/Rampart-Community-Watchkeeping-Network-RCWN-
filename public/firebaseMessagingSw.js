importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js");

// Fetch Firebase config from the Next.js API route so we don't hardcode secrets in the SW file.
async function initFirebase() {
  try {
    const response = await fetch("/api/firebase-sw-config");
    const config = await response.json();

    if (!config.apiKey) return; // Firebase not configured in this environment

    firebase.initializeApp(config);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      self.registration.showNotification(payload.notification?.title ?? "RCWN", {
        body: payload.notification?.body ?? "You have a new safety update.",
        icon: "/icons/icon192.png",
        badge: "/icons/icon192.png",
      });
    });
  } catch {
    // Fail silently — push notifications are best-effort
  }
}

self.addEventListener("install", () => {
  void initFirebase();
});
