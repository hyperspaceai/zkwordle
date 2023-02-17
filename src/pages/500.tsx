import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import { useSeo } from "@/hooks/use-seo";
import NextLink from "next/link";

const InternalServerErrorPage = () => {
  const { Seo, title } = useSeo({
    title: "500 Internal Server Error",
  });

  return (
    <Stack align="center" as="section" h="100vh" justify="center" minH="80vh" p={4} textAlign="center">
      <Seo />
      <Heading>{title}</Heading>
      <Text>
        Something went wrong.{" "}
        <Link as={NextLink} color="pink.500" href="/">
          Head over to home page.
        </Link>
      </Text>
    </Stack>
  );
};

export default InternalServerErrorPage;
