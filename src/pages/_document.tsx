import { FaviconTags } from "__generated__/favicon-tags";
import { ColorModeScript } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";

import { config } from "@/styles/config";

const Document = () => {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
        <FaviconTags />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />

        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          page_path: window.location.pathname,
        });
      `,
          }}
        />
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
