import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useGameStore } from "@/store/store";

export interface StatsState {
  winDistribution: number[];
  gamesFailed: number;
  currentStreak: number;
  bestStreak: number;
  totalGames: number;
  successRate: number;
  updateStats: (didWin: boolean) => void;
}

const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      winDistribution: [0, 0, 0, 0, 0, 0],
      gamesFailed: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalGames: 0,
      successRate: 0,
      updateStats: (didWin: boolean) =>
        set((state) => {
          const newState = { ...state };
          const guesses = useGameStore.getState().rows.length;
          if (didWin) {
            newState.winDistribution[guesses - 1]++;
            newState.currentStreak++;
            newState.bestStreak = Math.max(newState.currentStreak, newState.bestStreak);
            newState.totalGames++;
            newState.successRate = newState.totalGames / (newState.totalGames + newState.gamesFailed);
          } else {
            newState.currentStreak = 0;
            newState.gamesFailed++;
            newState.totalGames++;
            newState.successRate = newState.totalGames / (newState.totalGames + newState.gamesFailed);
          }
          return newState;
        }),
    }),
    { name: "zkWordleStats" },
  ),
);

export default useStatsStore;
