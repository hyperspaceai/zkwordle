import { Box, Flex, HStack, Link, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import NextLink from "next/link";

import { BrandLogo } from "@/ui/brand/logo";

import GameModal from "./GameModal";
import HowToPlay from "./HowToPlay";

export const Navbar = () => {
  return (
    <Box>
      <Flex
        align="center"
        borderBottom={1}
        borderColor="gray.600"
        borderStyle="solid"
        color="white"
        minH="60px"
        px={{ base: 4 }}
        py={{ base: 2, md: 4 }}
        shadow="md"
      >
        <Flex flex={{ base: 1 }} justify={{ md: "start" }}>
          <Link as={NextLink} href="/">
            <HStack justify="center">
              <BrandLogo boxSize={8} color="brand.primary" />
              <Text fontWeight="bold" textAlign={useBreakpointValue({ md: "left" })}>
                ZK-Wordle
              </Text>
            </HStack>
          </Link>
        </Flex>

        <Stack direction="row" flex={{ base: 1, md: 0 }} justify="flex-end" spacing={{ base: 1, md: 6 }}>
          <HowToPlay />

          <GameModal />
        </Stack>
      </Flex>
    </Box>
  );
};

interface SocialItem {
  label: string;
  href?: string;
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    label: "Discord",
    href: "https://discord.gg/2cFmDz7",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/ZK_WASM",
  },
  {
    label: "Website",
    href: "https://twitter.com/ZK_WASM",
  },
];
