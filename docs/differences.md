# Differences Between `@testing-library/dom` and `cli-testing-library`

While we clearly take inspiration from [`DOM Testing Library`](https://github.com/testing-library/dom-testing-library)
and [`React Testing Library`](https://github.com/testing-library/react-testing-library),
and try to do our best to align as much as possible, there are some major distinctions between
the project's APIs.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Instances](#instances)
- [Queries](#queries)
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

# Similarities

This isn't to say that we're not dedicated to being aligned with upstream. We would love to work with the broader Testing Library
community to figure out these problems and adjust our usage.

This is the primary reason the library is still published as an `@alpha`, despite being stable enough to successfully
power [a popular CLI application](https://github.com/plopjs/plop/)'s testbed.

What's more, we're dedicated enough to making this happen that we've made sure to:

- Use the same source code organization (as much as possible) as `DOM Testing Library` and `React Testing Library`
- Use the same deployment process as `DOM Testing Library`
- Use similar documentation styles

And more!
