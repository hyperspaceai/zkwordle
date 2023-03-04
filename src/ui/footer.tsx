import { Box, chakra, Container, Stack, Text, useColorModeValue, VisuallyHidden } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { BsGlobe } from "react-icons/bs";
import { FaDiscord, FaTwitter } from "react-icons/fa";

import { BrandLogo } from "./brand/logo";

const SocialButton = ({ children, label, href }: { children: ReactNode; label: string; href: string }) => {
  return (
    <chakra.button
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
      alignItems="center"
      as="a"
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      cursor="pointer"
      display="inline-flex"
      h={8}
      href={href}
      justifyContent="center"
      rounded="full"
      target="_blank"
      transition="background 0.3s ease"
      w={8}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export const Footer = () => {
  return (
    <Box color={useColorModeValue("gray.700", "gray.200")} display={{ base: "none", md: "inline-flex" }}>
      <Container
        align={{ base: "center", md: "center" }}
        as={Stack}
        direction={{ base: "row" }}
        justify={{ base: "space-between" }}
        maxW="6xl"
        px={{ base: 0, md: 12 }}
        py={{ base: 0, md: 4 }}
        spacing={4}
      >
        <BrandLogo boxSize={8} color="brand.primary" />
        <Text fontSize={{ base: "xs", md: "lg" }}>© 2023 Hyperspace Inc.</Text>
        <Stack direction="row" spacing={{ base: 2, md: 6 }}>
          <SocialButton href="https://discord.com/invite/FVVN6HJcdv" label="Discord">
            <FaDiscord />
          </SocialButton>
          <SocialButton href="https://twitter.com/hyperspaceorg/" label="Twitter">
            <FaTwitter />
          </SocialButton>
          <SocialButton href="https://hyperspace.foundation/" label="Website">
            <BsGlobe />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
};
