// @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

/** @type {Array<import("eslint").Linter.Config>} */
const config = [
  ...tanstackConfig,
  {
    name: "clitesting/temp",
    rules: {},
  },
];

export default config;
