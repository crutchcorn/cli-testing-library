# About Queries

Queries are the methods that the CLI Testing Library gives you to find processes in the command line. 
There are several types of queries ("get", "find", "query"); the difference between them 
is whether the query will throw an error if no CLI instance is found or if it will return 
a Promise and retry. Depending on what app content you are selecting, different 
queries may be more or less appropriate.

While our APIs [differ slightly](./differences.md) from upstream Testing Library's,
[their "About Queries" page summarizes the goals and intentions of this project's queries quite well](https://testing-library.com/docs/queries/about/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Example](#example)
- [Types of Queries](#types-of-queries)

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

- `getBy...`: Returns the matching CLI instance for a query, and throw a descriptive
  error if no instances match.
- `queryBy...`: Returns the matching CLI instance for a query, and return `null` if no
  instances match. This is useful for asserting an instance that is not present.
- `findBy...`: Returns a Promise which resolves when a CLI instance is found which
  matches the given query. The promise is rejected if no instance is found after a 
  default timeout of 1000ms.

<details open>

<summary>Summary Table</summary>

<br />

| Type of Query         | 0 Matches     | 1 Match        | >1 Matches   | Retry (Async/Await) |
| --------------------- | ------------- | -------------- | ------------ | :-----------------: |
| `getBy...`            | Throw error   | Return element | Throw error  |         No          |
| `queryBy...`          | Return `null` | Return element | Throw error  |         No          |
| `findBy...`           | Throw error   | Return element | Throw error  |         Yes         |

</details>
