<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Firing Events](#firing-events)
  - [`fireEvent`](#fireevent)
  - [`fireEvent[eventName]`](#fireeventeventname)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Firing Events

> **Note**
>
> Most projects have a few use cases for `fireEvent`, but the majority of the
> time you should probably use [`userEvent`](./user-event).

## `fireEvent`

```typescript
fireEvent(instance: TestInstance, event: EventString, eventProperties?: Object)
```

Fire CLI events.

```javascript
fireEvent(getByText(instance, 'Username:'), 'write', {value: 'crutchcorn'})
```

## `fireEvent[eventName]`

```typescript
fireEvent[eventName](instance: TestInstance, eventProperties?: Object)
```

Convenience methods for firing CLI events. Check out
[src/event-map.js](../src/event-map.ts) for a full list as well as default
`eventProperties`.
