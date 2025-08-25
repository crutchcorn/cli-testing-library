/* istanbul ignore file */

import { expect } from "vitest";
import * as extensions from "./matchers/index";
import type { CLITestingLibraryMatchers } from "./matchers/types";

expect.extend(extensions);

declare module "vitest" {
  interface Assertion<T = any> extends CLITestingLibraryMatchers<any> {}

  interface AsymmetricMatchersContaining
    extends CLITestingLibraryMatchers<any> {}

  // Vitest 3.2.0+
  interface Matchers<T = any> extends CLITestingLibraryMatchers<T> {}
}
