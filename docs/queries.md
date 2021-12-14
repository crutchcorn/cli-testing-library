# About Queries

Queries are the methods that the CLI Testing Library gives you to find processes
in the command line. There are several types of queries ("get", "find",
"query"); the difference between them is whether the query will throw an error
if no CLI instance is found or if it will return a Promise and retry. Depending
on what app content you are selecting, different queries may be more or less
appropriate.

While our APIs [differ slightly](./differences.md) from upstream Testing
Library's,
[their "About Queries" page summarizes the goals and intentions of this project's queries quite well](https://testing-library.com/docs/queries/about/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Example](#example)
- [Types of Queries](#types-of-queries)
- [`TextMatch`](#textmatch)
  - [TextMatch Examples](#textmatch-examples)
  - [Precision](#precision)
  - [Normalization](#normalization)
    - [Normalization Examples](#normalization-examples)
- [ByText](#bytext)
  - [API](#api)
  - [Options](#options)
- [ByError](#byerror)
  - [API](#api-1)
  - [Options](#options-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Example

```javascript
import {render} from 'cli-testing-library'

test('should show login form', () => {
  const {getByText} = render('ftp-automation.sh')
  const input = getByText('Username')
  // Events and assertions...
})
```

# Types of Queries

- `getBy...`: Returns the matching CLI instance for a query, and throw a
  descriptive error if no instances match.
- `queryBy...`: Returns the matching CLI instance for a query, and return `null`
  if no instances match. This is useful for asserting an instance that is not
  present.
- `findBy...`: Returns a Promise which resolves when a CLI instance is found
  which matches the given query. The promise is rejected if no instance is found
  after a default timeout of 1000ms.

<details open>

<summary>Summary Table</summary>

<br />

| Type of Query | 0 Matches     | 1 Match        | >1 Matches  | Retry (Async/Await) |
| ------------- | ------------- | -------------- | ----------- | :-----------------: |
| `getBy...`    | Throw error   | Return element | Throw error |         No          |
| `queryBy...`  | Return `null` | Return element | Throw error |         No          |
| `findBy...`   | Throw error   | Return element | Throw error |         Yes         |

</details>

# `TextMatch`

Most of the query APIs take a `TextMatch` as an argument, which means the
argument can be either a _string_, _regex_, or a _function_ which returns `true`
for a match and `false` for a mismatch.

## TextMatch Examples

Given the following output string:

```html
Hello World
```

**_Will_ find the instance:**

```javascript
// Matching a string:
getByText('Hello World') // full string match
getByText('llo Worl', {exact: false}) // substring match
getByText('hello world', {exact: false}) // ignore case

// Matching a regex:
getByText(/World/) // substring match
getByText(/world/i) // substring match, ignore case
getByText(/^hello world$/i) // full string match, ignore case
getByText(/Hello W?oRlD/i) // substring match, ignore case, searches for "hello world" or "hello orld"

// Matching with a custom function:
getByText((content, instance) => content.startsWith('Hello'))
```

**_Will not_ find the instance:**

```javascript
// full string does not match
getByText('Goodbye World')

// case-sensitive regex with different case
getByText(/hello world/)

// function looking contents that don't exist:
getByText((content, instance) => {
  return instance.stdoutStr.includes('Goodbye World')
})
```

## Precision

Queries that take a `TextMatch` also accept an object as the final argument that
can contain options that affect the precision of string matching:

- `exact`: Defaults to `true`; matches full strings, case-sensitive. When false,
  matches substrings and is not case-sensitive.
  - `exact` has no effect on `regex` or `function` arguments.
  - In most cases using a regex instead of a string gives you more control over
    fuzzy matching and should be preferred over `{ exact: false }`.
- `normalizer`: An optional function which overrides normalization behavior. See
  [`Normalization`](#normalization).

## Normalization

Before running any matching logic against text in `stdout`,
`CLI Testing Library` automatically normalizes that text. By default,
normalization consists of trimming whitespace from the start and end of text,
collapsing multiple adjacent whitespace characters into a single space, and
removing [ANSI escapes](https://en.wikipedia.org/wiki/ANSI_escape_code).

If you want to prevent that normalization, or provide alternative normalization
(e.g. to remove Unicode control characters), you can provide a `normalizer`
function in the options object. This function will be given a string and is
expected to return a normalized version of that string.

> **Note**
>
> Specifying a value for `normalizer` _replaces_ the built-in normalization, but
> you can call `getDefaultNormalizer` to obtain a built-in normalizer, either to
> adjust that normalization or to call it from your own normalizer.

`getDefaultNormalizer` takes an options object which allows the selection of
behaviour:

- `trim`: Defaults to `true`. Trims leading and trailing whitespace
- `collapseWhitespace`: Defaults to `true`. Collapses inner whitespace
  (newlines, tabs, repeated spaces) into a single space.
- `stripAnsi`: Defaults to `true`. Removes ANSI escapes from `stdout` entirely
  to leave only human-readible text.

### Normalization Examples

To perform a match against text without trimming:

```javascript
getByText('text', {
  normalizer: getDefaultNormalizer({trim: false}),
})
```

To override normalization to remove some Unicode characters whilst keeping some
(but not all) of the built-in normalization behavior:

```javascript
getByText('text', {
  normalizer: str =>
    getDefaultNormalizer({trim: false})(str).replace(/[\u200E-\u200F]*/g, ''),
})
```

# ByText

> getByText, queryByText, findByText

## API

```typescript
getByText(
  // If you're using the return from `render`, then skip the container argument:
  instance: TestInstance,
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
```

This will search the instance to see if there's an `stdout` output matching the
given [`TextMatch`](queries/about.mdx#textmatch).

```html
Input your name:
```

```jsx
import {render} from 'cli-testing-library'

const {getByText} = render('command')
const instance = getByText(/input your name/i)
```

## Options

Contains all of the [TextMatch](#textmatch) options

# ByError

> getByError, queryByError, findByError

## API

```typescript
getByText(
  // If you're using the return from `render`, then skip the container argument:
  instance: TestInstance,
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
```

This will search the instance to see if there's an `stderr` output matching the
given [`TextMatch`](queries/about.mdx#textmatch).

```html
Could not find file
```

```jsx
import {render} from 'cli-testing-library'

const {getByError} = render('command')
const instance = getByError(/not find file/)
```

## Options

Contains all of the [TextMatch](#textmatch) options
