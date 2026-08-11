import globals from "@jest/globals";
import * as extensions from "./matchers/index";
import type { CLITestingLibraryMatchers } from "./matchers/types";

globals.expect.extend(extensions);

declare module "expect" {
  export interface Matchers<
    // eslint-disable-next-line @typescript-eslint/naming-convention
    R extends void | Promise<void>,
    T = unknown,
  > extends CLITestingLibraryMatchers<R> {}
}
