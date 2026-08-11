import type { keyboardKey } from "./types";

const digitKeys: Array<keyboardKey> = Array.from(
  { length: 10 },
  (_, digit) => ({
    code: `Digit${digit}`,
    hex: String(digit),
  }),
);

const letterKeys: Array<keyboardKey> = Array.from(
  { length: 26 },
  (_, offset) => {
    const uppercaseLetter = String.fromCharCode("A".charCodeAt(0) + offset);

    return [
      { code: `Key${uppercaseLetter}`, hex: uppercaseLetter },
      {
        code: `KeyLower${uppercaseLetter}`,
        hex: uppercaseLetter.toLowerCase(),
      },
    ];
  },
).flat();

/**
 * Named key descriptors supported by the default terminal keyboard.
 *
 * Printable text is written directly to stdin and deliberately does not need
 * an entry here. This map is reserved for named physical keys and terminal
 * escape sequences. The generated digit and letter entries preserve support
 * for descriptors such as `[Digit1]`, `[KeyA]`, and `[KeyLowerA]`.
 */
export const defaultKeyMap: Array<keyboardKey> = [
  ...digitKeys,
  ...letterKeys,

  // Named printable physical keys
  { code: "Space", hex: " " },
  { code: "Backquote", hex: "`" },
  { code: "Minus", hex: "-" },
  { code: "Equal", hex: "=" },
  { code: "BracketLeft", hex: "[" },
  { code: "BracketRight", hex: "]" },
  { code: "Backslash", hex: "\\" },
  { code: "Semicolon", hex: ";" },
  { code: "Quote", hex: "'" },
  { code: "Comma", hex: "," },
  { code: "Period", hex: "." },
  { code: "Slash", hex: "/" },

  // Editing and control keys
  { code: "Tab", hex: "\x09" },
  { code: "Backspace", hex: "\x08" },
  { code: "Enter", hex: "\x0d" },
  { code: "Escape", hex: "\x1b" },
  { code: "ShiftTab", hex: "\x1b[Z" },

  // Navigation keys
  { code: "ArrowUp", hex: "\x1b[A" },
  { code: "ArrowDown", hex: "\x1b[B" },
  { code: "ArrowRight", hex: "\x1b[C" },
  { code: "ArrowLeft", hex: "\x1b[D" },
  { code: "Home", hex: "\x1bOH" },
  { code: "End", hex: "\x1bOF" },
  { code: "Insert", hex: "\x1b[2~" },
  { code: "Delete", hex: "\x1b[3~" },
  { code: "PageUp", hex: "\x1b[5~" },
  { code: "PageDown", hex: "\x1b[6~" },

  // Function keys (common xterm-compatible sequences)
  { code: "F1", hex: "\x1bOP" },
  { code: "F2", hex: "\x1bOQ" },
  { code: "F3", hex: "\x1bOR" },
  { code: "F4", hex: "\x1bOS" },
  { code: "F5", hex: "\x1b[15~" },
  { code: "F6", hex: "\x1b[17~" },
  { code: "F7", hex: "\x1b[18~" },
  { code: "F8", hex: "\x1b[19~" },
  { code: "F9", hex: "\x1b[20~" },
  { code: "F10", hex: "\x1b[21~" },
  { code: "F11", hex: "\x1b[23~" },
  { code: "F12", hex: "\x1b[24~" },
];
