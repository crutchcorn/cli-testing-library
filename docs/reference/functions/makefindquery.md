---
id: makeFindQuery
title: makeFindQuery
---

# Function: makeFindQuery()

```ts
function makeFindQuery<TQueryFor>(
  getter,
): <T>(instance, text, options?, waitForOptions?) => Promise<T>;
```

Defined in: [query-helpers.ts:66](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/query-helpers.ts#L66)

## Type Parameters

### TQueryFor

`TQueryFor`

## Parameters

### getter

(`container`, `text`, `options?`) => `TQueryFor`

## Returns

\<`T`\>(`instance`, `text`, `options?`, `waitForOptions?`) => `Promise`\<`T`\>
