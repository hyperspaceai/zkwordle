import { Button, Flex, Heading, HStack } from "@chakra-ui/react";
import { BsGlobe } from "react-icons/bs";

import GameModal from "./GameModal";
import HowToPlay from "./HowToPlay";

const NavBar = () => {
  return (
    <Flex alignItems="center" h="6vh" justifyContent="space-between" px={4}>
      <Heading size="lg" userSelect="none">
        zkWordle
      </Heading>
      <HStack>
        <HowToPlay />

        <GameModal />
        <Button
          as="a"
          color="#fff"
          href="https://hyperspace.foundation/"
          size={["xs", "sm", "md"]}
          target="_blank"
          variant="ghost"
        >
          <BsGlobe />
        </Button>
      </HStack>
    </Flex>
  );
};

export default NavBar;
