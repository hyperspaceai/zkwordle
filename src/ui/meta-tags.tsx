import { metadata } from "config/metadata";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";

export const MetaTags = () => {
  const router = useRouter();
  return (
    <DefaultSeo
      canonical={metadata.url + (router.asPath || "")}
      defaultTitle={metadata.name}
      description={metadata.description}
      openGraph={{
        title: metadata.name,
        description: metadata.description,
        type: "website",
        site_name: metadata.name,
        images: [
          { url: `https://zkwordle.com/social.png`, type: "image/png", alt: metadata.name, width: 1200, height: 630 },
        ],
      }}
      twitter={{
        cardType: "summary_large_image",
        handle: metadata.twitter.username,
        site: metadata.twitter.username,
      }}
    />
  );
};
