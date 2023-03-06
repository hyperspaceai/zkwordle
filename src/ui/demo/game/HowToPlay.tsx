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
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FaLightbulb } from "react-icons/fa";

import { LetterState } from "@/utils/word";

import CharacterTile from "./CharacterTile";

const HowToPlay = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (router.pathname !== "/") return;
    const notFirstVisit = JSON.parse(localStorage.getItem("notFirstVisit") || "null") as boolean | null;
    localStorage.setItem("notFirstVisit", JSON.stringify(true));
    if (!notFirstVisit) btnRef.current?.click();
  }, [router.pathname]);

  return (
    <>
      <Button color="#FAF089" onClick={onOpen} ref={btnRef} size={["xs", "sm", "md"]} variant="ghost">
        <Icon as={FaLightbulb} boxSize={{ base: "6", md: "8" }} />
      </Button>

      <Modal isCentered isOpen={isOpen} motionPreset="slideInBottom" onClose={onClose} size={["xs", "md", "lg"]}>
        <ModalOverlay />
        <ModalContent alignItems="center" textAlign={{ base: "left", md: "center" }}>
          <ModalHeader fontSize={{ base: "md", md: "xl" }} pb={{ base: 0, md: 4 }}>
            How To Play
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody mt="0">
            <VStack alignItems="center" mb={{ base: 2, md: 4 }}>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Guess the word in 6 tries. After each guess, the color of the tiles will change to show how close your
                guess was to the word.
              </Text>

              <Text fontSize={{ base: "xs", md: "sm" }}>
                Type the word with your Keyboard or Keypad, and press ENTER to submit.
              </Text>
              <Divider />
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                Examples
              </Text>
              <HStack>
                <CharacterTile
                  checkingGuess={false}
                  currentIndex={7}
                  index={0}
                  proof
                  state={LetterState.Match}
                  value="H"
                />
                <CharacterTile checkingGuess={false} currentIndex={7} index={1} proof state={undefined} value="E" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={2} proof state={undefined} value="L" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={3} proof state={undefined} value="L" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={4} proof state={undefined} value="O" />
              </HStack>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                The letter <b>H</b> is in the Wordle and in the correct spot.
              </Text>
              <HStack>
                <CharacterTile checkingGuess={false} currentIndex={7} index={0} proof state={undefined} value="H" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={1} proof state={undefined} value="Y" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={2} proof state={undefined} value="P" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={3} proof state={undefined} value="E" />
                <CharacterTile
                  checkingGuess={false}
                  currentIndex={7}
                  index={4}
                  proof
                  state={LetterState.Present}
                  value="R"
                />
              </HStack>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                The letter <b>R</b> is in the Wordle but in the wrong spot.
              </Text>
              <HStack>
                <CharacterTile checkingGuess={false} currentIndex={7} index={0} proof state={undefined} value="S" />
                <CharacterTile
                  checkingGuess={false}
                  currentIndex={7}
                  index={1}
                  proof
                  state={LetterState.Miss}
                  value="P"
                />
                <CharacterTile checkingGuess={false} currentIndex={7} index={2} proof state={undefined} value="A" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={3} proof state={undefined} value="C" />
                <CharacterTile checkingGuess={false} currentIndex={7} index={4} proof state={undefined} value="E" />
              </HStack>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                The letter <b>P</b> is not in the Wordle.
              </Text>
              <Divider pt={{ base: "1", md: "2" }} />
              <Text fontSize={{ base: "md", md: "xl" }} fontWeight="semibold">
                Proof Verification
              </Text>
              <Text display={{ base: "none", md: "block" }} fontSize={{ base: "xs", md: "sm" }}>
                In this context, a Zero Knowledge (ZK) proof refers to a proof that demonstrates the occurrence of a
                specific computation. What&apos;s unique about ZK proofs is that you can verify the proof&apos;s
                accuracy without having to re-execute the original computation.
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Once you finish guessing the validity of your guesses and the result you got will be packaged in a
                shareable proof using our ZKWasm runtime which can be verified by anyone in their browser. This let’s
                other people know in a self-verifiable way whether these guesses were actually the ones used by you.
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HowToPlay;
