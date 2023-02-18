import { Button, HStack, Text } from "@chakra-ui/react";
import { BsTwitter } from "react-icons/bs";

import type { GuessRow } from "@/store/store";
import { NUMBER_OF_GUESSES } from "@/store/store";

const ICON_MAP = {
  0: "⬛",
  1: "🟨",
  2: "🟩",
};

const TweetMessage = ({ guesses, isGameOver }: { guesses: GuessRow[]; isGameOver: boolean }) => {
  const results = guesses.map((row) => row.result.map((result) => ICON_MAP[result]).join(""));
  const tweetMessage = encodeURI(`@HyperspaceOrg wordle 001 ${results.length}/${NUMBER_OF_GUESSES}\n\n${results.join(
    "\n",
  )}\n\nPROOF
  `);

  if (!isGameOver) {
    return (
      <Button as="button" colorScheme="white" isDisabled={!isGameOver} size="lg" variant="outline">
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
      href={`https://twitter.com/intent/tweet?text=${tweetMessage}`}
      size="lg"
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
