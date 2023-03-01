import { Box, Flex, Icon, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaGamepad } from "react-icons/fa";

import { useTotalGamesStore } from "@/store/totalGames";

export const GamesPlayed = () => {
  const { amount } = useTotalGamesStore((state) => ({ amount: state.amount }));

  return (
    <Flex justify="end" maxW="8xl" px={{ base: 8 }} w="full">
      <Tooltip label="Total games played" placement="bottom">
        <Flex alignItems="center" gap="2" justify="center">
          <Icon as={FaGamepad} boxSize={{ base: "6", md: "10" }} color="pink.200" />

          <NumberCounter target={amount} />
        </Flex>
      </Tooltip>
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
    <Box display="inline-block" fontSize="xl" fontWeight="bold" position="relative">
      {Math.round(current)}
    </Box>
  );
};

export default NumberCounter;
