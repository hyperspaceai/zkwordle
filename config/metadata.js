// @ts-check

const domain = process.env.APP_URL
  ? `${process.env.APP_URL.replace(/https?:\/\//, "").split("/")[0]}`
  : process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL ||
    `${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`;

const protocol = domain.includes("localhost") || domain.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/) ? "http" : "https";
const url = `${protocol}://${domain}`;

const metadata = {
  name: "zkWordle",
  shortName: "zkWordle",
  description: `Guess todays word and the result you got will be packaged in a shareable proof using our ZKWasm runtime`,
  domain: `${domain}`,
  email: "hey@hyperspace.foundation",
  url,
  twitter: {
    username: "@hyperspaceorg",
    url: "https://twitter.com/hyperspaceorg",
  },
};

module.exports = {
  metadata,
};
