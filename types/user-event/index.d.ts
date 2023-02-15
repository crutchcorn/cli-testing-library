import {keyboard} from './keyboard/index'
declare const userEvent: {
  keyboard: typeof keyboard
}
export default userEvent
export type {keyboardKey} from './keyboard/index'
