import { afterEach, describe, expect, test, vi } from "vitest";
import { getNextKeyDef } from "../src/user-event/keyboard/getNextKeyDef";
import { defaultKeyMap } from "../src/user-event/keyboard/keyMap";
import { keyboardImplementation } from "../src/user-event/keyboard/keyboardImplementation";
import type { TestInstance } from "../src/types";

const options = { delay: 0, keyboardMap: defaultKeyMap };

afterEach(() => {
  vi.useRealTimers();
});

function encodeKeyboardInput(text: string): string {
  let remainingText = text;
  let output = "";

  while (remainingText) {
    const { keyDef, consumedLength } = getNextKeyDef(remainingText, options);
    output += keyDef.hex;
    remainingText = remainingText.slice(consumedLength);
  }

  return output;
}

describe("printable input", () => {
  test("writes every printable ASCII character without a map entry", () => {
    for (let codePoint = 0x20; codePoint <= 0x7e; codePoint++) {
      const character = String.fromCodePoint(codePoint);
      const input = character === "[" ? "[[" : character;

      expect(encodeKeyboardInput(input)).toBe(character);
    }
  });

  test.each(["é", "Ж", "漢", "👋", "👩🏽‍💻"])(
    "writes the Unicode text %s without a map entry",
    (text) => {
      expect(encodeKeyboardInput(text)).toBe(text);
    },
  );
});

describe("named keys", () => {
  test("preserves generated digit and letter descriptors", () => {
    expect(encodeKeyboardInput("[Digit1][KeyA][KeyLowerB]")).toBe("1Ab");
  });

  test("supports common editing, navigation, and function keys", () => {
    expect(encodeKeyboardInput("[Tab][ShiftTab][Insert][F1][F12]")).toBe(
      "\x09\x1b[Z\x1b[2~\x1bOP\x1b[24~",
    );
  });

  test("keeps the existing Unknown result for an unknown descriptor", () => {
    expect(encodeKeyboardInput("[NotAKey]")).toBe("Unknown");
  });
});

describe("Ctrl chords", () => {
  test("does not define standalone Ctrl descriptors", () => {
    expect(
      defaultKeyMap.some((key) =>
        ["ctrl", "control"].includes(key.code?.toLowerCase() ?? ""),
      ),
    ).toBe(false);
  });

  test.each([
    ["[Ctrl+C]", "\x03"],
    ["[Control+D]", "\x04"],
    ["[Ctrl+BracketLeft]", "\x1b"],
    ["[Ctrl+Backslash]", "\x1c"],
    ["[Ctrl+BracketRight]", "\x1d"],
    ["[Ctrl+^]", "\x1e"],
    ["[Ctrl+_]", "\x1f"],
    ["[Ctrl+?]", "\x7f"],
    ["[Ctrl+Space]", "\x00"],
    ["[Ctrl+KeyC]", "\x03"],
  ])("encodes %s", (input, expected) => {
    expect(encodeKeyboardInput(input)).toBe(expected);
  });

  test("does not interpret sequential descriptors as a chord", () => {
    expect(encodeKeyboardInput("[Ctrl]c")).toBe("Unknownc");
  });
});

describe("keyboard implementation", () => {
  function createInstance() {
    const write = vi.fn(() => true);
    const instance = {
      process: { stdin: { write } },
    } as unknown as TestInstance;

    return { instance, write };
  }

  test("handles long text iteratively", async () => {
    const { instance, write } = createInstance();
    const text = "a".repeat(20_000);

    await keyboardImplementation(instance, text, options);

    expect(write).toHaveBeenCalledTimes(text.length);
  });

  test("delays between encoded keys", async () => {
    vi.useFakeTimers();
    const { instance, write } = createInstance();

    const typing = keyboardImplementation(instance, "ab", {
      ...options,
      delay: 10,
    });

    expect(write).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(10);
    await typing;

    expect(write).toHaveBeenCalledTimes(2);
  });
});
