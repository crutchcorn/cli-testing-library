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
