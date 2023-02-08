import { GameState } from '@/store/store';
import { Dispatch, SetStateAction } from 'react';
import TweetMessage from './TweetMessage';
import WordRow from './WordRow';

type Props = {
  state: GameState;
  showInvalidGuess: boolean;
  setGuess: (string: string) => Dispatch<SetStateAction<string>>;
};
const GameModal = ({ state, showInvalidGuess, setGuess }: Props) => {
  return (
    <div
      role="modal"
      className="absolute bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 border border-blue-600 shadow-xl rounded text-center
            w-11/12  p-6 left-0 right-0 mx-auto top-1/4
           grid grid-rows-3"
    >
      <p
        className={`text-xl font-bold ${
          state.gameState === 'won' ? ' text-emerald-500' : ' text-red-500'
        }`}
      >
        {state.gameState === 'won' ? 'Game Won' : 'Game Over'}
      </p>
      <WordRow
        letters={state.answer}
        className="items-center justify-items-center"
        invalidWord={showInvalidGuess}
      />
      <button
        className="border border-emerald-500 rounded bg-emerald-500 p-2 mt-4 text-white shadow"
        onClick={() => {
          state.newGame();
          setGuess('');
        }}
      >
        New Game
      </button>
      <TweetMessage guesses={state.rows} />
    </div>
  );
};
export default GameModal;
