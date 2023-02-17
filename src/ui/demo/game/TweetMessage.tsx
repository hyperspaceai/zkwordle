import type { GuessRow } from "@/store/store";
import { NUMBER_OF_GUESSES } from "@/store/store";
import { Button, HStack, Text } from "@chakra-ui/react";
import { BsTwitter } from "react-icons/bs";

const ICON_MAP = {
  0: "⬛",
  1: "🟨",
  2: "🟩",
};

const TweetMessage = ({ guesses }: { guesses: GuessRow[] }) => {
  const results = guesses.map((row) => row.result?.map((result) => ICON_MAP[result]).join(""));
  const tweetMessage = encodeURI(`@HyperspaceOrg wordle 001 ${results.length}/${NUMBER_OF_GUESSES}\n\n${results.join(
    "\n",
  )}\n\nPROOF
  `);

  return (
    <Button
      as="a"
      href={`https://twitter.com/intent/tweet?text=${tweetMessage}`}
      target="_blank"
      size="lg"
      colorScheme="white"
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
