import {TestInstance} from './pure'

export interface waitForOptions {
  container?: TestInstance
  timeout?: number
  interval?: number
  onTimeout?: (error: Error) => Error
}

export function waitFor<T>(
  callback: () => Promise<T> | T,
  options?: waitForOptions,
): Promise<T>
