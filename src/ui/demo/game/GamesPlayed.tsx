import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useTotalGamesStore } from "@/store/totalGames";

export const GamesPlayed = () => {
  const { amount } = useTotalGamesStore((state) => ({ amount: state.amount }));

  return (
    <Flex justify="end" maxW="8xl" px={{ base: 8 }} w="full">
      <Flex alignItems="center" gap="2" justify="center">
        <Text>Total Wordles played</Text>
        <NumberCounter target={amount} />
      </Flex>
    </Flex>
  );
};

const NumberCounter = ({ target, time = 500, start = 0 }: { target: number; time?: number; start?: number }) => {
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    const increment = (target - start) / time;
    const handle = setInterval(() => {
      if (current < target) {
        setCurrent(current + increment);
      } else {
        clearInterval(handle);
        setCurrent(target);
      }
    }, 1);

    return () => clearInterval(handle);
  }, [current, start, target, time]);

  return (
    <Box display="inline-block" fontSize="xl" fontWeight="bold" minW="4" position="relative">
      {Math.round(current)}
    </Box>
  );
};

export default NumberCounter;
