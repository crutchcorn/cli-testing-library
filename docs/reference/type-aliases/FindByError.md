---
id: FindByError
title: FindByError
---

# Type Alias: FindByError\<T\>

```ts
type FindByError<T> = (instance, id, options?, waitForElementOptions?) => Promise<T>;
```

Defined in: [queries/error.ts:27](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/queries/error.ts#L27)

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

### waitForElementOptions?

[`waitForOptions`](../interfaces/waitForOptions.md)

## Returns

`Promise`\<`T`\>
