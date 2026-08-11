---
id: FireFunction
title: FireFunction
---

# Type Alias: FireFunction

```ts
type FireFunction = <TEventType>(instance, event, options?) => boolean | Promise<void>;
```

Defined in: [events.ts:7](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/events.ts#L7)

## Type Parameters

### TEventType

`TEventType` *extends* [`EventType`](EventType.md)

## Parameters

### instance

`TestInstance`

### event

`TEventType`

### options?

`Parameters`\<`EventMap`\[`TEventType`\]\>\[`1`\]

## Returns

`boolean` \| `Promise`\<`void`\>
