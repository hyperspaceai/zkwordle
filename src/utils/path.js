const path = require("node:path");

const cwd = (/** @type {string[]} */ ...args) => {
  return path.resolve(process.cwd(), ...args);
};

module.exports = {
  cwd,
};
