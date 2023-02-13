import { getRandomWord } from "../../src/utils/word";

export const generateWords = (amount: number): { gameId: number; word: string; playDay: Date }[] => {
  let gameStart = 0;
  const todayDate = new Date().getDate();
  const data = Array.from({ length: amount }).map(() => {
    const date = new Date().setDate(todayDate + gameStart);
    const wordData = {
      gameId: gameStart + 1,
      word: getRandomWord(),
      playDay: new Date(date),
    };
    gameStart += 1;

    return wordData;
  });

  return data;
};
