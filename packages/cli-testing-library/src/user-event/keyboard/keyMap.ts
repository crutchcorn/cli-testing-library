import {keyboardKey} from './types'

/**
 * Mapping for a default US-104-QWERTY keyboard
 *
 * These use ANSI-C quoting, which seems to work for Linux, macOS, and Windows alike
 * @see https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#ANSI_002dC-Quoting
 * @see https://stackoverflow.com/questions/35429671/detecting-key-press-within-bash-scripts
 * @see https://gist.github.com/crutchcorn/2811db78a7b924cf54f4507198427fd2
 */
export const defaultKeyMap: keyboardKey[] = [
  // alphanumeric keys
  {code: 'Digit!', hex: '\x21'},
  {code: 'Digit#', hex: '\x23'},
  {code: 'Digit$', hex: '\x24'},
  {code: 'Digit%', hex: '\x25'},
  {code: 'Digit&', hex: '\x26'},
  {code: 'Digit(', hex: '\x29'},
  {code: 'Digit)', hex: '\x29'},
  {code: 'Digit*', hex: '\x2a'},
  {code: 'Digit-', hex: '\x2d'},
  {code: 'Digit@', hex: '\x40'},
  {code: 'Digit^', hex: '\x5e'},
  {code: 'Digit{', hex: '\x7b'},
  {code: 'Digit|', hex: '\x7c'},
  {code: 'Digit}', hex: '\x7d'},
  {code: 'Digit~', hex: '\x7e'},
  {code: 'Digit0', hex: '\x30'},
  {code: 'Digit1', hex: '\x31'},
  {code: 'Digit2', hex: '\x32'},
  {code: 'Digit3', hex: '\x33'},
  {code: 'Digit4', hex: '\x34'},
  {code: 'Digit5', hex: '\x35'},
  {code: 'Digit6', hex: '\x36'},
  {code: 'Digit7', hex: '\x37'},
  {code: 'Digit8', hex: '\x38'},
  {code: 'Digit9', hex: '\x39'},
  {code: 'KeyA', hex: '\x41'},
  {code: 'KeyB', hex: '\x42'},
  {code: 'KeyC', hex: '\x43'},
  {code: 'KeyD', hex: '\x44'},
  {code: 'KeyE', hex: '\x45'},
  {code: 'KeyF', hex: '\x46'},
  {code: 'KeyG', hex: '\x47'},
  {code: 'KeyH', hex: '\x48'},
  {code: 'KeyI', hex: '\x49'},
  {code: 'KeyJ', hex: '\x4a'},
  {code: 'KeyK', hex: '\x4b'},
  {code: 'KeyL', hex: '\x4c'},
  {code: 'KeyM', hex: '\x4d'},
  {code: 'KeyN', hex: '\x4e'},
  {code: 'KeyO', hex: '\x4f'},
  {code: 'KeyP', hex: '\x50'},
  {code: 'KeyQ', hex: '\x51'},
  {code: 'KeyR', hex: '\x52'},
  {code: 'KeyS', hex: '\x53'},
  {code: 'KeyT', hex: '\x54'},
  {code: 'KeyU', hex: '\x55'},
  {code: 'KeyV', hex: '\x56'},
  {code: 'KeyW', hex: '\x57'},
  {code: 'KeyX', hex: '\x58'},
  {code: 'KeyY', hex: '\x59'},
  {code: 'KeyZ', hex: '\x5a'},
  {code: 'Digit_', hex: '\x5f'},
  {code: 'KeyLowerA', hex: '\x61'},
  {code: 'KeyLowerB', hex: '\x62'},
  {code: 'KeyLowerC', hex: '\x63'},
  {code: 'KeyLowerD', hex: '\x64'},
  {code: 'KeyLowerE', hex: '\x65'},
  {code: 'KeyLowerF', hex: '\x66'},
  {code: 'KeyLowerG', hex: '\x67'},
  {code: 'KeyLowerH', hex: '\x68'},
  {code: 'KeyLowerI', hex: '\x69'},
  {code: 'KeyLowerJ', hex: '\x6a'},
  {code: 'KeyLowerK', hex: '\x6b'},
  {code: 'KeyLowerL', hex: '\x6c'},
  {code: 'KeyLowerM', hex: '\x6d'},
  {code: 'KeyLowerN', hex: '\x6e'},
  {code: 'KeyLowerO', hex: '\x6f'},
  {code: 'KeyLowerP', hex: '\x70'},
  {code: 'KeyLowerQ', hex: '\x71'},
  {code: 'KeyLowerR', hex: '\x72'},
  {code: 'KeyLowerS', hex: '\x73'},
  {code: 'KeyLowerT', hex: '\x74'},
  {code: 'KeyLowerU', hex: '\x75'},
  {code: 'KeyLowerV', hex: '\x76'},
  {code: 'KeyLowerW', hex: '\x77'},
  {code: 'KeyLowerX', hex: '\x78'},
  {code: 'KeyLowerY', hex: '\x79'},
  {code: 'KeyLowerZ', hex: '\x7a'},

  // alphanumeric block - functional
  {code: 'Space', hex: '\x20'},
  {code: 'Backspace', hex: '\x08'},
  {code: 'Enter', hex: '\x0D'},

  // function
  {code: 'Escape', hex: '\x1b'},

  // arrows
  {code: 'ArrowUp', hex: '\x1b\x5b\x41'},
  {code: 'ArrowDown', hex: '\x1B\x5B\x42'},
  {code: 'ArrowLeft', hex: '\x1b\x5b\x44'},
  {code: 'ArrowRight', hex: '\x1b\x5b\x43'},

  // control pad
  {code: 'Home', hex: '\x1b\x4f\x48'},
  {code: 'End', hex: '\x1b\x4f\x46'},
  {code: 'Delete', hex: '\x1b\x5b\x33\x7e'},
  {code: 'PageUp', hex: '\x1b\x5b\x35\x7e'},
  {code: 'PageDown', hex: '\x1b\x5b\x36\x7e'},

  // TODO: add mappings
]
