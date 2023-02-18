import { Stack } from "@chakra-ui/react";

import { ProgressBar } from "./ProgressBar";
import type { GameStats } from "./Stats";

interface HistogramProps {
  gameStats: GameStats;
  isGameWon: boolean;
  numberOfGuessesMade: number;
}

const isCurrentDayStatRow = (isGameWon: boolean, numberOfGuessesMade: number, i: number) => {
  return isGameWon && numberOfGuessesMade === i + 1;
};

const Histogram = ({ gameStats, isGameWon, numberOfGuessesMade }: HistogramProps) => {
  const winDistribution: number[] = gameStats.winDistribution;
  const maxValue = Math.max(...winDistribution, 1);
  return (
    <Stack color="white" direction="column" fontSize="sm" justify="flex-start" m={2}>
      {winDistribution.map((value, i) => (
        <ProgressBar
          key={Math.round(Math.random() * 100000)}
          index={i}
          isCurrentDayStatRow={isCurrentDayStatRow(isGameWon, numberOfGuessesMade, i)}
          label={String(value)}
          size={90 * (value / maxValue)}
        />
      ))}
    </Stack>
  );
};
export default Histogram;
