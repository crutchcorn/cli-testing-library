# CLI Testing Library

[CLI Testing Library](https://github.com/crutchcorn/cli-testing-library)
implements as-close-as-possible API to
[DOM Testing Library](https://github.com/testing-library/dom-testing-library)
and
[React Testing Library](https://github.com/testing-library/react-testing-library),
but for E2E CLI tests instead.

```
npm install --save-dev cli-testing-library
```

- [`cli-testing-library` on GitHub](https://github.com/crutchcorn/cli-testing-library)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The problem](#the-problem)
- [This solution](#this-solution)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# The problem

You want to write maintainable tests for your CLI applications. As a part of
this goal, you want your tests to avoid including implementation details of your
CLI and rather focus on making your tests give you the confidence for which they
are intended. As part of this, you want your testbase to be maintainable in the
long run so refactors of your CLI (changes to implementation but not
functionality) don't break your tests and slow you and your team down.

# This solution

The `CLI Testing Library` is a very light-weight solution for testing CLI
applications (whether written in NodeJS or not). The main utilities it provides
involve querying `stdout` in a way that's similar to how a user interacts with
CLI. In this way, the library helps ensure your tests give you confidence in
your UI code. The `CLI Testing Library`'s primary guiding principle is:

> [The more your tests resemble the way your software is used, the more confidence they can give you.](https://testing-library.com/docs/guiding-principles/)

As part of this goal, the utilities this library provides facilitate querying
the CLI in the same way the user would. Finding text output with readable text,
as opposed to ansi escapes interrupting (just like a user would focus on),
sending keyboard events (like a user would), and more.

This library encourages your applications to be more robust with user input and
allows you to get your tests closer to using your command line the way a user
will, which allows your tests to give you more confidence that your application
will work when a real user uses it.

**What this library is not**:

1. A test runner or framework
2. Specific to a testing framework (though we recommend Jest as our preference,
   the library works with any framework.)

# Further Reading

- [API reference for `render` and friends](./api.md)
- [Jest matchers](./matchers.md)
- [Mock user input](./user-event.md)
- [Manually fire input events](./fire-event.md)
- [Output matching queries](./queries.md)
- [Debugging "CLI Testing Library" tests](./debug.md)
- [Configure library options](./configure.md)
- [Differences between us and other "Testing Library" projects](./differences.md)
