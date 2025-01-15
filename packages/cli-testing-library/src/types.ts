import {ChildProcessWithoutNullStreams} from 'child_process'

export interface TestInstance {
  clear(): void
  process: ChildProcessWithoutNullStreams
  stdoutArr: Array<{contents: Buffer | string; timestamp: number}>
  stderrArr: Array<{contents: Buffer | string; timestamp: number}>
  getStdallStr(): string
  hasExit(): null | {exitCode: number}
  debug(maxLength?: number): void
}

declare global {
  const jest: undefined | any
  const vi: undefined | any
  const afterEach: undefined | ((fn: () => void) => void)
  const teardown: undefined | ((fn: () => void) => void)
  const expect: undefined | any
}
