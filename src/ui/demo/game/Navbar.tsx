import { Button, Flex, HStack, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsGlobe } from "react-icons/bs";
import { FaDiscord, FaTwitter } from "react-icons/fa";

import GameModal from "./GameModal";
import HowToPlay from "./HowToPlay";

const NavBar = () => {
  const router = useRouter();
  return (
    <Flex alignItems="center" h="6vh" justifyContent="space-between" px={4}>
      <HStack>
        <Button
          as="a"
          color="#738adb"
          href="https://discord.com/invite/FVVN6HJcdv"
          size={["xs", "sm", "md"]}
          target="_blank"
          variant="ghost"
        >
          <Icon as={FaDiscord} boxSize={{ base: "6", md: "8" }} />
        </Button>
        <Button
          as="a"
          color="#00acee"
          href="https://hyperspace.foundation/"
          size={["xs", "sm", "md"]}
          target="_blank"
          variant="ghost"
        >
          <Icon as={FaTwitter} boxSize={{ base: "6", md: "8" }} />
        </Button>
        <Button
          as="a"
          color="brand.primary"
          href="https://hyperspace.foundation/"
          size={["xs", "sm", "md"]}
          target="_blank"
          variant="ghost"
        >
          <Icon as={BsGlobe} boxSize={{ base: "6", md: "8" }} />
        </Button>
      </HStack>
      {router.pathname === "/" && (
        <HStack>
          <HowToPlay />

          <GameModal />
        </HStack>
      )}
    </Flex>
  );
};

export default NavBar;
