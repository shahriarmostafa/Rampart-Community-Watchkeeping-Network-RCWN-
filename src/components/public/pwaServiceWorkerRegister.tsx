"use client";

import { useEffect } from "react";

export function PwaServiceWorkerRegister() {
  useEffect(() => {
    const pwaDisabledInDev =
      process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_PWA_DEV !== "true";

    if (pwaDisabledInDev) {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Install UI still shows manual instructions when registration is unavailable.
    });
  }, []);

  return null;
}
