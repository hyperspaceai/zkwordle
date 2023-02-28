import type { BoxProps } from "@chakra-ui/react";
import { Box, Button, Divider, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import type { Proof } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";

import useWorker from "@/hooks/useWorker";

import { BrandLogo } from "../brand/logo";
import NavBar from "./game/Navbar";

interface VerifyProof {
  result: boolean;
  time_taken?: number;
  error?: string;
}

const ProofContent = (props: BoxProps) => {
  const router = useRouter();
  const id = router.query.id;
  const { verifyProof, worker } = useWorker();

  const [isLoading, setIsLoading] = useState(true);
  const [proof, setProof] = useState<Proof>();
  const [validProof, setValidProof] = useState<VerifyProof | undefined>();

  const getProofById = async () => {
    const response = await fetch(`/api/proof/${id}`, {
      method: "GET",
      headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_KEY}` },
    }).then((res) => res.json() as Promise<{ proof: Proof | undefined }>);
    const data = response.proof;
    if (data) {
      setProof(data);
    } else {
      setValidProof({ result: false, error: "Id not found" });
    }
  };

  const handleVerify = async () => {
    if (!worker || !proof) return;
    setValidProof(undefined);

    const stateProof = { bytes: Buffer.from(proof.bytes), inputs: Buffer.from(proof.input) };
    const valid = await verifyProof(stateProof);
    if (typeof valid?.result === "boolean") {
      setValidProof({ result: valid.result, time_taken: Number(valid.time_taken) });
    } else {
      setValidProof({ result: false, error: "Proof not found" });
    }
  };

  useEffect(() => {
    if (id) {
      getProofById().catch((err) => {
        console.log(err);
      });
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) return null;

  return (
    <Flex
      _before={{
        bgColor: "gray.900",
        content: '""',
        inset: 0,
        opacity: 0.9,
        pos: "absolute",
        rounded: "inherit",
        zIndex: -1,
      }}
      borderColor="gray.700"
      borderWidth={1}
      flexDir="column"
      pos="relative"
      rounded="xl"
      {...props}
    >
      <NavBar />
      <Flex alignItems="center" direction="column" h="full" justifyContent="center" mx="auto" w="full">
        <Flex direction="column" p="12" w="container.sm">
          {validProof?.error && <Error />}
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
    </Flex>
  );
};
export default ProofContent;

const ValidProofDetails = ({ isValid, timeTaken }: { isValid?: boolean; timeTaken?: number }) => {
  return (
    <Flex alignItems="center" gap="4" justify="space-between" mb="8">
      <Flex justify="center" w="50%">
        <Box alignItems="center" textAlign="center" w="full">
          <Heading as="h5" size="xl" textColor={`${isValid === undefined ? "gray.500" : "#fff"}`}>
            {isValid === undefined && "Pending"}
            {isValid !== undefined && isValid && "Verified Proof"}
            {isValid !== undefined && !isValid && "Invalid Proof"}
          </Heading>
        </Box>
      </Flex>
      <Divider h="50" orientation="vertical" />
      <Flex alignItems="center" justify="center" w="50%">
        <Box alignItems="center" textAlign="center" w="full">
          <Heading as="h5" size="md" whiteSpace="nowrap">
            Verification Time
          </Heading>
          <Box as="span" color="gray.100">
            <Box as="span" color="gray.100" fontSize="4xl" fontWeight="bold">
              {timeTaken ? timeTaken : "--"}
            </Box>
            <Box as="span" color="gray.300" fontSize="md" ml="1">
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
