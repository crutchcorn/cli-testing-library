import treeKill from 'tree-kill'
import {TestInstance} from '../types'
import {getConfig} from './config'

export const killProc = (instance: TestInstance, signal: string | undefined) =>
  new Promise<void>((resolve, reject) => {
    if (!instance.process.pid || (instance.process.pid && instance.hasExit())) {
      resolve()
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    treeKill(instance.process.pid, signal, async err => {
      try {
        if (err) {
          if (
            err.message.includes('The process') &&
            err.message.includes('not found.')
          ) {
            resolve()
            return
          }
          if (
            err.message.includes('could not be terminated') &&
            err.message.includes('There is no running instance of the task.') &&
            instance.hasExit()
          ) {
            resolve()
            return
          }
          const isOperationNotSupported = err.message.includes('The operation attempted is not supported.');
          const isAccessDenied = err.message.includes('Access is denied.');
          if (err.message.includes('could not be terminated') && (isOperationNotSupported || isAccessDenied)) {
            const sleep = (t: number) => new Promise(r => setTimeout(r, t))
            await sleep(getConfig().errorDebounceTimeout)
            if (instance.hasExit()) {
              resolve()
              return
            }
            console.warn('Ran into error while trying to kill process:')
            console.warn(err.toString())
            console.warn(`This is likely due to Window's permissions.
                Because this error is prevalent on CI Windows systems with the tree-kill package, we are attempting
                 an alternative kill method.`)
            console.warn()
            console.warn(
              'Be aware that this alternative kill method is not guaranteed to work with subprocesses, and they may not exit properly as a result.',
            )

            const didKill = instance.process.kill(signal as 'SIGKILL')
            if (didKill) {
              resolve()
            } else {
              console.error(
                'Alternative kill method failed. Rejecting with original error.',
              )
              reject(err)
            }
            return
          }
          reject(err)
        } else resolve()
      } catch (e: unknown) {
        reject(e)
      }
    })
  })
