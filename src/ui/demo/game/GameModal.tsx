import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import Countdown from "react-countdown";
import { BsFillBarChartFill } from "react-icons/bs";

import type { GameState } from "@/store/store";
import { useGameStore } from "@/store/store";
import { calculateResetInterval } from "@/utils/time";

import TweetMessage from "./TweetMessage";
import WordRow from "./WordRow";

interface GameModal {
  gameState: GameState["gameState"];
  showInvalidGuess: boolean;
  isGameOver: boolean;
}

const timeUntilNextGame = calculateResetInterval();

const GameModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = useRef<HTMLButtonElement>(null);
  const { answer, gameState, rows, validGuess } = useGameStore((s) => ({
    answer: s.answer,
    gameState: s.gameState,
    rows: s.rows,
    validGuess: s.validGuess,
  }));
  const isGameOver = gameState !== "playing";
  // Open the modal after render
  useEffect(() => {
    if (isGameOver) {
      onOpen();
    }
  }, [isGameOver, onOpen]);
  return (
    <>
      <Button color="#fff" onClick={onOpen} ref={btnRef} size={["xs", "sm", "md"]} variant="ghost">
        <BsFillBarChartFill />
      </Button>
      <Modal isCentered isOpen={isOpen} motionPreset="slideInBottom" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{gameState === "won" ? "Game Won" : "Game Over"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb="4" textAlign="center">
            <Text mb={gameState === "lost" ? 1 : 8}>
              {gameState === "won" ? "Nice! Keep up the streaks 👍" : "Too bad! Better luck next time 😊"}
            </Text>
            {gameState === "lost" && <Text mb="8">The word you missed is:</Text>}
            <WordRow checkingGuess={false} currentRow={false} letters={answer} />
          </ModalBody>
          <ModalFooter>
            <Flex direction="column" gap="4" w="full">
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
              <Divider />
              <Flex alignItems="center" justify="space-between" w="full">
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
                          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
                          {String(seconds).padStart(2, "0")}
                        </Box>
                      )}
                    />
                  </Box>
                </Flex>
                <Divider h="50" orientation="vertical" />
                <Flex justify="flex-end" w="50%">
                  <TweetMessage guesses={rows} />
                </Flex>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default GameModal;
