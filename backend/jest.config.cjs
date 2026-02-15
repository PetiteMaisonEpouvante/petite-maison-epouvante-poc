const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",

  // ✅ Transform TS/JS si tu en as besoin
  transform: {
    ...tsJestTransformCfg,
  },

  // ✅ IMPORTANT : ici, PAS dans transform
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.js"],

  // ✅ Coverage pour SonarCloud
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "cobertura"],

  // ✅ Tests
  testMatch: ["**/?(*.)+(spec|test).ts", "**/?(*.)+(spec|test).js"],
};
