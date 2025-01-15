import {Matcher} from './matches'
import {SelectorMatcherOptions} from './query-helpers'
import {waitForOptions} from './wait-for'
import {TestInstance} from './pure'

export type QueryByText<T extends TestInstance = TestInstance> = (
  instance: TestInstance,
  id: Matcher,
  options?: SelectorMatcherOptions,
) => T | null

export type GetByText<T extends TestInstance = TestInstance> = (
  instance: TestInstance,
  id: Matcher,
  options?: SelectorMatcherOptions,
) => T

export type FindByText<T extends TestInstance = TestInstance> = (
  instance: TestInstance,
  id: Matcher,
  options?: SelectorMatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<T>

export type QueryByError<T extends TestInstance = TestInstance> = (
  instance: TestInstance,
  id: Matcher,
  options?: SelectorMatcherOptions,
) => T | null

export type GetByError<T extends TestInstance = TestInstance> = (
  instance: TestInstance,
  id: Matcher,
  options?: SelectorMatcherOptions,
) => T

export type FindByError<T extends TestInstance = TestInstance> = (
  instance: TestInstance,
  id: Matcher,
  options?: SelectorMatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<T>

export function getByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<GetByText<T>>
): ReturnType<GetByText<T>>
export function queryByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<QueryByText<T>>
): ReturnType<QueryByText<T>>
export function findByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<FindByText<T>>
): ReturnType<FindByText<T>>

export function getByError<T extends TestInstance = TestInstance>(
  ...args: Parameters<GetByError<T>>
): ReturnType<GetByError<T>>
export function queryByError<T extends TestInstance = TestInstance>(
  ...args: Parameters<QueryByError<T>>
): ReturnType<QueryByError<T>>
export function findByError<T extends TestInstance = TestInstance>(
  ...args: Parameters<FindByError<T>>
): ReturnType<FindByError<T>>
