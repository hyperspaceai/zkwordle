import type { Proof } from "@prisma/client";
import { metadata } from "config/metadata";
import type { GetStaticPaths, GetStaticProps } from "next";
import invariant from "tiny-invariant";

import { getProofData } from "@/actions/get-proof-data";
import { useSeo } from "@/hooks/use-seo";
import { paramsSchema } from "@/schema/opengraph";
import { GamesPlayed } from "@/ui/demo/game/GamesPlayed";
import { Navbar } from "@/ui/demo/game/Navbar";
import ProofContent from "@/ui/demo/proof-content";
import { Footer } from "@/ui/footer";
import { Layout } from "@/ui/layout";
import { computeGuess } from "@/utils/word";

interface PageProps {
  proof: Proof;
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  invariant(typeof params?.id === "string", "`params.id` is required and must be a string");
  const stringifiedData = await getProofData({ id: params.id });

  if (!stringifiedData) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }

  return {
    props: {
      proof: JSON.parse(stringifiedData) as Proof,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

const ProofPage = ({ proof }: PageProps) => {
  const { answer, guesses, provingTime, bytes, input } = proof;

  const numberOfGuessesRemaining = 6 - guesses.length;
  const results = guesses.map((guess) => computeGuess(guess, answer).join(""));
  const blocks = results.concat(Array(numberOfGuessesRemaining).fill("00000")).join("");
  const kb = `${((Buffer.from(bytes).byteLength + Buffer.from(input).byteLength) / 1024).toFixed(1)}kb`;
  const sp = paramsSchema.parse({ verification: `${provingTime.toString()}ms`, blocks, proof: kb });
  const searchParams = new URLSearchParams({ ...sp, blocks }).toString();

  const { Seo } = useSeo({
    openGraph: {
      images: searchParams
        ? [{ url: `${metadata.url}/api/og/result/?${searchParams}` }]
        : [{ url: `${metadata.url}/api/og/social/` }],
    },
  });
  return (
    <Layout>
      <Seo />
      <Navbar />
      <GamesPlayed />
      <ProofContent proof={proof} />
      <Footer />
    </Layout>
  );
};
export default ProofPage;
