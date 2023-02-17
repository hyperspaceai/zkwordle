import { LetterState } from "@/utils/word";
import { Center, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

interface CharacterBoxProps {
  value?: string;
  state?: LetterState;
  index: number;
}

// defaultBorderColor = ChakraUI's gray.700
const defaultBorderColor = "#2D3748";

// fontColor = ChakraUI's whitealpha.900 and blackalpha.900
const fontWhite = "RGBA(255, 255, 255, 0.92)";
const fontBlack = "RGBA(0, 0, 0, 0.92)";

const CharacterTile = ({ value, state, index }: CharacterBoxProps) => {
  // function mapColor is used to change the default html color for custom hex color
  const mapColor = (state: LetterState | undefined) => {
    if (state === undefined) {
      return "transparent";
    }
    if (state === LetterState.Miss) {
      return "#D4D4D8";
    }
    if (state === LetterState.Match) {
      return "#9AE6B4";
    }
    if (state === LetterState.Present) {
      return "#FAF089";
    }
    return "#fff";
  };

  // flip keyframes is used when the user submit a Wordle
  const flip = keyframes`
    0% {
      transform: rotateX(0);
      background-color: transparent;
      border-color: ${defaultBorderColor};
    }
    45% {
      transform: rotateX(90deg);
      background-color: transparent;
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
      border-color: ${defaultBorderColor}
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      border-color: gray
    }
  `;

  let animation = `${bounce} 0.1s ease`;
  // when user press ENTER, change animation to flip animation
  if (state === LetterState.Miss || state === LetterState.Match || state === LetterState.Present) {
    animation = `${flip} 0.6s ease`;
  }

  // control animation delay, so that the tiles don't animate all at once
  let delay = `${0.2 * index}s`;

  return (
    <Center
      w={["50px", "55px", "60px"]}
      h={["50px", "55px", "60px"]}
      border="1px"
      borderColor="gray.700"
      animation={animation}
      userSelect="none"
      sx={{ animationDelay: delay, animationFillMode: "forwards" }} // backgroundColor come from animationFillMode forwards
    >
      <Text fontWeight="bold" fontSize="x-large">
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

export const EmptyTile = ({ showCursor }: { showCursor?: boolean }) => (
  <Center
    w={["50px", "55px", "60px"]}
    h={["50px", "55px", "60px"]}
    border="1px"
    borderColor={defaultBorderColor}
    userSelect="none"
  >
    {showCursor && (
      <Text fontSize="x-large" animation={`${blink} 2s infinite ease`}>
        _
      </Text>
    )}
  </Center>
);
