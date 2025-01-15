import {keyboardKey, keyboardOptions} from './types'

enum bracketDict {
  '[' = ']',
}

/**
 * Get the next key from keyMap
 *
 * Keys can be referenced by `{key}` or `{special}` as well as physical locations per `[code]`.
 * Everything else will be interpreted as a typed character - e.g. `a`.
 * Brackets `{` and `[` can be escaped by doubling - e.g. `foo[[bar` translates to `foo[bar`.
 */
export function getNextKeyDef(
  text: string,
  options: keyboardOptions,
): {
  keyDef: keyboardKey
  consumedLength: number
} {
  const {type, descriptor, consumedLength} = readNextDescriptor(text)

  const keyDef: keyboardKey = options.keyboardMap.find(def => {
    if (type === '[') {
      return def.code?.toLowerCase() === descriptor.toLowerCase()
    }
    return def.hex === descriptor
  }) ?? {
    code: descriptor,
    hex: 'Unknown',
  }

  return {
    keyDef,
    consumedLength,
  }
}

function readNextDescriptor(text: string) {
  let pos = 0
  const startBracket =
    text[pos] in bracketDict ? (text[pos] as keyof typeof bracketDict) : ''

  pos += startBracket.length

  // `foo[[bar` is an escaped char at position 3,
  // but `foo[[[>5}bar` should be treated as `{` pressed down for 5 keydowns.
  const startBracketRepeated = startBracket
    ? (text.match(new RegExp(`^\\${startBracket}+`)) as RegExpMatchArray)[0]
        .length
    : 0
  const isEscapedChar = startBracketRepeated === 2

  const type = isEscapedChar ? '' : startBracket

  return {
    type,
    ...(type === '' ? readPrintableChar(text, pos) : readTag(text, pos, type)),
  }
}

function readPrintableChar(text: string, pos: number) {
  const descriptor = text[pos]

  assertDescriptor(descriptor, text, pos)

  pos += descriptor.length

  return {
    consumedLength: pos,
    descriptor,
    releasePrevious: false,
    releaseSelf: true,
    repeat: 1,
  }
}

function readTag(
  text: string,
  pos: number,
  startBracket: keyof typeof bracketDict,
) {
  const descriptor = text.slice(pos).match(/^\w+/)?.[0]

  assertDescriptor(descriptor, text, pos)

  pos += descriptor.length

  const expectedEndBracket = bracketDict[startBracket]
  const endBracket = text[pos] === expectedEndBracket ? expectedEndBracket : ''

  if (!endBracket) {
    throw new Error(getErrorMessage(`"${expectedEndBracket}"`, text[pos], text))
  }

  pos += endBracket.length

  return {
    consumedLength: pos,
    descriptor,
  }
}

function assertDescriptor(
  descriptor: string | undefined,
  text: string,
  pos: number,
): asserts descriptor is string {
  if (!descriptor) {
    throw new Error(getErrorMessage('key descriptor', text[pos], text))
  }
}

function getErrorMessage(
  expected: string,
  found: string | undefined,
  text: string,
) {
  return `Expected ${expected} but found "${found ?? ''}" in "${text}"
    See https://github.com/testing-library/user-event/blob/main/README.md#keyboardtext-options
    for more information about how userEvent parses your input.`
}
