import "@fontsource/be-vietnam-pro/latin.css";
import "@fontsource/jetbrains-mono/latin.css";

import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { metadata } from "config/metadata";
import type { AppProps } from "next/app";
import Head from "next/head";

import { theme } from "@/styles/theme";
import { MetaTags } from "@/ui/meta-tags";

const CustomApp = ({ Component, pageProps, router }: AppProps) => {
  return (
    <>
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
        {router.pathname === "/proof/[id]" ? (
          <meta content={`${metadata.url}/api/og/result/?id=${router.query.id}`} property="og:image" />
        ) : (
          <meta content={`${metadata.url}/api/og/social`} property="og:image" />
        )}
      </Head>
      <Analytics />
      <MetaTags />
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
};

export default CustomApp;
