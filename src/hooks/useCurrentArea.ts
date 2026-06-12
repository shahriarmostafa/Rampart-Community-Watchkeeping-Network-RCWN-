"use client";

import { useAppStore } from "@/store/appStore";

export function useCurrentArea() {
  return useAppStore((state) => ({
    currentArea: state.currentArea,
    setCurrentArea: state.setCurrentArea,
  }));
}
