import { GameState, useGameStore } from "@/store/store";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  useDisclosure,
  ModalFooter,
  ModalCloseButton,
  Button,
  Divider,
  Flex,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { BsFillBarChartFill } from "react-icons/bs";

import TweetMessage from "./TweetMessage";
import WordRow from "./WordRow";
import Countdown from "react-countdown";
import { calculateResetInterval } from "@/utils/time";
import { useGuess } from "@/hooks/useGuess";

interface GameModal {
  gameState: GameState["gameState"];
  showInvalidGuess: boolean;
  isGameOver: boolean;
}

const timeUntilNextGame = calculateResetInterval();

const GameModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const btnRef = useRef<HTMLButtonElement>(null);
  const { answer, gameState, rows } = useGameStore((s) => ({ answer: s.answer, gameState: s.gameState, rows: s.rows }));
  // const { showInvalidGuess, checkingGuess } = useGuess();
  const isGameOver = gameState !== "playing";
  // Open the modal after render
  useEffect(() => {
    if (isGameOver) {
      onOpen();
    }
  }, [isGameOver, onOpen]);
  return (
    <>
      <Button ref={btnRef} onClick={onOpen} size={["xs", "sm", "md"]} variant="ghost" color={"#fff"}>
        <BsFillBarChartFill />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{gameState === "won" ? "Game Won" : "Game Over"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" mb="4">
            <Text mb={gameState === "lost" ? 1 : 8}>
              {gameState === "won" ? "Nice! Keep up the streaks 👍" : "Too bad! Better luck next time 😊"}
            </Text>
            {gameState === "lost" && <Text mb="8">The word you missed is:</Text>}
            <WordRow currentRow={false} letters={answer} />
          </ModalBody>
          <ModalFooter>
            <Flex w="full" justify="space-between" alignItems="center">
              <Flex w="50%" justify="flex-start">
                <Box>
                  <Heading as="h5" size="sm">
                    New word in
                  </Heading>
                  <Countdown
                    renderer={({ hours, minutes, seconds }) => (
                      <Box as="span" fontSize="2xl" fontWeight="medium" color="gray.100">
                        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
                        {String(seconds).padStart(2, "0")}
                      </Box>
                    )}
                    date={Date.now() + timeUntilNextGame}
                    daysInHours={true}
                  />
                </Box>
              </Flex>
              <Divider orientation="vertical" h="50" />
              <Flex w="50%" justify="flex-end">
                <TweetMessage guesses={rows} />
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default GameModal;
