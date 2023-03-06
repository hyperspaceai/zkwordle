import { Button, HStack, Text } from "@chakra-ui/react";

import { useGameStore } from "@/store/store";

export const NewGame = ({ close }: { close: () => void }) => {
  const { newGame } = useGameStore((s) => ({ newGame: s.newGame }));

  const handleOnClick = () => {
    newGame();
    close();
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
