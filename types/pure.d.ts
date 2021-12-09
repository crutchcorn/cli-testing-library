import type {SpawnOptionsWithoutStdio} from 'child_process'
import {ChildProcessWithoutNullStreams} from "child_process";
import type userEvent from '../src/user-event'
import type {queries, BoundFunction} from './get-queries-for-instance'

export interface TestInstance {
  clear(): void
  process: ChildProcessWithoutNullStreams
  stdoutArr: Array<string, Buffer>
  stdoutStr: string
  hasExit(): null | {exitCode: number}
}

export interface RenderOptions {
  cwd: string
  debug: boolean
  spawnOpts: Omit<SpawnOptionsWithoutStdio, 'cwd'>
}

type UserEvent = typeof userEvent;

export type RenderResult = TestInstance & {
  userEvent: {
    [P in keyof UserEvent]: BoundFunction<UserEvent[P]>
  }
} & {[P in keyof typeof queries]: BoundFunction<typeof queries[P]>}

export function render(
  command: string,
  args: string[],
  opts?: Partial<RenderOptions>,
): Promise<RenderResult>
