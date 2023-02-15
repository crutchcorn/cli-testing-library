import type {eventMap} from './event-map'
import {TestInstance} from './pure'

type EventMap = typeof eventMap
export type EventType = keyof EventMap

export type FireFunction = <K extends EventType>(
  instance: TestInstance,
  event: K,
  options?: Parameters<EventMap[K]>[1],
) => boolean
export type FireObject = {
  [K in EventType]: (
    instance: TestInstance,
    options?: Parameters<EventMap[K]>[1],
  ) => boolean
}

export const fireEvent: FireFunction & FireObject
