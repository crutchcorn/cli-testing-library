import {Readable, Writable} from 'node:stream'
import type {
  queries,
  BoundFunction,
} from '@testing-library/dom'

import {getFireEventForElement} from "./events";
import {SpawnOptionsWithoutStdio} from "child_process";

export interface TestInstance {
  cleanup(): void
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
  fireEvent: ReturnType<ReturnType<getFireEventForElement>>
} & {[P in keyof typeof queries]: BoundFunction<typeof queries[P]>}

export function render(
  command: string,
  args: string[],
  opts: Partial<RenderOptions>,
): RenderResult;
