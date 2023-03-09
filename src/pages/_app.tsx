import "@fontsource/be-vietnam-pro/latin.css";
import "@fontsource/jetbrains-mono/latin.css";

import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { metadata } from "config/metadata";
import type { AppProps } from "next/app";
import Head from "next/head";

import { theme } from "@/styles/theme";
import { MetaTags } from "@/ui/meta-tags";

const CustomApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
        <meta content={`${metadata.url}/social.png`} property="og:image" />
        <meta content={`${metadata.url}/social.png`} property="og:image:url" />
        <meta content={`${metadata.url}/social.png`} property="og:image:secure_url" />
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
