import {getNextKeyDef} from './getNextKeyDef'
import {TestInstance} from "../../../types";

/**
 * @internal Do not create/alter this by yourself as this type might be subject to changes.
 */
export type keyboardState = {
  /**
      All keys that have been pressed and not been lifted up yet.
    */
  pressed: {keyDef: keyboardKey; unpreventedDefault: boolean}[]

  /**
      Active modifiers
    */
  modifiers: {
    alt: boolean
    caps: boolean
    ctrl: boolean
    meta: boolean
    shift: boolean
  }

  /**
      The element the keyboard input is performed on.
      Some behavior might differ if the activeElement changes between corresponding keyboard events.
    */
  activeElement: Element | null

  /**
      For HTMLInputElements type='number':
      If the last input char is '.', '-' or 'e',
      the IDL value attribute does not reflect the input value.
    */
  carryValue?: string

  /**
      Carry over characters to following key handlers.
      E.g. ^1
    */
  carryChar: string

  /**
      Repeat keydown and keypress event
   */
  repeatKey?: ReturnType<typeof getNextKeyDef>
}

export type keyboardOptions = {
  /** Instance in which to perform the events */
  instance: TestInstance
  /** Delay between keystrokes */
  delay: number
  /** Keyboard layout to use */
  keyboardMap: keyboardKey[]
}

export interface keyboardKey {
  /** Physical location on a keyboard */
  code?: string
  /** Character or functional key hex code */
  hex?: string
}
