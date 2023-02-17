// @ts-check

const { favicons } = require("favicons");
const { performance } = require("perf_hooks");
const fs = require("fs/promises");
const log = require("next/dist/build/output/log");
const metadataJson = require("../config/metadata.json");
const path = require("path");

const PATH_PREFIX = "icons";

const cwd = (/** @type {string[]} */ ...args) => path.resolve(process.cwd(), ...args);

const faviconsScript = async () => {
  const t0 = performance.now();
  log.info("generating favicon assets");
  await fs.mkdir(cwd(`public/${PATH_PREFIX}`)).catch(() => null);
  const { files, html, images } = await favicons(cwd("public/logo.png"), {
    path: `/${PATH_PREFIX}/`,
    appName: metadataJson.name,
    appShortName: metadataJson.shortName,
    appDescription: metadataJson.description,
    developerName: metadataJson.shortName,
    developerURL: metadataJson.url,
    background: "#000000",
    theme_color: "#000000",
    icons: { android: false, appleIcon: false, appleStartup: false, favicons: true, windows: false, yandex: false },
  });
  await Promise.all([
    ...[...files, ...images].map(({ contents, name }) => {
      return fs.writeFile(cwd(`public/${PATH_PREFIX}`, name), contents, { encoding: "utf-8" });
    }),
    fs.writeFile(cwd("__generated__/favicon-tags.tsx"), makeFaviconTags(html), { encoding: "utf-8" }),
  ]);
  const t1 = performance.now();
  log.ready(`generated favicon assets in ${Math.round((t1 - t0) / 100) / 10}s`);
};

const makeFaviconTags = (html = [""]) => {
  return `export const FaviconTags = () => <>${html.map((h) => h.replace(/>$/, " />")).join(" ")}</>`;
};

void faviconsScript();
