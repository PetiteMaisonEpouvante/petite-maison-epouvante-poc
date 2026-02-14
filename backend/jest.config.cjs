const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },

  // ✅ Coverage pour SonarCloud
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "cobertura"],

  // ✅ À adapter si tu ranges tes tests ailleurs
  testMatch: [
    "**/?(*.)+(spec|test).ts",
    "**/?(*.)+(spec|test).js"
  ],
};
