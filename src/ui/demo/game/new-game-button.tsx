import { Button, HStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useGameStore } from "@/store/store";

export const NewGame = ({ close }: { close: () => void }) => {
  const router = useRouter();
  const { newGame } = useGameStore((s) => ({ newGame: s.newGame }));

  const handleOnClick = () => {
    newGame();
    close();
    if (router.pathname !== "/") {
      router.push("/").catch((e) => console.error(e));
    }
  };
  return (
    <Button
      _hover={{ backgroundColor: "#68D391" }}
      backgroundColor="#9AE6B4"
      borderColor="#9AE6B4"
      onClick={handleOnClick}
      size={{ base: "md", md: "lg" }}
      variant="outline"
    >
      <HStack gap="1">
        <Text color="black">New Game</Text>
      </HStack>
    </Button>
  );
};
