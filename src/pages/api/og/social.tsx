import { ImageResponse } from "@vercel/og";
import type { NextApiHandler, PageConfig } from "next";

import { loadOptions } from "@/lib/opengraph";
import { defaultBlocks } from "@/schema/opengraph";
import { Og } from "@/ui/opengraph";
import { SvgHy, SvgZkwordle } from "@/ui/opengraph/svg";

export const config: PageConfig = {
  runtime: "edge",
};

const handler: NextApiHandler = async (_req) => {
  const response = new ImageResponse(
    (
      <Og.Container>
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", gap: 48, padding: 80 }}>
          <SvgZkwordle height={150} />
        </div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, padding: 80 }}>
          <SvgHy color="#EC4899" />
          <Og.Blocks data={defaultBlocks.split("")} />
        </div>
        <Og.LinkBanner />
      </Og.Container>
    ),
    await loadOptions({ debug: process.env.NODE_ENV === "development" }),
  );

  return response;
};

export default handler;
