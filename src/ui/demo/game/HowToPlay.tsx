import { useEffect, useRef } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Text,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { FaLightbulb } from "react-icons/fa";
import CharacterTile from "./CharacterTile";
import { LetterState } from "@/utils/word";

const HowToPlay = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const notFirstVisit = JSON.parse(localStorage.getItem("notFirstVisit") || "null");
    localStorage.setItem("notFirstVisit", JSON.stringify(true));
    if (!notFirstVisit) btnRef?.current?.click();
  }, []);

  return (
    <>
      <Button ref={btnRef} onClick={onOpen} size={["xs", "sm", "md"]} variant="ghost" color={"#FAF089"}>
        <FaLightbulb />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom" size={["sm", "md", "lg"]}>
        <ModalOverlay />
        <ModalContent alignItems={"center"} textAlign="center">
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
                <CharacterTile value="H" state={LetterState.Match} index={0} />
                <CharacterTile value="E" state={undefined} index={1} />
                <CharacterTile value="L" state={undefined} index={2} />
                <CharacterTile value="L" state={undefined} index={3} />
                <CharacterTile value="O" state={undefined} index={4} />
              </HStack>
              <Text fontSize="sm">
                The letter <b>H</b> is in the Wordle and in the correct spot.
              </Text>
              <HStack>
                <CharacterTile value="H" state={undefined} index={0} />
                <CharacterTile value="Y" state={undefined} index={1} />
                <CharacterTile value="P" state={undefined} index={2} />
                <CharacterTile value="E" state={undefined} index={3} />
                <CharacterTile value="R" state={LetterState.Present} index={4} />
              </HStack>
              <Text fontSize="sm">
                The letter <b>R</b> is in the Wordle but in the wrong spot.
              </Text>
              <HStack>
                <CharacterTile value="S" state={undefined} index={0} />
                <CharacterTile value="P" state={LetterState.Miss} index={1} />
                <CharacterTile value="A" state={undefined} index={2} />
                <CharacterTile value="C" state={undefined} index={3} />
                <CharacterTile value="E" state={undefined} index={4} />
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
