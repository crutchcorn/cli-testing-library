import globals from '@jest/globals';
import * as extensions from './matchers';
import {type CLITestingLibraryMatchers} from './matchers/types'

globals.expect.extend(extensions)

declare module '@jest/expect' {
  export interface Matchers<R extends void | Promise<void>>
    extends CLITestingLibraryMatchers<
      R
    > {}
}
