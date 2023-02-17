import useWorker from "@/hooks/useWorker";
import { Box, BoxProps, Button, Flex } from "@chakra-ui/react";
import { Proof } from "@prisma/client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const ProofContent = (props: BoxProps) => {
  const router = useRouter();
  const id = router.query.id;
  const { verifyProof, worker } = useWorker();

  const [isLoading, setIsLoading] = useState(true);
  const [proof, setProof] = useState<Proof>();
  const [isValidProof, setIsValidProof] = useState<boolean | undefined>();

  const getProofById = async () => {
    const response = await fetch(`/api/proof/${id}`, {
      method: "GET",
      headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_KEY}` },
    }).then((res) => res.json() as Promise<{ proof: Proof | undefined }>);
    const data = response.proof;
    if (data) {
      setProof(data);
    } else {
      setIsValidProof(false);
    }
  };

  const handleVerify = async () => {
    if (!worker || !proof) return;
    setIsValidProof(undefined);

    const stateProof = { bytes: Buffer.from(proof.bytes), inputs: Buffer.from(proof.input) };
    const valid = await verifyProof(stateProof);
    if (typeof valid === "boolean") {
      setIsValidProof(valid);
    } else {
      setIsValidProof(false);
    }
  };

  useEffect(() => {
    if (id && worker) {
      getProofById().catch((err) => {
        console.log(err);
      });
      setIsLoading(false);
    }
  }, [id]);
  return (
    <>
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
        <Flex direction="column" mx="auto" alignItems="center" justifyContent="center" h="full">
          {isValidProof !== undefined && <Box>{isValidProof ? "valid" : "invalid"}</Box>}
          <Button p="4" borderRadius="md" bg="green.500" onClick={() => handleVerify()} type="button">
            {isValidProof === undefined ? "Verify Proof" : "Verify Again"}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
export default ProofContent;
