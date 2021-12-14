# Configuration Options

## Introduction

The library can be configured via the `configure` function, which accepts:

- a plain JS object; this will be merged into the existing configuration. e.g.
  `configure({asyncUtilTimeout: 800})`
- a function; the function will be given the existing configuration, and should
  return a plain JS object which will be merged as above, e.g.
  `configure(existingConfig => ({something: [...existingConfig.something, 'extra value for the something array']}))`

## Options

### `showOriginalStackTrace`

By default, `waitFor` will ensure that the stack trace for errors thrown by
Testing Library is cleaned up and shortened so it's easier for you to identify
the part of your code that resulted in the error (async stack traces are hard to
debug). If you want to disable this, then set`showOriginalStackTrace` to
`false`. You can also disable this for a specific call in the options you pass
to `waitFor`.

### `throwSuggestions` (experimental)

When enabled, if [better queries](./queries.md) are available the
test will fail and provide a suggested query to use instead. Default to `false`.

To disable a suggestion for a single query just add `{suggest:false}` as an
option.

```js
getByText('foo', {suggest: false}) // will not throw a suggestion
```

### `getInstanceError`

A function that returns the error used when
[get or find queries](./queries.md#types-of-queries) fail. Takes the error
message and `TestInstance` object as arguments.

### `asyncUtilTimeout`

The global timeout value in milliseconds used by `waitFor` utilities. Defaults
to 1000ms.

### `renderAwaitTime`

By default, we wait for the CLI to `spawn` the command from `render`. If we immediately resolve 
the promise to allow users to query, however, we lose the ability to `getByText` immediately after rendering.
This [differs greatly from upstream Testing Library](./differences.md) and makes for a poor testing experience.

As a result, we wait this duration before resolving the promise after the process is spawned. This gives runtimes like
NodeJS time to spin up and execute commands.

Defaults to 100ms.
