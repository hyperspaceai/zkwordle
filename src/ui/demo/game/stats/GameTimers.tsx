import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

import { useGameStore } from "@/store/store";

const GameTimers = () => {
  const { validGuess } = useGameStore((s) => ({
    validGuess: s.validGuess,
  }));
  return (
    <>
      <Text fontSize="lg" textAlign="center" textColor="" w="full">
        Proof Id:
        <Link href={`/proof/${validGuess?.id}`}>
          <Text as="span" fontWeight="bold" ml="1" textColor="brand.primary" textDecoration="underline">
            {validGuess?.id}
          </Text>
        </Link>
      </Text>

      <Flex alignItems="center" justify="space-between" w="full">
        <Flex justify="center" w="50%">
          <Box alignItems="center" textAlign="center" w="full">
            <Heading as="h5" size="sm">
              Prove Time
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
    </>
  );
};
export default GameTimers;
