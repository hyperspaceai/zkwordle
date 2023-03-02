import { Center, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

import { LetterState } from "@/utils/word";

interface CharacterBoxProps {
  value?: string;
  state?: LetterState;
  checkingGuess: boolean;
  currentIndex: number;
  index: number;
  proof?: boolean;
}

// defaultBorderColor = ChakraUI's gray.700
const defaultBorderColor = "#2D3748";

// fontColor = ChakraUI's whitealpha.900 and blackalpha.900
const fontBlack = "RGBA(0, 0, 0, 0.92)";

const CharacterTile = ({ value, state, checkingGuess, index, currentIndex, proof = false }: CharacterBoxProps) => {
  // function mapColor is used to change the default html color for custom hex color
  const mapColor = (letterState: LetterState | undefined) => {
    console.log(letterState);
    switch (letterState) {
      case LetterState.Miss:
        return "#D4D4D8";
      case LetterState.Match:
        return "#9AE6B4";
      case LetterState.Present:
        return "#FAF089";
      default:
        return "#fff";
    }
  };
  const mapHsl = (letterState: LetterState | undefined) => {
    switch (letterState) {
      case LetterState.Miss:
        return "hsl(0 0% 52% / 90%)";
      case LetterState.Match:
        return "hsl(143 29% 50% / 90%)";
      case LetterState.Present:
        return "hsl(60 60% 39% / 90%)";
      default:
        return "hsl(0 0% 52% / 90%)";
    }
  };

  // flip keyframes is used when the user submit a Wordle
  const flip = keyframes`
    0% {
      transform: rotateX(0);
      background-color: white;
      border-color: ${defaultBorderColor};
    }
    45% {
      transform: rotateX(90deg);
      background-color: white;
      border-color: ${defaultBorderColor}
    }
    55% {
      transform: rotateX(90deg);
      background-color: ${mapColor(state)};
      border-color: ${mapColor(state)};
      color: ${fontBlack}; 
    }
    100% {
      transform: rotateX(0);
      background-color: ${mapColor(state)};
      border-color: ${mapColor(state)};
      color: ${fontBlack}
  }`;

  // bounce keyframes is used when user is typing
  const bounce = keyframes`
    0% {
      transform: scale(1);
      
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  `;

  let animation: string | undefined;
  if (index === currentIndex) {
    animation = `${bounce} 0.1s ease`;
  }
  // when user press ENTER, change animation to flip animation
  if (state === LetterState.Miss || state === LetterState.Match || state === LetterState.Present) {
    animation = `${flip} 0.6s ease`;
  }

  // control animation delay, so that the tiles don't animate all at once
  let delay: string | undefined;
  if (checkingGuess) {
    delay = `${0.2 * index}s`;
  }
  return (
    <Center
      animation={animation}
      borderColor="gray.300"
      backgroundColor="white"
      h={[`${proof ? "40" : "50"}px`, "55px", "60px"]}
      sx={{ animationDelay: delay, animationFillMode: "forwards" }} // backgroundColor come from animationFillMode forwards
      userSelect="none"
      w={[`${proof ? "40" : "50"}px`, "55px", "60px"]}
      borderRadius="md"
      boxShadow={`2px 2px 10px 0px hsl(0 5% 52%), inset -4px -4px 8px 1px ${mapHsl(state)}`}
    >
      <Text fontSize="x-large" fontWeight="bold" textColor="black">
        {value?.toUpperCase()}
      </Text>
    </Center>
  );
};
export default CharacterTile;

// animation keyframe for cursor in empty tile
const blink = keyframes`
  0% {
    opacity: 0.1
  }
  50% {
    opacity: 1
  }
  100% {
    opacity: 0.1
  }
`;

export const EmptyTile = ({ showCursor, proof = false }: { showCursor?: boolean; proof?: boolean }) => (
  <Center
    border="1px"
    borderColor="gray.800"
    h={[`${proof ? "40" : "50"}px`, "55px", "60px"]}
    userSelect="none"
    w={[`${proof ? "40" : "50"}px`, "55px", "60px"]}
    borderRadius="md"
    // boxShadow={`1px 1px 8px 0px hsl(0 0% 20%), inset -4px -4px 8px 1px hsl(0 0% 10% / 90%)`}
    // backgroundColor="#323638"
    backgroundColor="#fff"
    boxShadow={`2px 2px 10px 0px hsl(0 5% 52%), inset -3px -4px 8px 1px hsl(0 0% 52% / 90%)`}
  >
    {showCursor && (
      <Text animation={`${blink} 2s infinite ease`} fontSize="x-large">
        _
      </Text>
    )}
  </Center>
);

// rgb(93 101 105) 2px 2px 10px 0px, rgb(24 26 27) -4px -4px 8px 1px inset;
// 2px 2px 10px 0px hsl(0deg 5% 52%), inset -3px -4px 8px 1px hsl(0deg 0% 52% / 90%)
