import { Button, HStack, Text } from "@chakra-ui/react";
import { BsTwitter } from "react-icons/bs";

import { NUMBER_OF_GUESSES, useGameStore } from "@/store/store";

const ICON_MAP = {
  0: "⬛",
  1: "🟨",
  2: "🟩",
};

const TweetMessage = () => {
  const { gameState, rows, gameId, validGuess } = useGameStore((s) => ({
    gameId: s.gameId,
    gameState: s.gameState,
    rows: s.rows,
    validGuess: s.validGuess,
  }));
  const isGameOver = gameState !== "playing";
  const results = rows.map((row) => row.result.map((result) => ICON_MAP[result]).join(""));
  const URL = process.env.NEXT_PUBLIC_BASE_URL;
  const tweetMessage = encodeURI(
    `zkWordle.com Built on @HyperspaceOrg ${String(gameId).padStart(4, "0")} ${
      results.length
    }/${NUMBER_OF_GUESSES}\n\n${results.join("\n")}\n\nVerify this game result is valid\n${URL}/proof/${
      validGuess?.id
    }\n\n`,
  );

  if (!isGameOver) {
    return (
      <Button
        as="button"
        colorScheme="white"
        isDisabled={!isGameOver}
        size={{ base: "md", md: "lg" }}
        variant="outline"
      >
        <HStack gap="1">
          <BsTwitter color="#00acee" />
          <Text>Share</Text>
        </HStack>
      </Button>
    );
  }

  return (
    <Button
      as="a"
      colorScheme="white"
      href={`https://twitter.com/intent/tweet?text=${tweetMessage.trimEnd()}&hashtags=zkvm,nanochain`}
      size={{ base: "md", md: "lg" }}
      target="_blank"
      variant="outline"
    >
      <HStack gap="1">
        <BsTwitter color="#00acee" />
        <Text>Share</Text>
      </HStack>
    </Button>
  );
};
export default TweetMessage;
