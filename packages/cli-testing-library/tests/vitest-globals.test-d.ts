/// <reference types="vitest/globals" />

import { cleanup } from "../src/index";

afterEach(async () => {
  await cleanup();
});
