import type { FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";

export interface LayoutProps extends FlexProps {
  sidebar?: ReactNode;
}

export const Layout = ({ sidebar, ...rest }: LayoutProps) => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setHeight(window.innerHeight);
  }, []);

  return (
    <Flex as="main" h={{ base: `${height}`, md: "vh100" }}>
      {sidebar}
      <Flex flexDir="column" flexGrow={1} {...rest} />
    </Flex>
  );
};
