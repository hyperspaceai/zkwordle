import { Heading } from "@chakra-ui/react";

import useStatsStore from "@/store/stats";

import Histogram from "./Histogram";
import { StatBar } from "./StatBar";

interface StatsProps {
  isGameOver: boolean;
}
const Stats = ({ isGameOver }: StatsProps) => {
  const statsStore = useStatsStore();
  return (
    <>
      <Heading as="h4" mb={{ base: 1, md: 4 }} size={{ baseL: "sm", md: "md" }}>
        Statistics
      </Heading>
      <StatBar gameStats={statsStore} />
      <Heading as="h4" mb={{ base: 1, md: 4 }} size="base">
        Guess Distribution
      </Heading>
      <Histogram gameStats={statsStore} isGameWon={isGameOver} />
    </>
  );
};
export default Stats;
