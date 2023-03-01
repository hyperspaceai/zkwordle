import type { FlexProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

import { useIntervalAsync } from "@/hooks/useIntervalAsync";
import { useTotalGamesStore } from "@/store/totalGames";

export interface LayoutProps extends FlexProps {
  sidebar?: ReactNode;
}

export const Layout = ({ sidebar, ...rest }: LayoutProps) => {
  const [height, setHeight] = useState(0);
  const { updateGameTotal } = useTotalGamesStore((state) => ({ updateGameTotal: state.updateGameTotal }));

  const totalGames = useCallback(async () => {
    const response = await fetch("/api/gamesPlayed");
    const data = (await response.json()) as { totalGames: number };
    if (data.totalGames) updateGameTotal(data.totalGames);
    return data.totalGames;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useIntervalAsync(totalGames, 60000);

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
