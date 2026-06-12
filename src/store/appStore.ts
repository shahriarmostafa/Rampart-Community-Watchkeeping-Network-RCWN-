import { create } from "zustand";

type AppState = {
  currentArea: string | null;
  setCurrentArea: (area: string | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  currentArea: null,
  setCurrentArea: (currentArea) => set({ currentArea }),
}));
