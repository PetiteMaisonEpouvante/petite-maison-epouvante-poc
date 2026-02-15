const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,

  // Base JS/CJS
  {
    files: ["**/*.js", "**/*.cjs"],
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: { "no-unused-vars": ["error", { argsIgnorePattern: "^_" }] },
  },

  // Tests (Jest)
  {
    files: ["test/**/*.{js,cjs}", "**/*.test.{js,cjs}", "**/*.spec.{js,cjs}"],
    languageOptions: {
      globals: {
        ...globals.jest,  // ✅ jest/describe/it/expect/beforeEach/etc
        ...globals.node,  // ✅ si tes tests utilisent aussi Node globals
      },
    },
  },
];
