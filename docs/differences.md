# Differences Between `cli-testing-library` & Testing Library

While we clearly take inspiration from [`DOM Testing Library`](https://github.com/testing-library/dom-testing-library)
and [`React Testing Library`](https://github.com/testing-library/react-testing-library),
and try to do our best to align as much as possible, there are some major distinctions between
the project's APIs.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Instances](#instances)
- [Queries](#queries)
- [Events](#events)
- [Matchers](#matchers)
- [Similarities](#similarities)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Instances

While the `DOM Testing Library` and it's descendants have a concept of both a `container` and `element`, `CLI Testing Library`
only has a single concept to replace them both: a `TestInstance`.

This is because, while the DOM makes a clear distinction between different elements (say, [`HTMLBodyElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLBodyElement)
and [`HTMLDivElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement)), there is no such distinction between
processes in the CLI as far as I'm aware.

While this may change in the future (maybe `container` can be a sort of `TestProcess` of some kind), there are
[unanswered questions around what that API looks like and whether we can meaningfully handle the distinction](https://github.com/crutchcorn/cli-testing-library/issues/2).

# Queries

Similarly, `HTMLElement`s provide clean lines between user input items. Meanwhile, the CLI only has the concepts of `stdin`, `stdout`, and `stderr`.
It's unclear how matching a single line of `stdout` would help in a beneficial matter, much less how APIs like `fireEvent`
would utilize this seemingly extraneous metadata.

As a result, we don't have any `*AllBy` queries that `DOM Testing Library` does. All of our queries are non-plural (`*By`)
and will simply return either the test instance the query was called on, or `null` depending on the query.

While we would be happy to reconsider, there are once again
[lots of questions around what `*AllBy` queries would like and whether we can meaningfully use that concept](https://github.com/crutchcorn/cli-testing-library/issues/2).

# Events

Another area where we diverge from the DOM is in our event system (as implemented via `fireEvent` and `userEvent`).

Despite our APIs' naming indicating an actual event system (complete with bubbling and more, like the DOM),
the CLI has no such concept.

This means that, while `fireEvent` in the `DOM Testing Library` has the ability to inherent from all
baked-into-browser events, we must hard-code a list of "events" and actions a user may take.

We try our best to implement ones that make sense:

- `fireEvent.write({value: str})` to write `str` into stdin
- `fireEvent.sigkill()` to send a [sigkill](https://en.wikipedia.org/wiki/Signal_(IPC)#SIGKILL) to the process
- `fireEvent.sigint()` to send a [sigint](https://en.wikipedia.org/wiki/Signal_(IPC)#SIGINT) to the process

There is a missing API for that might make sense in `keypress`. It's unclear what this behavior would do that `write` wouldn't
be able to.

There's also the API of `userEvent` that allows us to implement a fairly similar `keyboard` event
[to upstream](https://testing-library.com/docs/ecosystem-user-event/#keyboardtext-options). However, there are a few differences
here as well:

1) `userEvent` can be bound to the `render` output. This is due to limitations of not having a `screen` API. It's unclear how
    this would work in practice, due to a lack of the `window` API.
2) `userEvent.keyboard` does not support modifier keys. It's only key-presses, no holding. This is because of API 
    differences that would require us to figure out a manual binding system for every single key using ANSI AFAIK.

# Matchers

While most of this document has been talking about `DOM Testing Library` and `React Testing Library`,
let's take a moment to talk about [`jest-dom`](https://github.com/testing-library/jest-dom) matchers.

Usually, in a Testing Library testbed, you'd expect a `getByText` to look something like this:

```javascript
const {getByText} = render(/* Something */)

expect(getByText('Hello World')).toBeInTheDocument();
```

However, in today's version of `CLI Testing Library`, the same would look something like this:

```javascript
const {getByText} = render(/* Something */)

expect(getByText('Hello World')).toBeTruthy();
```

This is because, unlike `DOM Testing Library`, our TestInstances do not have parental relationships. As
a result, what would be a fitting replacement for `document`?

That said, because `toBeInTheDocument` is implemented by `jest-dom`, we can absolutely implement something
similar in our codebase if requested. We have some thoughts around the technical aspects, but [we'd love to jump
deeper into that discussion with others](https://github.com/crutchcorn/cli-testing-library/issues/2)

# Similarities

None of this is to say that we're not dedicated to being aligned with upstream. We would love to work with the broader Testing Library
community to figure out these problems and adjust our usage.

This is the primary reason the library is still published as an `@alpha`, despite being stable enough to successfully
power [a popular CLI application](https://github.com/plopjs/plop/)'s testbed.

What's more, we're dedicated enough to making this happen that we've made sure to:

- Use the same source code organization (as much as possible) as `DOM Testing Library` and `React Testing Library`
- Use the same deployment process as `DOM Testing Library`
- Use similar documentation styles

And more!
