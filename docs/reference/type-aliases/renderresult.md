---
id: RenderResult
title: RenderResult
---

# Type Alias: RenderResult

```ts
type RenderResult = TestInstance &
  object & { [P in keyof typeof queries]: BoundFunction<(typeof queries)[P]> };
```

Defined in: [pure.ts:32](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/pure.ts#L32)

## Type Declaration

### userEvent

```ts
userEvent: { [P in keyof UserEvent]: BoundFunction<UserEvent[P]> };
```
