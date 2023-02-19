import {
  Button,
  Divider,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { FaLightbulb } from "react-icons/fa";

import { LetterState } from "@/utils/word";

import CharacterTile from "./CharacterTile";

const HowToPlay = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const notFirstVisit = JSON.parse(localStorage.getItem("notFirstVisit") || "null");
    localStorage.setItem("notFirstVisit", JSON.stringify(true));
    if (!notFirstVisit) btnRef.current?.click();
  }, []);

  return (
    <>
      <Button color="#FAF089" onClick={onOpen} ref={btnRef} size={["xs", "sm", "md"]} variant="ghost">
        <Icon as={FaLightbulb} boxSize={{ base: "6", md: "8" }} />
      </Button>

      <Modal isCentered isOpen={isOpen} motionPreset="slideInBottom" onClose={onClose} size={["sm", "md", "lg"]}>
        <ModalOverlay />
        <ModalContent alignItems="center" textAlign="center">
          <ModalHeader>How To Play</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems="center">
              <Text fontSize="sm">
                Guess the word in 6 tries. After each guess, the color of the tiles will change to show how close your
                guess was to the word.
              </Text>

              <Text fontSize="sm">Type the word with your Keyboard or Keypad, and press ENTER to submit.</Text>
              <Divider />
              <Text fontSize="sm">Examples</Text>
              <HStack>
                <CharacterTile checkingGuess={false} currentIndex={7} index={0} state={LetterState.Match} value="H" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={1} state={undefined} value="E" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={2} state={undefined} value="L" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={3} state={undefined} value="L" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={4} state={undefined} value="O" />
              </HStack>
              <Text fontSize="sm">
                The letter <b>H</b> is in the Wordle and in the correct spot.
              </Text>
              <HStack>
                <CharacterTile checkingGuess={false} currentIndex={7} index={0} state={undefined} value="H" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={1} state={undefined} value="Y" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={2} state={undefined} value="P" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={3} state={undefined} value="E" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={4} state={LetterState.Present} value="R" />
              </HStack>
              <Text fontSize="sm">
                The letter <b>R</b> is in the Wordle but in the wrong spot.
              </Text>
              <HStack>
                <CharacterTile checkingGuess={false} currentIndex={7} index={0} state={undefined} value="S" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={1} state={LetterState.Miss} value="P" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={2} state={undefined} value="A" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={3} state={undefined} value="C" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={4} state={undefined} value="E" />
              </HStack>
              <Text fontSize="sm">
                The letter <b>P</b> is not in the Wordle.
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HowToPlay;
