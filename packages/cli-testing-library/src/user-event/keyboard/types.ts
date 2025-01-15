export type keyboardOptions = {
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
