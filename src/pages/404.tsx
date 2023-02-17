import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import { useSeo } from "@/hooks/use-seo";
import NextLink from "next/link";

const NotFoundPage = () => {
  const { Seo, title } = useSeo({
    title: "404 Not Found",
  });

  return (
    <Stack align="center" as="section" flexGrow={1} justify="center" minH="80vh" p={4} textAlign="center">
      <Seo />
      <Heading>{title}</Heading>
      <Text>
        The current page is not available.{" "}
        <Link as={NextLink} color="pink.500" href="/">
          Head over to home page.
        </Link>
      </Text>
    </Stack>
  );
};

export default NotFoundPage;
