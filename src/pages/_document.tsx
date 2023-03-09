import { FaviconTags } from "__generated__/favicon-tags";
import { ColorModeScript } from "@chakra-ui/react";
import { metadata } from "config/metadata";
import { Head, Html, Main, NextScript } from "next/document";

import { config } from "@/styles/config";

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
        <meta content={`${metadata.url}/social.png`} property="og:image" />
        <meta content={`${metadata.url}/social.png`} property="og:image:url" />
        <meta content={`${metadata.url}/social.png`} property="og:image:secure_url" />
        <FaviconTags />
      </Head>
      <body>
        <ColorModeScript initialColorMode={config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
