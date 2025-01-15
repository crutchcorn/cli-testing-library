import {TestInstance} from '../../../types'
import {keyboardOptions, keyboardKey} from './types'
export type {keyboardOptions, keyboardKey}
export declare function keyboard(
  instance: TestInstance,
  text: string,
  options?: Partial<
    keyboardOptions & {
      delay: number
    }
  >,
): void | Promise<void>
export declare function keyboardImplementationWrapper(
  instance: TestInstance,
  text: string,
  config?: Partial<keyboardOptions>,
): {
  promise: Promise<void>
}
