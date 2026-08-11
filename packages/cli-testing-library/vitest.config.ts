import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "cli-testing-library",
    dir: "./tests",
    watch: false,
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: { enabled: true, provider: "istanbul", include: ["src/**/*"] },
    typecheck: { enabled: true },
  },
});
