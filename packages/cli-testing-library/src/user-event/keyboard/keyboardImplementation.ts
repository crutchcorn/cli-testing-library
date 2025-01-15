import {fireEvent} from '../../events'
import {wait} from '../utils'
import {TestInstance} from '../../../types'
import {getNextKeyDef} from './getNextKeyDef'
import {keyboardKey, keyboardOptions} from './types'

export async function keyboardImplementation(
  instance: TestInstance,
  text: string,
  options: keyboardOptions,
): Promise<void> {
  const {keyDef, consumedLength} = getNextKeyDef(text, options)

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
