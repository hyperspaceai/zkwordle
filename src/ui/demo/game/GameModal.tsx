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
import { NUMBER_OF_GUESSES } from "@/store/store";
import { useGameStore } from "@/store/store";

import GameComplete from "./GameComplete";
import { NewGame } from "./new-game-button";
import SocialShareOverlay from "./SocialShareButtons";
import GameTimers from "./stats/GameTimers";
import Stats from "./stats/Stats";

const ICON_MAP = {
  0: "⬛",
  1: "🟨",
  2: "🟩",
};

interface GameModal {
  gameState: GameState["gameState"];
  showInvalidGuess: boolean;
  isGameOver: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.zkwordle.com";

const GameModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const btnRef = useRef<HTMLButtonElement>(null);
  const { gameState, rows, validGuess } = useGameStore((s) => ({
    gameState: s.gameState,
    rows: s.rows,
    validGuess: s.validGuess,
  }));
  const isGameOver = gameState !== "playing";
  const results = rows.map((row) => row.result.map((result) => ICON_MAP[result]).join(""));
  const URL = `${BASE_URL}/proof/${validGuess?.id}`;
  const message = `https://www.zkwordle.com built on @HyperspaceOrg ${
    results.length
  }/${NUMBER_OF_GUESSES}\n\n${results.join("\n")}\n\nVerify this game result is valid\n${URL}\n\n`;
  const hashtags = ["zkvm", "nanochain"];

  const emailMessage = `Guess what? I just ${
    gameState === "won" ? "crushed" : "complete"
  } a Wordle game on zkwordle.com,it uses zero-knowledge proof tech, so game results are validated without giving away any extra info!\n\n My game in a nutshell:\n\n${
    results.length
  }/${NUMBER_OF_GUESSES} guesses taken\n\n${results.join(
    "\n",
  )}\n\nWanna check my game's legit? Verify here:\n${URL}\n\nGive ZKWordle a shot and share your results! Can't wait to see how you do.\n\nHappy Wordle-ing! 🚀`;

  const whatsappMessage = `${
    gameState === "won" ? "Crushed" : "Complete"
  } a Wordle game on zkwordle.com with zero-knowledge proof! Check my progress:\n\n${
    results.length
  }/${NUMBER_OF_GUESSES} guesses taken\n\n${results.join(
    "\n",
  )}\n\nVerify its validity:\n${URL}\n\nTry it out & share your results! 🎉`;

  // Open the modal after render
  useEffect(() => {
    if (isGameOver && router.pathname === "/") {
      const openModal = setTimeout(() => {
        onOpen();
      }, 1500);

      return () => clearTimeout(openModal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  <SocialShareOverlay
                    HeaderText="Share proof"
                    content={{ message, hashtags, emailMessage, whatsappMessage }}
                    url={URL}
                  />
                  {/* <TweetMessage /> */}
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
