import type { GameState } from "@/store/store";

import TweetMessage from "./TweetMessage";
import WordRow from "./WordRow";

interface GameModal {
  state: GameState;
  showInvalidGuess: boolean;
}
const GameModal = ({ state, showInvalidGuess }: GameModal) => {
  return (
    <div
      className="absolute bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 border border-blue-600 shadow-xl rounded text-center
            w-11/12  p-6 left-0 right-0 mx-auto top-1/4
           grid grid-rows-3"
    >
      <p className={`text-xl font-bold ${state.gameState === "won" ? " text-emerald-500" : " text-red-500"}`}>
        {state.gameState === "won" ? "Game Won" : "Game Over"}
      </p>
      <WordRow className="items-center justify-items-center" invalidWord={showInvalidGuess} letters={state.answer} />

      <TweetMessage guesses={state.rows} />
    </div>
  );
};
export default GameModal;
