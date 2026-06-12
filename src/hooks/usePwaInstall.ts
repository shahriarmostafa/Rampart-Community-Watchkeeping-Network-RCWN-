"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "ios" | "android" | "desktop" | "unknown";

function getPlatform(): Platform {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIos =
    /iphone|ipad|ipod/.test(userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

  if (isIos) {
    return "ios";
  }

  if (/android/.test(userAgent)) {
    return "android";
  }

  if (/windows|macintosh|linux|cros/.test(userAgent)) {
    return "desktop";
  }

  return "unknown";
}

function isStandaloneDisplay() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return window.matchMedia("(display-mode: standalone)").matches || Boolean(navigatorWithStandalone.standalone);
}

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [isInstalled, setIsInstalled] = useState(false);
  const [message, setMessage] = useState("Install RCWN to unlock the app-like mobile experience.");

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setMessage("Your browser is ready to install RCWN.");
    };

    const onAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setMessage("RCWN is installed. Open it from your home screen or app launcher.");
    };

    window.setTimeout(() => {
      setPlatform(getPlatform());
      setIsInstalled(isStandaloneDisplay());
    }, 0);

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const manualInstructions = useMemo(() => {
    if (platform === "ios") {
      return "On iPhone or iPad, open Safari, tap Share, then choose Add to Home Screen.";
    }

    if (platform === "android") {
      return "On Android, open Chrome or Edge, tap the browser menu, then choose Install App or Add to Home Screen.";
    }

    if (platform === "desktop") {
      return "On desktop Chrome or Edge, use the install icon in the address bar or the browser menu.";
    }

    return "Use a modern browser menu and choose Install App or Add to Home Screen if available.";
  }, [platform]);

  const install = useCallback(async () => {
    if (isInstalled) {
      setMessage("RCWN is already installed on this device.");
      return;
    }

    if (!installPrompt) {
      setMessage(manualInstructions);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);

    if (choice.outcome === "accepted") {
      setMessage("RCWN install started. Finish the prompt to add it to your device.");
      return;
    }

    setMessage("Install was dismissed. You can try again from the browser menu.");
  }, [installPrompt, isInstalled, manualInstructions]);

  return {
    canPromptInstall: Boolean(installPrompt),
    install,
    isInstalled,
    manualInstructions,
    message,
    platform,
  };
}
