import type { GuessRow } from "@/store/store";
import { NUMBER_OF_GUESSES } from "@/store/store";

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
    <a
      className="p-2 bg-red-200 rounded mt-4 hover:bg-red-400"
      href={`https://twitter.com/intent/tweet?text=${tweetMessage}`}
      rel="noreferrer"
      target="_blank"
    >
      Tweet
    </a>
  );
};
export default TweetMessage;
