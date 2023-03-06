import { prisma } from "@/utils/db/prisma";

export const getProofData = async ({ id }: { id: string | undefined }) => {
  const data = await prisma.proof.findUnique({ where: { id } });

  return JSON.stringify(data);
};
