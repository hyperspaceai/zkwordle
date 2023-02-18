import { Heading } from "@chakra-ui/react";

import Histogram from "./Histogram";
import { StatBar } from "./StatBar";

export interface GameStats {
  winDistribution: number[];
  gamesFailed: number;
  currentStreak: number;
  bestStreak: number;
  totalGames: number;
  successRate: number;
}

const mockGameStats: GameStats = {
  winDistribution: [1, 3, 0, 3, 0, 2],
  gamesFailed: 1,
  currentStreak: 2,
  bestStreak: 3,
  totalGames: 10,
  successRate: 60,
};

interface StatsProps {
  isGameOver: boolean;
}
const Stats = ({ isGameOver }: StatsProps) => {
  return (
    <>
      <Heading as="h4" mb={4} size="md">
        Statistics
      </Heading>
      <StatBar gameStats={mockGameStats} />
      <Heading as="h4" mb={4} size="base">
        Guess Distribution
      </Heading>
      <Histogram gameStats={mockGameStats} isGameWon={isGameOver} numberOfGuessesMade={1} />
    </>
  );
};
export default Stats;
