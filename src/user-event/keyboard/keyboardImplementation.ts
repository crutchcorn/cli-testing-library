import {fireEvent} from '../../events.js'
import {wait} from '../utils.js'
import {TestInstance} from '../../../types/index.js'
import {getNextKeyDef} from './getNextKeyDef.js'
import {keyboardKey, keyboardOptions} from './types.js'

export async function keyboardImplementation(
  instance: TestInstance,
  text: string,
  options: keyboardOptions,
): Promise<void> {
  const {keyDef, consumedLength} = getNextKeyDef(text, options)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  keypress(keyDef, instance)

  if (text.length > consumedLength) {
    if (options.delay > 0) {
      await wait(options.delay)
    }

    return keyboardImplementation(instance, text.slice(consumedLength), options)
  }
  return void undefined
}

function keypress(keyDef: keyboardKey, instance: TestInstance) {
  fireEvent.write(instance, {value: keyDef.hex})
}
