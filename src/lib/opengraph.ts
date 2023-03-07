import type { ImageResponseOptions } from "@vercel/og";
import { metadata } from "config/metadata";

export const loadFontData = async () => {
  const [light, regular, bold] = await Promise.all(
    ["/fonts/bvp-light.otf", "/fonts/bvp-regular.otf", "/fonts/bvp-bold.otf"].map((url) =>
      fetch(new URL(url, metadata.url).toString()).then((res) => res.arrayBuffer()),
    ),
  );
  return {
    light: light!,
    regular: regular!,
    bold: bold!,
  };
};

export const loadOptions = async (opts?: ImageResponseOptions): Promise<ImageResponseOptions> => {
  const fontData = await loadFontData();
  return {
    emoji: "twemoji",
    fonts: [
      { name: "Be Vietnam Pro", weight: 300, data: fontData.light },
      { name: "Be Vietnam Pro", weight: 400, data: fontData.regular },
      { name: "Be Vietnam Pro", weight: 700, data: fontData.bold },
    ],
    height: 630,
    width: 1200,
    ...opts,
  };
};
