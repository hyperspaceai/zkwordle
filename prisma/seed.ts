import { PrismaClient } from "@prisma/client";

import { generateWords } from "./seeds/words";

const prisma = new PrismaClient();

const seed = async () => {
  try {
    const words = generateWords(30);
    await prisma.word.createMany({ data: words });

    await prisma.$disconnect();
  } catch (error) {
    console.log("Seed fail", error);
    throw new Error("Seed failed");
  }
};

void seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
