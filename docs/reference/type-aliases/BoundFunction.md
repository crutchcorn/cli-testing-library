---
id: BoundFunction
title: BoundFunction
---

# Type Alias: BoundFunction\<T\>

```ts
type BoundFunction<T> = T extends (container, ...args) => infer R ? (...args) => R : never;
```

Defined in: [get-queries-for-instance.ts:4](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/get-queries-for-instance.ts#L4)

## Type Parameters

### T

`T`
