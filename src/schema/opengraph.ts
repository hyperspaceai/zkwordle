import { z } from "zod";

// https://figma.com/file/SIdXgDausLq4mudYAWFa6T/Embeds?node-id=108%3A2&t=Ay2VHO93K7J4PnIn-4
export const defaultBlocks = ["01000", "00010", "01122", "00221", "00100", "10222"].join("");

export const paramsSchema = z.object({
  status: z.string().default("Verified"),
  proof: z.string().default("0.0kb"),
  verification: z.string().default("0ms"),
  blocks: z
    .string()
    .regex(/^[0123]{30}$/)
    .default(defaultBlocks)
    .transform((x) => x.split("")),
});
