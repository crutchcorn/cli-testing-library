import treeKill from 'tree-kill'

import {TestInstance} from '../types'

const isWin = process.platform === "win32";

const kill = (instance: TestInstance, signal: string | undefined) =>
  new Promise<void>((resolve, reject) => {
    if (!instance.pid || (instance.pid && instance.hasExit())) {
      resolve()
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    treeKill(instance.pid, signal, err => {
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
          !instance.hasExit()
        ) {
          console.warn('Ran into error while trying to kill process:')
          console.warn(err.toString())
          console.warn(`This is likely due to Window's permissions.
                Because this error is prevalent on CI Windows systems with the tree-kill package, we are attempting
                 an alternative kill method.`)
          console.warn()
          console.warn(
            'Be aware that this alternative kill method is not guaranteed to work with subprocesses, and they may not exit properly as a result.',
          )

          const didKill = instance.kill(signal as 'SIGKILL')
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
    })
  })

const eventMap = {
  sigterm: (instance: TestInstance) => kill(instance, isWin ? undefined : 'SIGTERM'),
  sigkill: (instance: TestInstance) => kill(instance, isWin ? undefined : 'SIGKILL'),
  write: (instance: TestInstance, props: {value: string}) =>
    instance.stdin.write(props.value),
}

export {eventMap}
