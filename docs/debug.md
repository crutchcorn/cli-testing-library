# Debug

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Automatic Logging](#automatic-logging)
- [`prettyCLI`](#prettycli)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Automatic Logging

When you use any `get` calls in your test cases, the current state of the
`testInstance` (CLI) gets printed on the console. For example:

```javascript
// Hello world
getByText(container, 'Goodbye world') // will fail by throwing error
```

The above test case will fail, however it prints the state of your DOM under
test, so you will get to see:

```
Unable to find an element with the text: Goodbye world. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
Here is the state of your container:

Hello world
```

Note: Since the CLI size can get really large, you can set the limit of CLI
content to be printed via environment variable `DEBUG_PRINT_LIMIT`. The default
value is `7000`. You will see `...` in the console, when the CLI content is
stripped off, because of the length you have set or due to default size limit.
Here's how you might increase this limit when running tests:

```
DEBUG_PRINT_LIMIT=10000 npm test
```

This works on macOS/Linux, you'll need to do something else for Windows. If
you'd like a solution that works for both, see
[`cross-env`](https://www.npmjs.com/package/cross-env).

## `prettyCLI`

Built on top of [`strip-ansi`](https://github.com/chalk/strip-ansi) this helper
function can be used to print out readable representation of the CLI `stdout` of
a process. This can be helpful for instance when debugging tests.

It is defined as:

```typescript
function prettyDOM(instance: TestInstance, maxLength?: number): string
```

It receives the `TestInstance` to print out, an optional extra parameter to
limit the size of the resulting string, for cases when it becomes too large.

This function is usually used alongside `console.log` to temporarily print out
CLI outputs during tests for debugging purposes:

This function is what also powers
[the automatic debugging output described above](#debugging).
