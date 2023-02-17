import { Flex, Heading, Button, HStack } from "@chakra-ui/react";
import { BsGlobe } from "react-icons/bs";
import GameModal from "./GameModal";
import HowToPlay from "./HowToPlay";

const NavBar = () => {
  return (
    <Flex alignItems="center" justifyContent="space-between" h="10vh" px={4}>
      <Heading size="lg" userSelect="none">
        zkWordle
      </Heading>
      <HStack>
        <HowToPlay />

        <GameModal />
        <Button
          as="a"
          href="https://hyperspace.foundation/"
          target="_blank"
          size={["xs", "sm", "md"]}
          variant="ghost"
          color={"#fff"}
        >
          <BsGlobe />
        </Button>
      </HStack>
    </Flex>
  );
};

export default NavBar;
