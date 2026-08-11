import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    jest: "src/jest.ts",
    "jest-globals": "src/jest-globals.ts",
    vitest: "src/vitest.ts",
  },
  clean: true,
  dts: true,
  format: "esm",
  platform: "node",
  sourcemap: true,
});
