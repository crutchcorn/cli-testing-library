/**
 * I'm not going to pretend to know why `react-testing-library` calls a very similar
 * file "pure", but I am familiar enough with the concept of "pure" methods or whatnot
 * that I am not confident we are using it here properly. Plz no yell for the name
 * but suggestions for alternatives welcome in GH issues 😭🙏💯
 */
import childProcess from 'child_process'
import stripFinalNewline from 'strip-final-newline'
import stripAnsi from 'strip-ansi'
import {RenderOptions, TestInstance} from '../types/pure'
import {_runObservers} from './mutation-observer'
import {getQueriesForElement} from './get-queries-for-instance'

class NotBoundToInstanceError extends Error {
  constructor(prop: string) {
    super(`
          You've attempted to read '${prop}' from a destructured value.
          Please do not destructure \`${prop}\` from \`render\`, instead do something like this:
          
          const client = render( /* ... */ );
          expect(client.${prop}).toBe(["Hi"]);
          
          Because ${prop} relies on mutation to function, you'll be left with stale data if this is not done
        `)
  }
}

async function render(
  command: string,
  args: string[] = [],
  opts: Partial<RenderOptions> = {},
): Promise<TestInstance> {
  const {cwd = __dirname} = opts

  const exec = childProcess.spawn(command, args, {
    cwd,
    shell: true,
  })

  let _readyPromiseInternals: null | {resolve: Function; reject: Function} =
    null

  const execOutputAPI = {
    _isOutputAPI: true,
    _isReady: new Promise(
      (resolve, reject) => (_readyPromiseInternals = {resolve, reject}),
    ),
    // Clear buffer of stdout to do more accurate `t.regex` checks
    cleanup() {
      execOutputAPI.stdoutArr = []
    },
    // An array of strings gathered from stdout when unable to do
    // `await stdout` because of inquirer interactive prompts
    _stdoutArr: [] as string[],
    get stdoutArr(): string[] {
      // TODO: This error throwing doesn't _actually_ work, because
      //  when the value is initially destructured, `this`, _is_ defined
      //  and later, when the user goes to run `console.log(stdoutArr`), it's no
      //  longer referencing this getter - instead it's a new variable that's assigned
      //  a non-getter string
      if (!(this as unknown) || !this._isOutputAPI) {
        throw new NotBoundToInstanceError('stdoutArr')
      }
      return this._stdoutArr
    },
    set stdoutArr(val: string[]) {},
    get stdoutStr(): string {
      if (!(this as unknown) || !this._isOutputAPI) {
        throw new NotBoundToInstanceError('stdoutStr')
      }
      return this.stdoutArr.join('\n')
    },
    set stdoutStr(val: string) {},
  }

  exec.stdout.on('data', (result: string | Buffer) => {
    // TODO: Move `strip-ansi` to `normalizer` within `queries-text` instead
    const resStr = stripAnsi(stripFinalNewline(result as string).toString())
    execOutputAPI.stdoutArr.push(resStr)
    _runObservers()
    if (_readyPromiseInternals) _readyPromiseInternals.resolve()
  })

  exec.stdout.on('error', result => {
    if (_readyPromiseInternals) _readyPromiseInternals.reject(result)
  })

  exec.stderr.on('data', (result: string) => {
    if (_readyPromiseInternals) _readyPromiseInternals.reject(new Error(result))
  })

  await execOutputAPI._isReady

  return Object.assign(
    execOutputAPI,
    {
      stdin: exec.stdin,
      stdout: exec.stdout,
      stderr: exec.stderr,
    },
    getQueriesForElement(execOutputAPI),
  )
}

export {render}
