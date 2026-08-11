---
id: wrapSingleQueryWithSuggestion
title: wrapSingleQueryWithSuggestion
---

# Function: wrapSingleQueryWithSuggestion()

```ts
function wrapSingleQueryWithSuggestion<TArguments>(
  query,
  queryByName,
  variant,
): <T>(container, ...args) => T;
```

Defined in: [query-helpers.ts:89](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/query-helpers.ts#L89)

## Type Parameters

### TArguments

`TArguments` _extends_ `unknown`[]

## Parameters

### query

(`container`, ...`args`) => `TestInstance` \| `null`

### queryByName

`string`

### variant

`Variant`

## Returns

\<`T`\>(`container`, ...`args`) => `T`
