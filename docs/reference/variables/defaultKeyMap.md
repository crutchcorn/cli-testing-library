---
id: defaultKeyMap
title: defaultKeyMap
---

# Variable: defaultKeyMap

```ts
const defaultKeyMap: keyboardKey[];
```

Defined in: [user-event/keyboard/keyMap.ts:34](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/user-event/keyboard/keyMap.ts#L34)

Named key descriptors supported by the default terminal keyboard.

Printable text is written directly to stdin and deliberately does not need
an entry here. This map is reserved for named physical keys and terminal
escape sequences. The generated digit and letter entries preserve support
for descriptors such as `[Digit1]`, `[KeyA]`, and `[KeyLowerA]`.
