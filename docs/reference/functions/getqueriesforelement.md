---
id: getQueriesForElement
title: getQueriesForElement
---

# Function: getQueriesForElement()

```ts
function getQueriesForElement<T>(
  instance,
  queries?,
  initialValue?,
): BoundFunctions<T>;
```

Defined in: [get-queries-for-instance.ts:50](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/get-queries-for-instance.ts#L50)

## Type Parameters

### T

`T` _extends_ [`Queries`](../interfaces/Queries.md) = [`queries`](../cli-testing-library/namespaces/queries/index.md)

## Parameters

### instance

`TestInstance`

### queries?

`T` = `...`

object of functions

### initialValue?

for reducer

## Returns

[`BoundFunctions`](../type-aliases/BoundFunctions.md)\<`T`\>

returns object of functions bound to container
