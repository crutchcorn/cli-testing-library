import {fireEvent} from '../../events'
import {wait} from '../utils'
import {TestInstance} from "../../../types";
import {getNextKeyDef} from './getNextKeyDef'
import {
  keyboardKey,
  keyboardState,
  keyboardOptions,
} from './types'

export async function keyboardImplementation(
  instance: TestInstance,
  text: string,
  options: keyboardOptions,
  state: keyboardState,
): Promise<void> {
  const {keyDef, consumedLength, releasePrevious, releaseSelf, repeat} =
    state.repeatKey ?? getNextKeyDef(text, options)

    if (!releasePrevious) {
      keypress(keyDef, instance)
  }

  if (repeat > 1) {
    state.repeatKey = {
      // don't consume again on the next iteration
      consumedLength: 0,
      keyDef,
      releasePrevious,
      releaseSelf,
      repeat: repeat - 1,
    }
  } else {
    delete state.repeatKey
  }

  if (text.length > consumedLength || repeat > 1) {
    if (options.delay > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await wait(options.delay)
    }

    return keyboardImplementation(instance, text.slice(consumedLength), options, state)
  }
  return void undefined
}

function keypress(
  keyDef: keyboardKey,
  instance: TestInstance,
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  fireEvent.write(instance, keyDef.hex);
}
