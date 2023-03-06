import {
  Button,
  Divider,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { BsFillBarChartFill } from "react-icons/bs";

import type { GameState } from "@/store/store";
import { useGameStore } from "@/store/store";

import GameComplete from "./GameComplete";
import { NewGame } from "./new-game-button";
import GameTimers from "./stats/GameTimers";
import Stats from "./stats/Stats";
import TweetMessage from "./TweetMessage";

interface GameModal {
  gameState: GameState["gameState"];
  showInvalidGuess: boolean;
  isGameOver: boolean;
}

const GameModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const btnRef = useRef<HTMLButtonElement>(null);
  const { gameState } = useGameStore((s) => ({
    gameState: s.gameState,
  }));
  const isGameOver = gameState !== "playing";

  // Open the modal after render
  useEffect(() => {
    if (isGameOver && router.pathname === "/") {
      const openModal = setTimeout(() => {
        onOpen();
      }, 1500);

      return () => clearTimeout(openModal);
    }
  }, [isGameOver, onOpen]);
  return (
    <>
      <Button color="#fff" onClick={onOpen} ref={btnRef} size={["xs", "sm", "md"]} variant="ghost">
        <Icon as={BsFillBarChartFill} boxSize={{ base: "6", md: "8" }} />
      </Button>

      <Modal isCentered isOpen={isOpen} motionPreset="slideInBottom" onClose={onClose} size={["sm", "md", "lg"]}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <GameComplete isGameOver={isGameOver} />
            <Stats isGameOver={isGameOver} />
          </ModalBody>
          <ModalFooter>
            <Flex direction="column" gap="4" w="full">
              {isGameOver ? (
                <>
                  <GameTimers />
                  <Divider />
                </>
              ) : null}

              <Flex alignItems="center" justify="space-between" w="full">
                <Flex justify="flex-start" w="50%">
                  <NewGame close={onClose} />
                </Flex>
                <Divider h="50" orientation="vertical" />
                <Flex justify="flex-end" w="50%">
                  <TweetMessage />
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
