import {Readable, Writable} from 'node:stream'

export interface RenderOptions {
  cwd: string
}

/**
 * TODO: Rename to `RenderResults` (to match react-testing-library),
 *    then move `std*` into `container` type/prop on RenderResults
 */
export interface TestInstance {
  cleanup(): void
  // Possibly switch to `stdout.on('data'` prop in the future
  stdoutArr: string[]
  stdin: Writable
  stdout: Readable
  stderr: Readable
  stdoutStr: string
}
