import type { NextSeoProps } from "next-seo";
import { NextSeo } from "next-seo";

export const useSeo = <T extends NextSeoProps = NextSeoProps>(props: T) => {
  const Seo = (extraProps: NextSeoProps) => {
    return <NextSeo {...props} {...extraProps} />;
  };
  return { Seo, ...props };
};
