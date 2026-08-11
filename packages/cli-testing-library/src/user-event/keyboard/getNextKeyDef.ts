import type { keyboardKey, keyboardOptions } from "./types";

enum bracketDict {
  "[" = "]",
}

/**
 * Get the next key from keyMap
 *
 * Named keys can be referenced by physical locations per `[code]`.
 * Everything else will be interpreted as a typed character - e.g. `a`.
 * The opening bracket `[` can be escaped by doubling it - e.g. `foo[[bar`
 * translates to `foo[bar`.
 */
export function getNextKeyDef(
  text: string,
  options: keyboardOptions,
): {
  keyDef: keyboardKey;
  consumedLength: number;
} {
  const descriptor = readNextDescriptor(text);
  const controlChord = readControlChord(text, descriptor, options);

  if (controlChord) return controlChord;

  return {
    keyDef: resolveKeyDef(descriptor, options),
    consumedLength: descriptor.consumedLength,
  };
}

type KeyDescriptor = ReturnType<typeof readNextDescriptor>;

function resolveKeyDef(
  { type, descriptor }: KeyDescriptor,
  options: keyboardOptions,
): keyboardKey {
  const mappedKey = options.keyboardMap.find((def) => {
    if (type === "[") {
      return def.code?.toLowerCase() === descriptor.toLowerCase();
    }
    return def.hex === descriptor;
  });

  if (mappedKey) return mappedKey;

  if (type === "") {
    return {
      code: descriptor,
      hex: descriptor,
    };
  }

  return {
    code: descriptor,
    hex: "Unknown",
  };
}

function readControlChord(
  text: string,
  descriptor: KeyDescriptor,
  options: keyboardOptions,
): { keyDef: keyboardKey; consumedLength: number } | undefined {
  if (
    descriptor.type !== "[" ||
    !["control", "ctrl"].includes(descriptor.descriptor.toLowerCase()) ||
    text.length === descriptor.consumedLength
  ) {
    return undefined;
  }

  const nextDescriptor = readNextDescriptor(
    text.slice(descriptor.consumedLength),
  );
  const nextKey = resolveKeyDef(nextDescriptor, options);
  const controlCharacter = toControlCharacter(nextKey.hex);

  if (controlCharacter === undefined) return undefined;

  return {
    keyDef: {
      code: `${descriptor.descriptor}+${nextDescriptor.descriptor}`,
      hex: controlCharacter,
    },
    consumedLength: descriptor.consumedLength + nextDescriptor.consumedLength,
  };
}

function toControlCharacter(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const characters = Array.from(value);
  if (characters.length !== 1) return undefined;

  const codePoint = characters[0]!.toUpperCase().codePointAt(0)!;

  if (codePoint === 0x20) return "\x00";
  if (codePoint >= 0x40 && codePoint <= 0x5f) {
    return String.fromCharCode(codePoint & 0x1f);
  }
  if (codePoint === 0x3f) return "\x7f";

  return undefined;
}

function readNextDescriptor(text: string) {
  let pos = 0;
  const startBracket =
    text[pos]! in bracketDict ? (text[pos] as keyof typeof bracketDict) : "";

  pos += startBracket.length;

  // `foo[[bar` is an escaped opening bracket at position 3.
  const startBracketRepeated = startBracket
    ? (text.match(new RegExp(`^\\${startBracket}+`)) as RegExpMatchArray)[0]
        .length
    : 0;
  const isEscapedChar = startBracketRepeated === 2;

  const type = isEscapedChar ? "" : startBracket;

  return {
    type,
    ...(type === "" ? readPrintableChar(text, pos) : readTag(text, pos, type)),
  };
}

function readPrintableChar(text: string, pos: number) {
  const codePoint = text.codePointAt(pos);
  const descriptor =
    codePoint === undefined ? undefined : String.fromCodePoint(codePoint);

  assertDescriptor(descriptor, text, pos);

  pos += descriptor.length;

  return {
    consumedLength: pos,
    descriptor,
    releasePrevious: false,
    releaseSelf: true,
    repeat: 1,
  };
}

function readTag(
  text: string,
  pos: number,
  startBracket: keyof typeof bracketDict,
) {
  const descriptor = text.slice(pos).match(/^\w+/)?.[0];

  assertDescriptor(descriptor, text, pos);

  pos += descriptor.length;

  const expectedEndBracket = bracketDict[startBracket];
  const endBracket = text[pos] === expectedEndBracket ? expectedEndBracket : "";

  if (!endBracket) {
    throw new Error(
      getErrorMessage(`"${expectedEndBracket}"`, text[pos], text),
    );
  }

  pos += endBracket.length;

  return {
    consumedLength: pos,
    descriptor,
  };
}

function assertDescriptor(
  descriptor: string | undefined,
  text: string,
  pos: number,
): asserts descriptor is string {
  if (!descriptor) {
    throw new Error(getErrorMessage("key descriptor", text[pos], text));
  }
}

function getErrorMessage(
  expected: string,
  found: string | undefined,
  text: string,
) {
  return `Expected ${expected} but found "${found ?? ""}" in "${text}"
    See https://github.com/testing-library/user-event/blob/main/README.md#keyboardtext-options
    for more information about how userEvent parses your input.`;
}
