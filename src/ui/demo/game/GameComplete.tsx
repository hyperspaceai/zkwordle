import { Box, Heading, Text } from "@chakra-ui/react";

import { useGameStore } from "@/store/store";

import WordRow from "./WordRow";

const GameComplete = ({ isGameOver }: { isGameOver: boolean }) => {
  const { answer, gameState } = useGameStore((s) => ({ answer: s.answer, gameState: s.gameState }));

  if (!isGameOver) return null;
  return (
    <Box mb="4" w="full">
      <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} my={{ base: "0", md: "2" }}>
        {gameState === "won" ? "Game Won" : "Game Over"}
      </Heading>
      <Text mb={{ base: `${gameState === "lost" ? 0 : 1}`, md: `${gameState === "lost" ? 1 : 4}` }}>
        {gameState === "won" ? "Nice! Keep up the streaks 👍" : "Too bad! Better luck next time 😊"}
      </Text>
      {gameState === "lost" && <Text mb={{ base: 1, md: 4 }}>The word you missed is:</Text>}
      <WordRow checkingGuess={false} currentRow={false} letters={answer} proof />
    </Box>
  );
};
export default GameComplete;
