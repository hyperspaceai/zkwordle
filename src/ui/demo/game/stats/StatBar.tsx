import { Box, Stack } from "@chakra-ui/react";

import type { StatsState } from "@/store/stats";

interface StatBarProps {
  gameStats: StatsState;
}
export const StatBar = ({ gameStats }: StatBarProps) => {
  return (
    <Stack alignItems="center" direction="row" justify="center" my={{ base: 1, md: 2 }} spacing={{ base: 0, md: 4 }}>
      <StatItem label="Total tries" value={gameStats.totalGames} />
      <StatItem label="Success rate" value={`${Math.round(gameStats.successRate * 100)}%`} />
      <StatItem label="Current streak" value={gameStats.currentStreak} />
      <StatItem label="Best streak" value={gameStats.bestStreak} />
    </Stack>
  );
};

const StatItem = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <Box color="white" m={1} textAlign="center" w="25%">
      <Box fontSize={{ base: "lg", md: "3xl" }} fontWeight="bold">
        {value}
      </Box>
      <Box fontSize="xs">{label}</Box>
    </Box>
  );
};
