import {keyboardKey} from './types'
/**
 * Mapping for a default US-104-QWERTY keyboard
 *
 * These use ANSI-C quoting, which seems to work for Linux, macOS, and Windows alike
 * @see https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#ANSI_002dC-Quoting
 * @see https://stackoverflow.com/questions/35429671/detecting-key-press-within-bash-scripts
 * @see https://gist.github.com/crutchcorn/2811db78a7b924cf54f4507198427fd2
 */
export declare const defaultKeyMap: keyboardKey[]
