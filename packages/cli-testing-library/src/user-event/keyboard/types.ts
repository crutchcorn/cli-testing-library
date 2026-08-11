export type keyboardOptions = {
  /** Delay between keystrokes */
  delay: number;
  /** Keyboard layout to use */
  keyboardMap: Array<keyboardKey>;
};

export interface keyboardKey {
  /** Named key descriptor, such as `Enter` or `ArrowLeft` */
  code?: string;
  /** String written to stdin (historically named `hex`) */
  hex?: string;
}
