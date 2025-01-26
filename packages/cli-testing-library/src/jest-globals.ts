import globals from "@jest/globals";
import * as extensions from "./matchers/index";
import type { CLITestingLibraryMatchers } from "./matchers/types";

globals.expect.extend(extensions);

declare module "@jest/expect" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Matchers<R extends void | Promise<void>>
    extends CLITestingLibraryMatchers<R> {}
}
