import { Box, Flex, HStack } from "@chakra-ui/react";
import Link from "next/link";

import { BrandLogo } from "@/ui/brand/logo";
import { ModeButton } from "@/ui/demo/mode-button";
import ProofContent from "@/ui/demo/proof-content";
import { Layout } from "@/ui/layout";

const ProofPage = () => {
  return (
    <Layout gap={4} p={8}>
      <Flex justify="space-between">
        <Link href="/">
          <HStack justify="center">
            <BrandLogo boxSize={8} color="brand.primary" />
            <Box fontWeight="bold">ZK-WASM Wordle</Box>
          </HStack>
        </Link>
        <ModeButton alignSelf="end" />
      </Flex>

      <ProofContent flexGrow={1} />
    </Layout>
  );
};
export default ProofPage;
