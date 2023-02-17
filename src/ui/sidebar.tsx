import { Box, chakra, Divider, HStack, Link, Spacer, Stack } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { BrandLogo } from "./brand/logo";

export interface SidebarProps {
  title: string;
  children?: ReactNode;
}

export const Sidebar = ({ title, children }: SidebarProps) => {
  return (
    <SidebarContainer role="group">
      <HStack justify="center">
        <BrandLogo boxSize={8} color="brand.primary" />
        <Box fontWeight="bold">{title}</Box>
      </HStack>
      <Divider />
      {children}
      <Spacer />
      <Stack fontSize="sm" spacing={1}>
        <Link href="https://hyperspace.foundation/discord">Discord</Link>
        <Link href="/">Twitter</Link>
        <Link href="https://hyperspace.foundation">Website</Link>
      </Stack>
    </SidebarContainer>
  );
};

const SidebarContainer = chakra("nav", {
  baseStyle: {
    borderRightWidth: 1,
    borderRightColor: "gray.700",
    display: "flex",
    experimental_spaceY: 4,
    flexDir: "column",
    maxW: "300px",
    minW: "300px",
    minH: "100vh",
    p: 4,
    pos: "relative",
    _before: {
      bgColor: "gray.900",
      content: '""',
      inset: 0,
      opacity: 0.9,
      pos: "absolute",
      zIndex: -1,
    },
    "& a": {
      color: "brand.primary",
      _hover: {
        textDecor: "underline",
      },
    },
  },
});
