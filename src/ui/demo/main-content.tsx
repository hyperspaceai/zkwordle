import type { BoxProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

import Board from "./game/Board";
import NavBar from "./game/Navbar";
export const MainContent = (props: BoxProps) => {
  // const state = useGameStore();

  return (
    <>
      <Flex
        _before={{
          bgColor: "gray.900",
          content: '""',
          inset: 0,
          opacity: 0.9,
          pos: "absolute",
          rounded: "inherit",
          zIndex: -1,
        }}
        borderColor="gray.700"
        borderWidth={1}
        flexDir="column"
        pos="relative"
        rounded="xl"
        {...props}
      >
        <NavBar />
        <Board />
      </Flex>
    </>
  );
};
