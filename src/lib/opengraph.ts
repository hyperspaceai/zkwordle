import type { ImageResponseOptions } from "@vercel/og";

export const loadFontData = async () => {
  const [light, regular, bold] = await Promise.all(
    [
      "https://sfo3.digitaloceanspaces.com/hyperspace/hydentity/bvp-light.otf",
      "https://sfo3.digitaloceanspaces.com/hyperspace/hydentity/bvp-regular.otf",
      "https://sfo3.digitaloceanspaces.com/hyperspace/hydentity/bvp-bold.otf",
    ].map((url) => fetch(url).then((res) => res.arrayBuffer())),
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
