import { ImageResponse } from "@vercel/og";
import type { NextApiHandler, PageConfig } from "next";
import invariant from "tiny-invariant";

import { loadOptions } from "@/lib/opengraph";
import { paramsSchema } from "@/schema/opengraph";
import { Og } from "@/ui/opengraph";
import { SvgHy, SvgZkwordle } from "@/ui/opengraph/svg";

export const config: PageConfig = {
  runtime: "edge",
};

const handler: NextApiHandler = async (req) => {
  invariant(typeof req.url === "string", "`req.url` is required and must be a string");

  const url = new URL(req.url);
  const rawParams = Object.fromEntries(url.searchParams.entries());
  const params = await paramsSchema.parseAsync(rawParams);

  const response = new ImageResponse(
    (
      <Og.Container>
        <div style={{ display: "flex", flexDirection: "column", gap: 48, padding: 80 }}>
          <SvgZkwordle />
          <Og.ProofStatus>{params.status}</Og.ProofStatus>
          <Og.Metrics data={{ Proof: params.proof, Verification: params.verification }} />
        </div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, padding: 80 }}>
          <SvgHy color="#EC4899" />
          <Og.Blocks data={params.blocks} />
        </div>
        <Og.LinkBanner />
      </Og.Container>
    ),
    await loadOptions({ debug: process.env.NODE_ENV === "development" }),
  );

  return response;
};

export default handler;
