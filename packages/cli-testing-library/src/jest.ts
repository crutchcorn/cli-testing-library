import * as extensions from "./matchers/index";
import type {CLITestingLibraryMatchers} from "./matchers/types";

expect.extend(extensions);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Matchers<R = void, T = {}> extends CLITestingLibraryMatchers<R> {}
  }
}
