import wordBank from "./word-bank.json";

export const LETTER_LENGTH = 5;

export enum LetterState {
  Miss,
  Present,
  Match,
}

export const computeGuess = (guess: string, answerString: string): LetterState[] => {
  if (guess.length !== answerString.length) {
    return [];
  }

  const answer = answerString.split("");
  const guessAsArray = guess.split("");
  const result: LetterState[] = [];

  for (let i = 0; i < answer.length; i++) {
    const curAnswerLetter = answer[i];
    const curGuessLetter = guessAsArray[i];

    if (!curGuessLetter) {
      continue;
    }

    if (curAnswerLetter === curGuessLetter) {
      result.push(LetterState.Match);
    } else if (answer.includes(curGuessLetter)) {
      result.push(LetterState.Present);
    } else {
      result.push(LetterState.Miss);
    }
  }

  return result;
};

export const getRandomWord = () => {
  return wordBank.valid[Math.floor(Math.random() * wordBank.valid.length)] as string;
};

export const getTodaysWord = () => {
  // check if its a new day and if so, get a new word
  const todaysWord = localStorage.getItem("todaysWord");
  const todaysWordDate = localStorage.getItem("todaysWordDate");
  const todaysDate = new Date().toUTCString();

  if (todaysWord && todaysWordDate === todaysDate) {
    return todaysWord;
  }

  const newWord = getRandomWord();
  localStorage.setItem("todaysWord", newWord);
  localStorage.setItem("todaysWordDate", todaysDate);
  return newWord;
};

export const isValidWord = (word: string): boolean => {
  return wordBank.valid.concat(wordBank.invalid).includes(word);
};
