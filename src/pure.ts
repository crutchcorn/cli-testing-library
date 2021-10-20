/**
 * I'm not going to pretend to know why `react-testing-library` calls a very similar
 * file "pure", but I am familiar enough with the concept of "pure" methods or whatnot
 * that I am not confident we are using it here properly. Plz no yell for the name
 * but suggestions for alternatives welcome in GH issues 😭🙏💯
 */
import childProcess from "child_process";
import stripFinalNewline from "strip-final-newline";
import {RenderOptions, TestInstance} from "../types/pure";
import {_runObservers} from './mutation-observer';
import {getQueriesForElement} from "./get-queries-for-instance";

async function render(command: string, args: string[] = [], opts: Partial<RenderOptions> = {}): Promise<TestInstance> {
  const { cwd = __dirname } = opts;

  const exec = childProcess.spawn(
      command,
      args,
      {
        cwd,
        shell: true,
      }
  );

  let _readyPromiseInternals: null | {resolve: Function, reject: Function} = null;

  const execOutputAPI = {
    _isReady: new Promise(
        (resolve, reject) => (_readyPromiseInternals = { resolve, reject })
    ),
    // Clear buffer of stdout to do more accurate `t.regex` checks
    cleanup() {
      this.stdoutArr = [];
    },
    // An array of strings gathered from stdout when unable to do
    // `await stdout` because of inquirer interactive prompts
    stdoutArr: [] as string[],
    get stdoutStr(): string {
      return this.stdoutArr.join("\n");
    },
  };

  exec.stdout.on("data", (result: string | Buffer) => {
    const resStr = stripFinalNewline(result as string).toString();
    execOutputAPI.stdoutArr.push(resStr);
    _runObservers();
    if (_readyPromiseInternals) _readyPromiseInternals.resolve();
  });

  exec.stdout.on("error", (result) => {
    if (_readyPromiseInternals) _readyPromiseInternals.reject(result);
  });

  exec.stderr.on("data", (result: string) => {
    if (_readyPromiseInternals)
      _readyPromiseInternals.reject(new Error(result));
  });

  await execOutputAPI._isReady;

  return Object.assign(execOutputAPI, {
    stdin: exec.stdin,
    stdout: exec.stdout,
    stderr: exec.stderr,
  }, getQueriesForElement(execOutputAPI));
}

export {
  render
};
