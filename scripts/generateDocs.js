import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateReferenceDocs } from "@tanstack/typedoc-config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('@tanstack/typedoc-config').Package[]} */
const packages = [
  {
    name: "cli-testing-library",
    entryPoints: [
      resolve(__dirname, "../packages/cli-testing-library/src/index.ts"),
    ],
    tsconfig: resolve(
      __dirname,
      "../packages/cli-testing-library/tsconfig.docs.json",
    ),
    outputDir: resolve(__dirname, "../docs/reference"),
  },
];

await generateReferenceDocs({ packages });

process.exit(0);
