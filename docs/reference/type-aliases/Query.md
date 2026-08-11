---
id: Query
title: Query
---

# Type Alias: Query

```ts
type Query = (container, ...args) => 
  | Error
  | TestInstance
  | TestInstance[]
  | Promise<TestInstance[]>
  | Promise<TestInstance>
  | null;
```

Defined in: [get-queries-for-instance.ts:29](https://github.com/crutchcorn/cli-testing-library/blob/main/packages/cli-testing-library/src/get-queries-for-instance.ts#L29)

## Parameters

### container

`TestInstance`

### args

...`any`[]

## Returns

  \| `Error`
  \| `TestInstance`
  \| `TestInstance`[]
  \| `Promise`\<`TestInstance`[]\>
  \| `Promise`\<`TestInstance`\>
  \| `null`
