---
title: "Migrating from v3 to v4"
---

This guide covers the keyboard-input changes that may affect tests when
upgrading from CLI Testing Library v3 to v4. It does not cover unrelated v4
changes.

## Summary

Version 4 of CLI Testing Library moves the library to ESM rather than CJS. This means that the minimum Node version required to use this tool is now 22.18.0, and the library must be imported with `import` rather than `require`.

This version also changes `userEvent.keyboard` from a manually enumerated character
map into a text-and-terminal-key encoder:

- Printable text and Unicode are written directly to stdin.
- Ctrl chords use an atomic descriptor such as `[Ctrl+C]`.
- Named terminal keys remain in `defaultKeyMap`.
- `defaultKeyMap` is exported so custom descriptors can extend it.

These changes remove the need to add every printable character to the key map,
but they also change a few observable behaviors described below.

## Migration checklist

- Migrate away from CJS instance of library
- Replace Ctrl workarounds with `[Ctrl+<key>]` descriptors.
- Update assertions that expected `Unknown` for printable or Unicode input.
- Remove printable-character entries from custom keyboard maps.
- Verify terminal-specific custom keys on every operating system in your test
  matrix.

## Use atomic Ctrl chord descriptors

Version 3 did not include built-in Ctrl chord support. Tests commonly used
`fireEvent.write` as a workaround:

```js
fireEvent.write(instance, { value: "\x03" });
```

In version 4, use a single chord descriptor:

```js
userEvent.keyboard("[Ctrl+C]");
userEvent.keyboard("[Ctrl+D]");
userEvent.keyboard("[Ctrl+Space]");
```

`[Control+C]` is also accepted. Named operands can be used when punctuation is
hard to read or conflicts with descriptor syntax:

```js
userEvent.keyboard("[Ctrl+KeyC]");
userEvent.keyboard("[Ctrl+BracketLeft]");
userEvent.keyboard("[Ctrl+Backslash]");
```

Do not use `[CtrlC]`. Without the `+`, it is interpreted as a named key called
`CtrlC`, not as a chord.

See [Chording](./user-event.md#chording) for the complete chord behavior and
timing semantics.

## Printable text no longer needs map entries

In version 3, a printable character missing from the manual map was written as
`Unknown`. Version 4 writes printable and Unicode text directly:

```js
userEvent.keyboard('/test-dir\\name?filter="active"');
userEvent.keyboard("Grüße 👋");
```

This is intentionally observable. Update tests that asserted `Unknown` for
previously unsupported punctuation or Unicode to assert the actual input.

The opening bracket still begins a named descriptor. Double it to type a
literal opening bracket:

```js
userEvent.keyboard("[[value]"); // types: [value]
```

## Custom keyboard maps

Custom maps should now describe named terminal keys or application-specific
actions, rather than enumerate printable text. Extend the exported default map
when adding a descriptor:

```js
import { defaultKeyMap } from "cli-testing-library";

userEvent.keyboard("[Confirm]", {
  keyboardMap: [
    { code: "Confirm", hex: "\r" },
    ...defaultKeyMap,
  ],
});
```

The first matching descriptor wins, so put overrides before
`...defaultKeyMap`.

`Ctrl` and `Control` are modifier names on the left side of `+` inside a chord
descriptor. They are not standalone named keys.

## Named key additions

Version 4 adds names for Tab, Shift+Tab, Insert, common punctuation keys, and
F1 through F12. Existing Enter, Escape, Backspace, arrow, Home, End, Delete,
Page Up, and Page Down descriptors retain their previous byte sequences.

The default sequences target Node `readline` and xterm-compatible input. CLI
programs that require a real TTY or a different terminal protocol may still
need a custom map or direct `fireEvent.write` calls.
