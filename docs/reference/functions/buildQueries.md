---
id: buildQueries
title: buildQueries
---

# Function: buildQueries()

```ts
function buildQueries(queryBy, getMissingError): readonly [<T>(container, ...args) => T, <T>(container, ...args) => T, <T>(instance, text, options?, waitForOptions?) => Promise<T>];
```

Defined in: [query-helpers.ts:115](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/query-helpers.ts#L115)

## Parameters

### queryBy

[`QueryMethod`](../type-aliases/QueryMethod.md)\<\[[`Matcher`](../type-aliases/Matcher.md), [`MatcherOptions`](../interfaces/MatcherOptions.md)\], `TestInstance` \| `null`\>

### getMissingError

[`GetErrorFunction`](../type-aliases/GetErrorFunction.md)\<\[[`Matcher`](../type-aliases/Matcher.md), [`MatcherOptions`](../interfaces/MatcherOptions.md)\]\>

## Returns

readonly \[\<`T`\>(`container`, ...`args`) => `T`, \<`T`\>(`container`, ...`args`) => `T`, \<`T`\>(`instance`, `text`, `options?`, `waitForOptions?`) => `Promise`\<`T`\>\]
