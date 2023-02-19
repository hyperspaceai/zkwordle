import { Box, Flex, HStack } from "@chakra-ui/react";

import { BrandLogo } from "@/ui/brand/logo";
import { MainContent } from "@/ui/demo/main-content";
import { ModeButton } from "@/ui/demo/mode-button";
import { Layout } from "@/ui/layout";

const WordlePage = () => {
  return (
    <Layout gap={4} p={8}>
      <Flex justify="space-between">
        <HStack justify="center">
          <BrandLogo boxSize={8} color="brand.primary" />
          <Box fontWeight="bold">ZK-WASM Wordle</Box>
        </HStack>
        <ModeButton alignSelf="end" />
      </Flex>
      <MainContent flexGrow={1} />
    </Layout>
  );
};

export default WordlePage;
