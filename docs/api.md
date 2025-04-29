---
title: "API"
---

`CLI Testing Library`, despite taking clear inspiration from, does not re-export
anything from
[`DOM Testing Library`](https://testing-library.com/docs/dom-testing-library/).
Likewise, while we've done our best to match the API names of
[Testing Library's Core API](https://testing-library.com/docs/), because of the
inherent differences between CLI apps and web apps, we're unable to match all of
them.

> Know of a Testing Library Core API that you think would fit here that isn't
> present?
> [Let us know!](https://github.com/crutchcorn/cli-testing-library/issues)

Instead, the following API is what `CLI Testing Library` provides the following.

# `render`

```typescript
function render(
  command: string,
  args: string[],
  options?: {
    /* You won't often use this, expand below for docs on options */
  },
): RenderResult
```

Run the CLI application in a newly spawned process.

```javascript
import {render} from 'cli-testing-library'

render('node', ['./path/to/script.js'])
```

```javascript
import {render} from 'cli-testing-library'

test('renders a message', () => {
  const {getByText} = render('node', ['./console-out.js'])
  expect(getByText('Hello, world!')).toBeTruthy()
})
```

# `render` Options

You won't often need to specify options, but if you ever do, here are the
available options which you could provide as a third argument to `render`.

## `cwd`

By default, `CLI Testing Library` will run the new process in the working
directory of your project's root, as defined by your testing framework. If you
provide your own working directory via this option, it will change the execution
directory of your process.

For example: If you are end-to-end testing a file moving script, you don't want
to have to specify the absolute path every time. In this case, you can specify a
directory as the render `cwd`.

```javascript
const containingPath = path.resolve(__dirname, './movables')

const {getByText} = render('node', ['mover.js'], {
  cwd: containingPath,
})
```

## `spawnOpts`

Oftentimes, you want to modify the behavior of the spawn environment. This may
include things like changing the shell that's used to run scripts or more.

This argument allows you to configure the options that are passed to the
underlying
[`child_process.spawn` NodeJS API](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options).

```javascript
const {getByText} = render('script.ps1', {
  spawnOpts: {
    shell: 'powershell.exe',
  },
})
```

# `render` Result

The `render` method returns an object that has a few properties:

## `...queries`

The most important feature of render is that the queries from
[CLI Testing Library](https://github.com/crutchcorn/cli-testing-library) are
automatically returned with their first argument bound to the testInstance.

See [Queries](./queries.md) to learn more about how to use these queries and the
philosophy behind them.

### ByText

> getByText, queryByText, findByText

```typescript
getByText(
        // If you're using `screen`, then skip the container argument:
        instance: TestInstance,
        text: TextMatch,
        options?: {
          exact?: boolean = true,
          trim?: boolean = false,
          stripAnsi?: boolean = false,
          collapseWhitespace?: boolean = false,
          normalizer?: NormalizerFn,
          suggest?: boolean,
        }): TestInstance
```

Queries for test instance `stdout` results with the given text (and it also
accepts a TextMatch).

These options are all standard for text matching. To learn more, see our
[Queries page](./queries.md).

## `userEvent[eventName]`

```javascript
userEvent[eventName](...eventProps)
```

> While `userEvent` isn't usually returned on `render` in, say,
> `React Testing Library`, we're able to do so because of our differences in
> implementation with upstream. See our [Differences](./differences.md) doc for
> more.

This object is the same as described with
[`userEvent` documentation](./user-event.md) with the key difference that
`instance` is not expected to be passed when bound to `render`.

## `debug`

This method is a shortcut for `console.log(prettyCLI(instance)).`

```javascript
import {render} from 'cli-testing-library'

const {debug} = render('command')
debug()
// Hello, world! How are you?
//
// you can also pass an instance: debug(getByText('message'))
// and you can pass all the same arguments to debug as you can
// to prettyCLI:
// const maxLengthToPrint = 10000
// debug(getByText('message'), maxLengthToPrint)
```

This is a simple wrapper around `prettyCLI` which is also exposed and comes from
[CLI Testing Library](./debug.md).

## `hasExit`

This method allows you to check if the spawned process has exit, and if so, what
exit code it closed with.

```javascript
const instance = render('command')

await waitFor(() => expect(instance.hasExit()).toMatchObject({exitCode: 1}))
```

This method returns `null` if still running, but `{exitCode: number}` if it has
exit

## `process`

The spawned process created by your rendered `TestInstnace`. It's a
`child_instance`. This is a
[regularly spawned process](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options),
so you can call `process.pid` etc. to inspect the process.

## `stdoutArr`/`stderrArr`

Each of these is an array of what's output by their respective `std`\* pipe.
This is used internally to create the [`debug`methods](./debug.md) and more.
They're defined as:

```typescript
interface TestInstance {
  stdoutArr: Array<{contents: Buffer | string; timestamp: number}>
  stderrArr: Array<{contents: Buffer | string; timestamp: number}>
}
```

## `clear`

This method acts as the terminal `clear` command might on most systems. It
allows you to clear out the buffers for `stdoutArr` and `stderrArr` - even in
the middle of processing - in order to do more narrowed queries.

# `cleanup`

`SIGKILL`s processes that were spawned with render and have not halted by the
end of the test.

> Please note that this is done automatically if the testing framework you're
> using supports the `afterEach` global and it is injected to your testing
> environment (like mocha, Jest, Vitest, and Jasmine). If not, you will need to do
> manual cleanups after each test.

For example, if you're using the [ava](https://github.com/avajs/ava) testing
framework, then you would need to use the `test.afterEach` hook like so:

```javascript
import {cleanup, render} from 'cli-testing-library'
import test from 'ava'

test.afterEach(cleanup)

test('renders into document', () => {
  render('long-running-command')
  // ...
})

// ... more tests ...
```

Failing to call cleanup when you've called render could result in Jest failing
to close due to unclosed handles and tests which are not "idempotent" (which can
lead to difficult to debug errors in your tests).
