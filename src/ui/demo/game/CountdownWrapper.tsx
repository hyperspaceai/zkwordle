import { Box, Flex, Heading } from "@chakra-ui/react";
import Countdown from "react-countdown";

import { calculateResetInterval } from "@/utils/time";

const timeUntilNextGame = calculateResetInterval();

const CountdownWrapper = () => {
  return (
    <Flex justify="flex-start" w="50%">
      <Box>
        <Heading as="h5" size="sm">
          New word in
        </Heading>
        <Countdown
          date={Date.now() + timeUntilNextGame}
          daysInHours
          renderer={({ hours, minutes, seconds }) => (
            <Box as="span" color="gray.100" fontSize="2xl" fontWeight="medium">
              {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </Box>
          )}
        />
      </Box>
    </Flex>
  );
};
export default CountdownWrapper;
