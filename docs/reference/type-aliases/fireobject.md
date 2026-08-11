---
id: FireObject
title: FireObject
---

# Type Alias: FireObject

```ts
type FireObject = {
  [K in EventType]: (
    instance: TestInstance,
    options?: Parameters<EventMap[K]>[1],
  ) => boolean | Promise<void>;
};
```

Defined in: [events.ts:13](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/events.ts#L13)
