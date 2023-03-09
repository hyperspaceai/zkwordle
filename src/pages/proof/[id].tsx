import type { Proof } from "@prisma/client";
import { metadata } from "config/metadata";
import type { GetStaticPaths, GetStaticProps } from "next";
import invariant from "tiny-invariant";

import { getProofData } from "@/actions/get-proof-data";
import { useSeo } from "@/hooks/use-seo";
import { GamesPlayed } from "@/ui/demo/game/GamesPlayed";
import { Navbar } from "@/ui/demo/game/Navbar";
import ProofContent from "@/ui/demo/proof-content";
import { Footer } from "@/ui/footer";
import { Layout } from "@/ui/layout";
import { getSearchParams } from "@/utils/searchParams";

interface PageProps {
  id: string;
  proof: Proof;
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  invariant(typeof params?.id === "string", "`params.id` is required and must be a string");
  const stringifiedData = await getProofData({ id: params.id });

  if (!JSON.parse(stringifiedData)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id: params.id,
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
  const searchParams = getSearchParams({
    answer,
    guesses,
    provingTime: Number(provingTime),
    bytes,
    input,
  });
  const { Seo } = useSeo({
    openGraph: {
      images: [{ url: `${metadata.url}/api/og/result?${searchParams}` }],
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
