import {Readable, Writable} from 'node:stream'
import type {SpawnOptionsWithoutStdio} from "child_process";
import type userEvent from "../src/user-event";
import type {
  queries,
  BoundFunction,
} from './get-queries-for-instance'

export interface TestInstance {
  clear(): void
  stdoutArr: Array<string, Buffer>
  stdin: Writable
  stdout: Readable
  stderr: Readable
  stdoutStr: string
  pid: number | undefined
}

export interface RenderOptions {
  cwd: string,
  debug: boolean,
  spawnOpts: Omit<SpawnOptionsWithoutStdio, 'cwd'>
}

export type RenderResult = TestInstance & {
  userEvent: ReturnType<{
    [key in keyof typeof userEvent]: BoundFunction<typeof userEvent[key]>;
  }>
} & {[P in keyof typeof queries]: BoundFunction<typeof queries[P]>}

export function render(
  command: string,
  args: string[],
  opts: Partial<RenderOptions>,
): RenderResult;
