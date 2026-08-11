---
id: waitFor
title: waitFor
---

# Function: waitFor()

```ts
function waitFor<T>(callback, options?): Promise<T>;
```

Defined in: [wait-for.ts:200](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/wait-for.ts#L200)

## Type Parameters

### T

`T`

## Parameters

### callback

() => `T` \| `Promise`\<`T`\>

### options?

[`waitForOptions`](../interfaces/waitForOptions.md)

## Returns

`Promise`\<`T`\>
