import {TestInstance} from '../../../types/index.js'
import {keyboardImplementation} from './keyboardImplementation.js'
import {defaultKeyMap} from './keyMap.js'
import {keyboardOptions, keyboardKey} from './types.js'

export type {keyboardOptions, keyboardKey}

export function keyboard(
  instance: TestInstance,
  text: string,
  options?: Partial<keyboardOptions & {delay: number}>,
): void | Promise<void> {
  const {promise} = keyboardImplementationWrapper(instance, text, options)

  if ((options?.delay ?? 0) > 0) {
    return promise
  } else {
    // prevent users from dealing with UnhandledPromiseRejectionWarning in sync call
    promise.catch(console.error)
  }
}

export function keyboardImplementationWrapper(
  instance: TestInstance,
  text: string,
  config: Partial<keyboardOptions> = {},
) {
  const {delay = 0, keyboardMap = defaultKeyMap} = config
  const options = {
    delay,
    keyboardMap,
  }

  return {
    promise: keyboardImplementation(instance, text, options),
  }
}
