import { Stack } from "@chakra-ui/react";

import type { StatsState } from "@/store/stats";
import { useGameStore } from "@/store/store";

import { ProgressBar } from "./ProgressBar";

interface HistogramProps {
  gameStats: StatsState;
  isGameWon: boolean;
}

const isCurrentDayStatRow = (isGameWon: boolean, numberOfGuessesMade: number, i: number) => {
  return isGameWon && numberOfGuessesMade === i + 1;
};

const Histogram = ({ gameStats, isGameWon }: HistogramProps) => {
  const winDistribution: number[] = gameStats.winDistribution;
  const maxValue = Math.max(...winDistribution, 1);
  const guesses = useGameStore.getState().rows.length;
  return (
    <Stack color="white" direction="column" fontSize="sm" justify="flex-start" m={2}>
      {winDistribution.map((value, i) => (
        <ProgressBar
          key={Math.round(Math.random() * 100000)}
          index={i}
          isCurrentDayStatRow={isCurrentDayStatRow(isGameWon, guesses, i)}
          label={String(value)}
          size={90 * (value / maxValue)}
        />
      ))}
    </Stack>
  );
};
export default Histogram;
