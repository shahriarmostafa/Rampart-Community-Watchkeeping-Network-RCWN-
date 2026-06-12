"use client";

import { useEffect, useState } from "react";

export function useDisplayMode() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
      setIsStandalone(
        window.matchMedia("(display-mode: standalone)").matches || Boolean(navigatorWithStandalone.standalone),
      );
      setIsResolved(true);
    }, 0);
  }, []);

  return { isResolved, isStandalone };
}
