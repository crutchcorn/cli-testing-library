---
id: FindByText
title: FindByText
---

# Type Alias: FindByText\<T\>

```ts
type FindByText<T> = (
  instance,
  id,
  options?,
  waitForElementOptions?,
) => Promise<T>;
```

Defined in: [queries/text.ts:27](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/queries/text.ts#L27)

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

### waitForElementOptions?

[`waitForOptions`](../interfaces/waitForOptions.md)

## Returns

`Promise`\<`T`\>
