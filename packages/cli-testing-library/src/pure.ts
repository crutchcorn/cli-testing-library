import childProcess from "node:child_process";
import { performance } from "node:perf_hooks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import stripFinalNewline from "strip-final-newline";
import { _runObservers } from "./mutation-observer";
import { getQueriesForElement } from "./get-queries-for-instance";
import userEvent from "./user-event/index";
import { bindObjectFnsToInstance, setCurrentInstance } from "./helpers";
import { fireEvent } from "./events";
import { getConfig } from "./config";
import { logCLI } from "./pretty-cli";
import type { TestInstance } from "./types";
import type * as queries from "./queries/index";
import type { SpawnOptionsWithoutStdio } from "node:child_process";
import type { BoundFunction } from "./get-queries-for-instance";

const __curDir =
  typeof __dirname === "undefined"
    ? // @ts-ignore ESM requires this, but it doesn't work in Node18
      path.dirname(fileURLToPath(import.meta.url))
    : __dirname;

export interface RenderOptions {
  cwd: string;
  debug: boolean;
  spawnOpts: Omit<SpawnOptionsWithoutStdio, "cwd">;
}

type UserEvent = typeof userEvent;

export type RenderResult = TestInstance & {
  userEvent: {
    [P in keyof UserEvent]: BoundFunction<UserEvent[P]>;
  };
} & { [P in keyof typeof queries]: BoundFunction<(typeof queries)[P]> };

const mountedInstances = new Set<TestInstance>();

async function render(
  command: string,
  args: Array<string> = [],
  opts: Partial<RenderOptions> = {},
): Promise<RenderResult> {
  const { cwd = __curDir, spawnOpts = {} } = opts;

  const exec = childProcess.spawn(command, args, {
    ...spawnOpts,
    cwd,
    shell: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  let _readyPromiseInternals: null | { resolve: Function; reject: Function } =
    null;

  let _resolved = false;

  const execOutputAPI = {
    __exitCode: null as null | number,
    _isOutputAPI: true,
    _isReady: new Promise(
      (resolve, reject) => (_readyPromiseInternals = { resolve, reject }),
    ),
    process: exec,
    // Clear buffer of stdout to do more accurate `t.regex` checks
    clear() {
      execOutputAPI.stdoutArr = [];
      execOutputAPI.stderrArr = [];
    },
    debug(maxLength?: number) {
      logCLI(execOutputAPI, maxLength);
    },
    // An array of strings gathered from stdout when unable to do
    // `await stdout` because of inquirer interactive prompts
    stdoutArr: [] as Array<{ contents: Buffer | string; timestamp: number }>,
    stderrArr: [] as Array<{ contents: Buffer | string; timestamp: number }>,
    hasExit() {
      return this.__exitCode === null ? null : { exitCode: this.__exitCode };
    },
    getStdallStr(): string {
      return this.stderrArr
        .concat(this.stdoutArr)
        .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
        .map((obj) => obj.contents)
        .join("\n");
    },
  } as TestInstance & {
    __exitCode: null | number;
    _isOutputAPI: true;
    _isReady: Promise<void>;
  };

  mountedInstances.add(execOutputAPI as unknown as TestInstance);

  exec.stdout.on("data", (result: string | Buffer) => {
    // `on('spawn') doesn't work the same way in Node12.
    // Instead, we have to rely on this working as-expected.
    if (_readyPromiseInternals && !_resolved) {
      _readyPromiseInternals.resolve();
      _resolved = true;
    }

    const resStr = stripFinalNewline(result as string);
    execOutputAPI.stdoutArr.push({
      contents: resStr,
      timestamp: performance.now(),
    });
    _runObservers();
  });

  exec.stderr.on("data", (result: string | Buffer) => {
    if (_readyPromiseInternals && !_resolved) {
      _readyPromiseInternals.resolve();
      _resolved = true;
    }

    const resStr = stripFinalNewline(result as string);
    execOutputAPI.stderrArr.push({
      contents: resStr,
      timestamp: performance.now(),
    });
    _runObservers();
  });

  exec.on("error", (result) => {
    if (_readyPromiseInternals) {
      _readyPromiseInternals.reject(result);
    }
  });

  exec.on("spawn", () => {
    setTimeout(() => {
      if (_readyPromiseInternals && !_resolved) {
        _readyPromiseInternals.resolve();
        _resolved = true;
      }
    }, getConfig().renderAwaitTime);
  });

  exec.on("exit", (code) => {
    execOutputAPI.__exitCode = code ?? 0;
  });

  setCurrentInstance(execOutputAPI);

  await execOutputAPI._isReady;

  function getStdallStr(this: Omit<TestInstance, "getStdallStr">) {
    return this.stderrArr
      .concat(this.stdoutArr)
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
      .map((obj) => obj.contents)
      .join("\n");
  }

  return Object.assign(
    execOutputAPI,
    {
      userEvent: bindObjectFnsToInstance(execOutputAPI, userEvent as never),
      getStdallStr: getStdallStr.bind(execOutputAPI),
    },
    getQueriesForElement(execOutputAPI),
  ) as TestInstance as RenderResult;
}

function cleanup() {
  return Promise.all(Array.from(mountedInstances).map(cleanupAtInstance));
}

// maybe one day we'll expose this (perhaps even as a utility returned by render).
// but let's wait until someone asks for it.
async function cleanupAtInstance(instance: TestInstance) {
  await fireEvent.sigkill(instance);

  mountedInstances.delete(instance);
}

export { render, cleanup };
