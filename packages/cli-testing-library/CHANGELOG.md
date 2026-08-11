# cli-testing-library

## 4.0.0

### Major Changes

- 1caf209: Upgrade runtime dependencies to their latest major versions, require Node.js 22.18 or newer, publish ESM-only output built with tsdown, and spawn commands without a shell by default.

### Patch Changes

- 654a64f: Stop overriding test-runner globals in TypeScript consumers.
- b99a257: Write printable and Unicode text without manual key-map entries, support Ctrl
  chords through descriptors such as `[Ctrl+C]`, and add common terminal keys to
  `userEvent.keyboard`.
