import { resolve } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render } from "../src/pure";
import { waitFor } from "../src/wait-for";
import { defaultKeyMap } from "../src/user-event/keyboard/keyMap";

const fixtureDirectory = resolve(__dirname, "./execute-scripts");

type DecodedKey = {
  code: string | null;
  ctrl: boolean;
  input: string | null;
  meta: boolean;
  name: string | null;
  sequenceHex: string;
  shift: boolean;
};

afterEach(async () => {
  await cleanup();
});

async function waitForExit(instance: Awaited<ReturnType<typeof render>>) {
  await waitFor(
    () => expect(instance.hasExit()).toMatchObject({ exitCode: 0 }),
    { instance, timeout: 2_000 },
  );
}

function readFixtureResult<T>(output: string, prefix: string): T {
  const resultLine = output
    .split(/\r?\n/)
    .find((line) => line.startsWith(prefix));

  if (!resultLine) throw new Error(`Fixture did not output ${prefix}`);

  return JSON.parse(resultLine.slice(prefix.length)) as T;
}

async function captureStdinBytes(input: string, expectedValue: string) {
  const expectedBytes = Buffer.from(expectedValue);
  const instance = await render(process.execPath, [
    resolve(fixtureDirectory, "stdin-bytes.js"),
    String(expectedBytes.length),
  ]);

  await instance.findByText("READY");
  instance.userEvent.keyboard(input);
  await instance.findByText("BYTES:");
  await waitForExit(instance);

  return readFixtureResult<{ hex: string; length: number }>(
    instance.getStdallStr(),
    "BYTES:",
  );
}

async function decodeKeys(input: string, expectedEventCount = 1) {
  const instance = await render(process.execPath, [
    resolve(fixtureDirectory, "readline-keys.js"),
    String(expectedEventCount),
  ]);

  await instance.findByText("READY");
  instance.userEvent.keyboard(input);
  await instance.findByText("KEYS:", undefined, { timeout: 2_000 });
  await waitForExit(instance);

  return readFixtureResult<Array<DecodedKey>>(instance.getStdallStr(), "KEYS:");
}

describe("stdin byte transport", () => {
  test("preserves printable ASCII and Unicode as UTF-8", async () => {
    const expected = `${Array.from({ length: 95 }, (_, index) =>
      String.fromCodePoint(0x20 + index),
    ).join("")} Grüße Ж 漢 👩🏽‍💻`;
    const input = expected.replaceAll("[", "[[");

    expect(await captureStdinBytes(input, expected)).toEqual({
      hex: Buffer.from(expected).toString("hex"),
      length: Buffer.byteLength(expected),
    });
  });

  test("preserves every default named key sequence", async () => {
    const input = defaultKeyMap.map(({ code }) => `[${code}]`).join("");
    const expected = defaultKeyMap.map(({ hex }) => hex).join("");

    expect(await captureStdinBytes(input, expected)).toEqual({
      hex: Buffer.from(expected).toString("hex"),
      length: Buffer.byteLength(expected),
    });
  });

  test("preserves generated Ctrl chord bytes", async () => {
    const chords = [
      ["[Ctrl+Space]", "\x00"],
      ["[Ctrl+C]", "\x03"],
      ["[Control+D]", "\x04"],
      ["[Ctrl+BracketLeft]", "\x1b"],
      ["[Ctrl+Backslash]", "\x1c"],
      ["[Ctrl+BracketRight]", "\x1d"],
      ["[Ctrl+^]", "\x1e"],
      ["[Ctrl+_]", "\x1f"],
      ["[Ctrl+?]", "\x7f"],
    ] as const;
    const input = chords.map(([descriptor]) => descriptor).join("");
    const expected = chords.map(([, value]) => value).join("");

    expect(await captureStdinBytes(input, expected)).toEqual({
      hex: Buffer.from(expected).toString("hex"),
      length: Buffer.byteLength(expected),
    });
  });
});

const readlineKeyCases = [
  ["Tab", "tab", false, false],
  ["Backspace", "backspace", false, false],
  ["Enter", "return", false, false],
  ["Escape", "escape", true, false],
  ["ShiftTab", "tab", false, true],
  ["ArrowUp", "up", false, false],
  ["ArrowDown", "down", false, false],
  ["ArrowRight", "right", false, false],
  ["ArrowLeft", "left", false, false],
  ["Home", "home", false, false],
  ["End", "end", false, false],
  ["Insert", "insert", false, false],
  ["Delete", "delete", false, false],
  ["PageUp", "pageup", false, false],
  ["PageDown", "pagedown", false, false],
  ...Array.from(
    { length: 12 },
    (_, index) => [`F${index + 1}`, `f${index + 1}`, false, false] as const,
  ),
] as const;

describe("Node readline decoding", () => {
  test.each(readlineKeyCases)(
    "decodes [%s] consistently",
    async (descriptor, expectedName, expectedMeta, expectedShift) => {
      const keyMapEntry = defaultKeyMap.find(({ code }) => code === descriptor);
      expect(keyMapEntry?.hex).toBeDefined();

      const [event] = await decodeKeys(`[${descriptor}]`);

      expect(event).toMatchObject({
        ctrl: false,
        meta: expectedMeta,
        name: expectedName,
        sequenceHex: Buffer.from(keyMapEntry!.hex!).toString("hex"),
        shift: expectedShift,
      });
    },
  );

  test.each([
    ["[Ctrl+C]", "c", "03"],
    ["[Control+D]", "d", "04"],
  ])("decodes %s as a Ctrl keypress", async (descriptor, name, sequenceHex) => {
    const [event] = await decodeKeys(descriptor);

    expect(event).toMatchObject({
      ctrl: true,
      meta: false,
      name,
      sequenceHex,
      shift: false,
    });
  });
});
