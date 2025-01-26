import { eventMap } from "./event-map";
import type { TestInstance } from "./types";

type EventMap = typeof eventMap;
export type EventType = keyof EventMap;

export type FireFunction = <TEventType extends EventType>(
  instance: TestInstance,
  event: TEventType,
  options?: Parameters<EventMap[TEventType]>[1],
) => boolean | Promise<void>;

export type FireObject = {
  [K in EventType]: (
    instance: TestInstance,
    options?: Parameters<EventMap[K]>[1],
  ) => boolean | Promise<void>;
};

const fireEvent: FireFunction & FireObject = ((
  instance,
  event,
  props = undefined,
) => {
  return eventMap[event](instance, props!);
}) satisfies FireFunction as never;

Object.entries(eventMap).forEach(([_eventName, _eventFn]) => {
  const eventName = _eventName as keyof typeof eventMap;
  const eventFn = _eventFn as (
    ...props: Array<unknown>
  ) => ReturnType<(typeof eventMap)[keyof typeof eventMap]>;
  fireEvent[eventName] = (instance, ...props) => {
    return eventFn(instance, ...props);
  };
});

export { fireEvent };
