import * as extensions from './matchers'
import {type CLITestingLibraryMatchers} from './matchers/types'

expect.extend(extensions)

declare global {
  namespace jest {
    interface Matchers<R = void, T = {}>
      extends CLITestingLibraryMatchers<
        R
      > {}
  }
}
