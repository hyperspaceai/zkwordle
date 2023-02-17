import "@fontsource/be-vietnam-pro/latin.css";
import "@fontsource/jetbrains-mono/latin.css";

import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MetaTags } from "@/ui/meta-tags";
import { theme } from "@/styles/theme";


export { reportWebVitals } from "next-axiom";

const CustomApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
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
