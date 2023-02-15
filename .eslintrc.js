// @ts-check

const { getTsconfigPath } = require("@hyperspaceinc/style-guide/eslint/helpers");

/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  extends: [
    require.resolve("@hyperspaceinc/style-guide/eslint/browser-node"),
    require.resolve("@hyperspaceinc/style-guide/eslint/react"),
    require.resolve("@hyperspaceinc/style-guide/eslint/next"),
    require.resolve("@hyperspaceinc/style-guide/eslint/typescript"),
  ],
  globals: {
    Atomics: "readonly",
    globalThis: "writeable",
    SharedArrayBuffer: "readonly",
  },
  ignorePatterns: [".next", "__generated__", "node_modules", "out", "public/worker.js"],
  parserOptions: {
    project: getTsconfigPath(),
  },
  rules: {
    "react/no-unescaped-entities": ["warn"],
    camelcase: ["off"],
  },
  overrides: [
    {
      files: ["public/**/*.{js,ts}"],
      rules: {
        camelcase: ["off"],
        "import/no-default-export": ["off"],
        "import/no-relative-packages": ["off"],
        "import/no-unresolved": ["warn"],
        "no-bitwise": ["off"],
        "no-param-reassign": ["off"],
        "prefer-rest-params": ["off"],
        "unicorn/filename-case": ["off"],
      },
    },
  ],
  root: true,
};

module.exports = eslintConfig;
