import { Box, Button, Divider, Flex, Heading, Icon, Text, useToast, VStack } from "@chakra-ui/react";
import type { Proof } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";

import useWorker from "@/hooks/useWorker";
import type { GuessRow } from "@/store/store";
import { GUESS_LENGTH } from "@/store/store";
import { computeGuess } from "@/utils/word";

import { BrandLogo } from "../brand/logo";
import WordRow from "./game/WordRow";

interface VerifyProof {
  result: boolean;
  time_taken?: number;
  error?: string;
}

const ProofContent = () => {
  const router = useRouter();
  const id = router.query.id;
  const { verifyProof, worker } = useWorker();

  const [isLoading, setIsLoading] = useState(true);
  const [proof, setProof] = useState<Proof>();
  const [rows, setRows] = useState<GuessRow[]>([]);
  const [validProof, setValidProof] = useState<VerifyProof | undefined>();

  const toast = useToast();

  const getProofById = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/proof/${id}`, {
      method: "GET",
      headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_KEY}` },
    }).then((res) => res.json() as Promise<{ proof: Proof | undefined }>);
    const data = response.proof;
    if (data) {
      setProof(data);

      const numberOfGuessesRemaining = GUESS_LENGTH - data.guesses.length;
      const guesses = data.guesses.map((guess) => ({ word: guess, result: computeGuess(guess, data.answer) }));
      setRows(guesses.concat(Array(numberOfGuessesRemaining).fill("")));
    } else {
      setValidProof({ result: false, error: "Id not found" });
    }
    setIsLoading(false);
  };

  const handleVerify = async () => {
    if (!worker || !proof) return;
    setValidProof(undefined);

    const stateProof = { bytes: Buffer.from(proof.bytes), inputs: Buffer.from(proof.input) };
    const valid = await verifyProof(stateProof);
    console.log({ valid });
    if (typeof valid?.result === "boolean") {
      setValidProof({ result: valid.result, time_taken: Number(valid.time_taken) });
      toast({
        title: "Proof verified successfully",
        position: "top",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } else {
      setValidProof({ result: false, error: "Proof not found" });
      toast({
        title: "Proof invalid!",
        position: "top",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (id) {
      getProofById().catch((err) => {
        console.log(err);
      });
    }
  }, [id]);

  if (isLoading) return null;

  return (
    <Flex alignItems="center" direction="column" h="full" justify={{ base: "space-between", md: "center" }} mx="auto">
      <Text
        fontSize={{ base: "md", md: "2xl" }}
        padding={{ base: "4", md: "8" }}
        sx={{ "& span": { color: "pink.400" } }}
        textAlign="left"
        w={{ base: "full", md: "container.sm" }}
      >
        When you verify a proof, the proof associated with the ID: <span>{proof?.id}</span> is fetched and then verified
        here in your browser showing the validity of the guesses you see below, displayed as colored squares.
      </Text>
      <VStack gap={{ base: 1, md: 2 }}>
        {rows.map(({ word, result }, index) => (
          <WordRow
            key={word + String(index)}
            checkingGuess={false}
            currentRow={false}
            letters={word}
            proof
            result={result}
            showChar={false}
          />
        ))}
      </VStack>

      <Flex
        direction="column"
        gap={{ base: 2 }}
        padding={{ base: "4", md: "12" }}
        w={{ base: "full", md: "container.sm" }}
      >
        {validProof?.error ? <Error /> : null}
        {!validProof?.error && (
          <>
            <ValidProofDetails isValid={validProof?.result} timeTaken={validProof?.time_taken} />
            <Button
              _active={{ transform: "scale(0.98)" }}
              _hover={{ bgColor: "gray.900" }}
              bgColor="black"
              border="1px"
              borderColor="brand.primary"
              fontSize="2xl"
              leftIcon={<BrandLogo boxSize={8} color="brand.primary" />}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => handleVerify()}
              p="12"
              padding="8"
              textColor="gray.300"
              variant="solid"
            >
              {validProof === undefined ? "Verify Proof" : "Re-Verify Proof"}
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default ProofContent;

const ValidProofDetails = ({ isValid, timeTaken }: { isValid?: boolean; timeTaken?: number }) => {
  const timeString = typeof timeTaken === "number" && timeTaken >= 1 ? `${timeTaken}` : `<1`;
  return (
    <Flex
      alignItems="center"
      gap={{ base: 2, md: 4 }}
      justify={{ base: "center", md: "space-between" }}
      mb={{ base: 2, md: 8 }}
    >
      <Flex justify="center" w="50%">
        <Box alignItems="center" textAlign="center" w="full">
          <Heading as="h5" size={{ base: "md", md: "xl" }} textColor={`${isValid === undefined ? "gray.500" : "#fff"}`}>
            {isValid === undefined && "Pending"}
            {isValid !== undefined && isValid ? "Verified Proof" : null}
            {isValid !== undefined && !isValid && "Invalid Proof"}
          </Heading>
        </Box>
      </Flex>
      <Divider borderColor="gray.400" borderWidth={{ base: "1px", md: "2px" }} orientation="vertical" />
      <Flex alignItems="center" justify="center" w="50%">
        <Box alignItems="center" textAlign="center" w="full">
          <Heading as="h5" size={{ base: "sm", md: "md" }} whiteSpace="nowrap">
            Verification Time
          </Heading>
          <Box as="span" color="gray.100">
            <Box as="span" color="gray.100" fontSize={{ base: "xl", md: "4xl" }} fontWeight="bold">
              {typeof timeTaken === "number" ? timeString : "--"}
            </Box>
            <Box as="span" color="gray.300" fontSize={{ base: "sm", md: "md" }} ml="1">
              ms
            </Box>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export const Error = () => (
  <Box px={6} py={10} textAlign="center">
    <Box display="inline-block">
      <Flex
        alignItems="center"
        bg="red.500"
        flexDirection="column"
        h="55px"
        justifyContent="center"
        rounded="50px"
        textAlign="center"
        w="55px"
      >
        <Icon as={RxCross1} boxSize={6} />
      </Flex>
    </Box>
    <Heading as="h2" mb={2} mt={6} size="xl">
      Proof not found
    </Heading>
    <Text color="gray.500">Please check the proof ID and try again.</Text>
    <Button
      _active={{ transform: "scale(0.98)" }}
      _hover={{ bgColor: "gray.900" }}
      as={Link}
      bgColor="black"
      border="1px"
      borderColor="brand.primary"
      fontSize="xl"
      href="/"
      leftIcon={<BrandLogo boxSize={8} color="brand.primary" />}
      mt="8"
      p="8"
      textColor="gray.300"
      variant="solid"
    >
      Play!
    </Button>
  </Box>
);
