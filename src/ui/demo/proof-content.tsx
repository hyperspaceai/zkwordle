import type { BoxProps } from "@chakra-ui/react";
import { Box, Button, Flex } from "@chakra-ui/react";
import type { Proof } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import useWorker from "@/hooks/useWorker";

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
    if (id && worker) {
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
      <Flex alignItems="center" direction="column" h="full" justifyContent="center" mx="auto">
        {validProof?.error && <Box>{validProof.error}</Box>}
        {validProof && !validProof.error && <Box>{validProof.result ? "valid" : "invalid"}</Box>}
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button bg="green.500" borderRadius="md" onClick={() => handleVerify()} p="4" type="button">
          {validProof === undefined ? "Verify Proof" : "Verify Again"}
        </Button>
      </Flex>
    </Flex>
  );
};
export default ProofContent;
