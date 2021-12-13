# Matchers

The `cli-testing-library` provides a set of custom jest matchers that you can
use to extend jest. These will make your tests more declarative, clear to read
and to maintain.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
  - [With TypeScript](#with-typescript)
- [Custom matchers](#custom-matchers)
  - [`toBeInTheConsole`](#tobeintheconsole)
    - [Examples](#examples)
  - [`toHaveErrorMessage`](#tohaveerrormessage)
    - [Examples](#examples-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

Import `cli-testing-library/extend-expect` once (for instance in your
[tests setup file](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array))
and you're good to go:

```javascript
// In your own jest-setup.js (or any other name)
import 'cli-testing-library/extend-expect'

// In jest.config.js add (if you haven't already)
setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
```

### With TypeScript

If you're using TypeScript, make sure your setup file is a `.ts` and not a `.js`
to include the necessary types.

You will also need to include your setup file in your `tsconfig.json` if you
haven't already:

```json
  // In tsconfig.json
  "include": [
    ...
    "./jest-setup.ts"
  ],
```

## Custom matchers

### `toBeInTheConsole`

```typescript
toBeInTheConsole()
```

This allows you to assert whether an instance is present or not. Useful when
combined with queries (such as `getByText` or `getByError`) that return the
`TestInstance`

#### Examples

```html
Input your name:
```

```javascript
expect(getByText(instance, 'Input your name:')).toBeInTheConsole()
```

<hr />

### `toHaveErrorMessage`

```typescript
toHaveErrorMessage(text: string | RegExp)
```

This allows you to check whether the given instance has an `stderr` message or
not.

Whitespace is normalized.

When a `string` argument is passed through, it will perform a whole
case-sensitive match to the error message text.

To perform a case-insensitive match, you can use a `RegExp` with the `/i`
modifier.

To perform a partial match, you can pass a `RegExp`.

#### Examples

```html
File not found in output
```

```javascript
expect(instance).toHaveErrorMessage('File not found in output')
```
