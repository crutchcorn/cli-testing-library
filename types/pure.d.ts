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
  stdoutArr: Array<string, Buffer>
  stdin: Writable
  stdout: Readable
  stderr: Readable
  stdoutStr: string
}
