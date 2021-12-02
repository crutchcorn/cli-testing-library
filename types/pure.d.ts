import type {SpawnOptionsWithoutStdio} from 'child_process'
import {ChildProcess} from 'node:child_process'
import type userEvent from '../src/user-event'
import type {queries, BoundFunction, BoundFunctions} from './get-queries-for-instance'

export interface TestInstance {
  clear(): void
  stdoutArr: Array<string, Buffer>
  stdin: Exclude<ChildProcess['stdin'], null | undefined>
  stdout: Exclude<ChildProcess['stdout'], null | undefined>
  stderr: Exclude<ChildProcess['stderr'], null | undefined>
  kill: Exclude<ChildProcess['kill'], null | undefined>
  stdoutStr: string
  pid: number | undefined
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
