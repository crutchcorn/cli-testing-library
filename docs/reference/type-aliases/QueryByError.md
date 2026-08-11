---
id: QueryByError
title: QueryByError
---

# Type Alias: QueryByError\<T\>

```ts
type QueryByError<T> = (instance, id, options?) => T | null;
```

Defined in: [queries/error.ts:15](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/queries/error.ts#L15)

## Type Parameters

### T

`T` *extends* `TestInstance` = `TestInstance`

## Parameters

### instance

`TestInstance`

### id

[`Matcher`](Matcher.md)

### options?

[`SelectorMatcherOptions`](../interfaces/SelectorMatcherOptions.md)

## Returns

`T` \| `null`
