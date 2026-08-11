---
id: QueryByText
title: QueryByText
---

# Type Alias: QueryByText\<T\>

```ts
type QueryByText<T> = (instance, id, options?) => T | null;
```

Defined in: [queries/text.ts:15](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/queries/text.ts#L15)

## Type Parameters

### T

`T` _extends_ `TestInstance` = `TestInstance`

## Parameters

### instance

`TestInstance`

### id

[`Matcher`](Matcher.md)

### options?

[`SelectorMatcherOptions`](../interfaces/SelectorMatcherOptions.md)

## Returns

`T` \| `null`
