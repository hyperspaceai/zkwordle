import type { Proof } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import useWorker from "@/hooks/useWorker";

const ProofPage = () => {
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

  if (isLoading) return <div>loading...</div>;

  return (
    <div className="flex flex-col mx-auto items-center justify-center w-96 relative h-screen">
      {isValidProof !== undefined && <span>{isValidProof ? "valid" : "invalid"}</span>}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <button className="p-4 rounded bg-green-500" onClick={() => handleVerify()} type="button">
        {isValidProof === undefined ? "Verify Proof" : "Verify Again"}
      </button>
    </div>
  );
};
export default ProofPage;
