import type {SpawnOptionsWithoutStdio} from 'child_process'
import {ChildProcessWithoutNullStreams} from 'child_process'
import type userEvent from './user-event/index'
import * as queries from './queries'
import type {BoundFunction} from './get-queries-for-instance'

export interface TestInstance {
  clear(): void
  process: ChildProcessWithoutNullStreams
  stdoutArr: Array<{contents: Buffer | string; timestamp: number}>
  stderrArr: Array<{contents: Buffer | string; timestamp: number}>
  getStdallStr(): string
  hasExit(): null | {exitCode: number}
  debug(maxLength?: number): void
}

export interface RenderOptions {
  cwd: string
  debug: boolean
  spawnOpts: Omit<SpawnOptionsWithoutStdio, 'cwd'>
}

type UserEvent = typeof userEvent

export type RenderResult = TestInstance & {
  userEvent: {
    [P in keyof UserEvent]: BoundFunction<UserEvent[P]>
  }
} & {[P in keyof typeof queries]: BoundFunction<typeof queries[P]>}

export function render(
  command: string,
  args?: string[],
  opts?: Partial<RenderOptions>,
): Promise<RenderResult>
