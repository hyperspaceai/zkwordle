import type { FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface LayoutProps extends FlexProps {
  sidebar?: ReactNode;
}

export const Layout = ({ sidebar, ...rest }: LayoutProps) => {
  return (
    <Flex as="main" minH="100vh">
      {sidebar}
      <Flex align="stretch" flexDir="column" flexGrow={1} pos="relative" {...rest} />
    </Flex>
  );
};
