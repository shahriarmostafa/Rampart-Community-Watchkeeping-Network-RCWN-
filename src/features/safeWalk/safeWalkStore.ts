import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RiskLevel, SafeWalkSession, SafeWalkShareWith } from "@/types/safeWalk";

type SafeWalkState = {
  activeSession: SafeWalkSession | null;
  shareWith: SafeWalkShareWith;
  currentLocation: { lat: number; lng: number } | null;

  setActiveSession: (session: SafeWalkSession | null) => void;
  updateShareWith: (patch: Partial<SafeWalkShareWith>) => void;
  setCurrentLocation: (location: { lat: number; lng: number }) => void;
  setRiskLevel: (level: RiskLevel) => void;
  clearSession: () => void;
};

export const useSafeWalkStore = create<SafeWalkState>()(
  persist(
    (set) => ({
      activeSession: null,
      shareWith: { circle: true, watchers: true, femaleOnly: false },
      currentLocation: null,

      setActiveSession: (session) => set({ activeSession: session }),

      updateShareWith: (patch) =>
        set((state) => ({ shareWith: { ...state.shareWith, ...patch } })),

      setCurrentLocation: (location) => set({ currentLocation: location }),

      setRiskLevel: (level) =>
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, riskLevel: level }
            : null,
        })),

      clearSession: () => set({ activeSession: null, currentLocation: null }),
    }),
    {
      name: "rcwn-safewalk",
      partialize: (state) => ({
        activeSession: state.activeSession,
        shareWith: state.shareWith,
      }),
    },
  ),
);

// Backward-compat alias used by src/store/safeWalkStore.ts
export { useSafeWalkStore as useSafeWalkFeatureStore };
