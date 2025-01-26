---
title: "User Event"
---

[`user-event`][gh] is a helper that provides more advanced simulation of CLI
interactions than the [`fireEvent`](./fire-event) method.

## Import

`userEvent` can be used either as a global import or as returned from `render`:

```javascript
import {userEvent} from 'cli-testing-library'
```

Or:

```js
import {render} from 'cli-testing-library'

const {userEvent} = render('command')
```

## API

Note: All `userEvent` methods are synchronous with one exception: when `delay`
option used with `userEvent.keyboard` as described below. We also discourage
using `userEvent` inside `before/after` blocks at all, for important reasons
described in
["Avoid Nesting When You're Testing"](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing).

### `keyboard(instance, text, [options])`

Writes `text` inside a CLI's `stdin` buffer

```jsx
import {render} from 'cli-testing-library'

test('type', () => {
  const {getByText, userEvent} = render('command')

  userEvent.keyboard('Hello, World![Enter]')
  expect(getByText('Hello, world!')).toBeTruthy()
})
```

`options.delay` is the number of milliseconds that pass between two characters
are typed. By default it's 0. You can use this option if your component has a
different behavior for fast or slow users. If you do this, you need to make sure
to `await`!

<!-- space out these notes -->

Keystrokes can be described:

- Per printable character

  ```js
  userEvent.keyboard('foo') // translates to: f, o, o
  ```

  The bracket `[` is used as a special character and can be referenced by
  doubling it.

  ```js
  userEvent.keyboard('a[[') // translates to: a, [
  ```

- Per [special key mapping](../src/user-event/keyboard/keyMap.ts) with the `[`
  symbol

  ```js
  userEvent.keyboard('[ArrowLeft][KeyF][KeyO][KeyO]') // translates to: Left Arrow, f, o, o
  ```

  This does not keep any key pressed. So `Shift` will be lifted before pressing
  `f`.

The mapping of special character strings are performed by a
[default key map](../src/user-event/keyboard/keyMap.ts) portraying a "default"
US-keyboard. You can provide your own local keyboard mapping per option.

```js
userEvent.keyboard('?', {keyboardMap: myOwnLocaleKeyboardMap})
```

<!-- space out these notes -->

#### Special characters

We support inputting many special character strings with the `[` syntax
mentioned previously. Here are some of the ones that are supported:

| Text string    | Key name    |
| -------------- | ----------- |
| `[Enter]`      | Enter       |
| `[Space]`      | `' '`       |
| `[Escape]`     | Escape      |
| `[Backspace]`  | Backspace   |
| `[Delete]`     | Delete      |
| `[ArrowLeft]`  | Left Arrow  |
| `[ArrowRight]` | Right Arrow |
| `[ArrowUp]`    | Up Arrow    |
| `[ArrowDown]`  | Down Arrow  |
| `[Home]`       | Home        |
| `[End]`        | End         |

A full list of supported special characters that can be input can be found
[in our key mapping file](../src/user-event/keyboard/keyMap.ts).

[gh]: https://github.com/testing-library/user-event
