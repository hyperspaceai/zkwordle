// @ts-check

const { favicons } = require("favicons");
const fs = require("node:fs/promises");
const log = require("next/dist/build/output/log");
const { performance } = require("node:perf_hooks");

const { cwd } = require("../src/utils/path");
const { metadata } = require("../config/metadata");

const PATH_PREFIX = "icons";

const faviconsScript = async () => {
  const t0 = performance.now();
  log.info("generating favicon assets");
  await Promise.all([fs.mkdir(cwd(`public/${PATH_PREFIX}`)), fs.mkdir(cwd(`__generated__`))]).catch(() => null);
  const { files, html, images } = await favicons(cwd("public/logo.png"), {
    path: `/${PATH_PREFIX}/`,
    appName: metadata.name,
    appShortName: metadata.shortName,
    appDescription: metadata.description,
    developerName: metadata.shortName,
    developerURL: metadata.url,
    background: "#CBFFD9",
    theme_color: "#CBFFD9",
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
  return /* jsx */ `export const FaviconTags = () => <>${html.map((h) => h.replace(/>$/, " />")).join(" ")}</>`;
};

void faviconsScript();
