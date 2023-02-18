import { Box, Divider, Flex, Heading } from "@chakra-ui/react";

import { useGameStore } from "@/store/store";

const GameTimers = () => {
  const { validGuess } = useGameStore((s) => ({
    validGuess: s.validGuess,
  }));
  return (
    <Flex alignItems="center" justify="space-between" w="full">
      <Flex justify="center" w="50%">
        <Box alignItems="center" textAlign="center" w="full">
          <Heading as="h5" size="sm">
            Proof Time
          </Heading>
          <Box as="span" color="gray.100">
            <Box as="span" color="gray.100" fontSize="2xl" fontWeight="bold">
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              {validGuess?.proving_time ?? "--"}
            </Box>
            <Box as="span" color="gray.300" fontSize="md" ml="1">
              ms
            </Box>
          </Box>
        </Box>
      </Flex>
      <Divider h="50" orientation="vertical" />
      <Flex alignItems="center" justify="center" w="50%">
        <Box alignItems="center" textAlign="center" w="full">
          <Heading as="h5" size="sm">
            Execution Time
          </Heading>
          <Box as="span" color="gray.100">
            <Box as="span" color="gray.100" fontSize="2xl" fontWeight="bold">
              {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
              {validGuess?.execution_time ?? "--"}
            </Box>
            <Box as="span" color="gray.300" fontSize="md" ml="1">
              ms
            </Box>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};
export default GameTimers;
