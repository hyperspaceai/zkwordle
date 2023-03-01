import { create } from "zustand";

export interface TotalGamesState {
  amount: number;
  updateGameTotal: (value: number) => void;
}

export const useTotalGamesStore = create<TotalGamesState>((set) => ({
  amount: 0,
  updateGameTotal: (value: number) => set({ amount: value }),
}));
