import childProcess from 'child_process'
import stripFinalNewline from 'strip-final-newline'
import {RenderOptions, RenderResult, TestInstance} from '../types/pure.js'
import {_runObservers} from './mutation-observer.js'
import {getQueriesForElement} from './get-queries-for-instance.js'
import userEvent from './user-event/index.js'
import {bindObjectFnsToInstance, setCurrentInstance} from './helpers.js'
import {fireEvent} from './events.js'
import {getConfig} from './config.js'
import {logCLI} from './pretty-cli.js'

const mountedInstances = new Set<TestInstance>()

async function render(
  command: string,
  args: string[] = [],
  opts: Partial<RenderOptions> = {},
): Promise<RenderResult> {
  const {cwd = __dirname, spawnOpts = {}} = opts

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const exec = childProcess.spawn(command, args, {
    ...spawnOpts,
    cwd,
    shell: true,
  })

  let _readyPromiseInternals: null | {resolve: Function; reject: Function} =
    null

  let _resolved = false

  const execOutputAPI = {
    __exitCode: null as null | number,
    _isOutputAPI: true,
    _isReady: new Promise(
      (resolve, reject) => (_readyPromiseInternals = {resolve, reject}),
    ),
    process: exec,
    // Clear buffer of stdout to do more accurate `t.regex` checks
    clear() {
      execOutputAPI.stdoutArr = []
      execOutputAPI.stderrArr = []
    },
    debug(maxLength?: number) {
      logCLI(execOutputAPI, maxLength)
    },
    // An array of strings gathered from stdout when unable to do
    // `await stdout` because of inquirer interactive prompts
    stdoutArr: [] as Array<string | Buffer>,
    stderrArr: [] as Array<string | Buffer>,
    hasExit() {
      return this.__exitCode === null ? null : {exitCode: this.__exitCode}
    },
  }

  mountedInstances.add(execOutputAPI as unknown as TestInstance)

  exec.stdout.on('data', (result: string | Buffer) => {
    // `on('spawn') doesn't work the same way in Node12.
    // Instead, we have to rely on this working as-expected.
    if (_readyPromiseInternals && !_resolved) {
      _readyPromiseInternals.resolve()
      _resolved = true
    }

    const resStr = stripFinalNewline(result as string)
    execOutputAPI.stdoutArr.push(resStr)
    _runObservers()
  })

  exec.stderr.on('data', (result: string | Buffer) => {
    if (_readyPromiseInternals && !_resolved) {
      _readyPromiseInternals.resolve()
      _resolved = true
    }

    const resStr = stripFinalNewline(result as string)
    execOutputAPI.stderrArr.push(resStr)
    _runObservers()
  })

  exec.on('error', result => {
    if (_readyPromiseInternals) {
      _readyPromiseInternals.reject(result)
    }
  })

  exec.on('spawn', () => {
    setTimeout(() => {
      if (_readyPromiseInternals && !_resolved) {
        _readyPromiseInternals.resolve()
        _resolved = true
      }
    }, getConfig().renderAwaitTime)
  })

  exec.on('exit', code => {
    execOutputAPI.__exitCode = code ?? 0
  })

  setCurrentInstance(execOutputAPI)

  await execOutputAPI._isReady

  return Object.assign(
    execOutputAPI,
    {
      userEvent: bindObjectFnsToInstance(execOutputAPI, userEvent),
    },
    getQueriesForElement(execOutputAPI),
  ) as TestInstance as RenderResult
}

function cleanup() {
  return Promise.all([...mountedInstances].map(cleanupAtInstance))
}

// maybe one day we'll expose this (perhaps even as a utility returned by render).
// but let's wait until someone asks for it.
async function cleanupAtInstance(instance: TestInstance) {
  await fireEvent.sigkill(instance)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  mountedInstances.delete(instance)
}

export {render, cleanup}
