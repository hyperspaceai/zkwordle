import { Text } from "@chakra-ui/react";
import Link from "next/link";

import { useGameStore } from "@/store/store";

const GameTimers = () => {
  const { validGuess } = useGameStore((s) => ({
    validGuess: s.validGuess,
  }));

  if (!validGuess) return null;
  return (
    <Text fontSize={{ base: "sm", md: "md" }}>
      {/*  eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      Using your guesses, a proof was generated in {validGuess?.proving_time ?? "--"} ms which can be verified via this
      link:{" "}
      <Link href={`/proof/${validGuess.id}`}>
        <Text as="span" fontWeight="bold" ml="1" textColor="brand.primary" textDecoration="underline">
          {validGuess.id}
        </Text>
      </Link>
    </Text>
  );
};
export default GameTimers;
