import {Matcher} from './matches'
import {SelectorMatcherOptions} from './query-helpers'
import {waitForOptions} from './wait-for'
import {TestInstance} from './pure'

export type QueryByText<T extends TestInstance = TestInstance> = (
  instance: TestInstance,
  id: Matcher,
  options?: SelectorMatcherOptions,
) => T | null
//
// export type AllByText<T extends TestInstance = TestInstance> = (
//   instance: TestInstance,
//   id: Matcher,
//   options?: SelectorMatcherOptions,
// ) => T[]

export type FindAllByText<T extends TestInstance = TestInstance> = (
  instance: TestInstance,
  id: Matcher,
  options?: SelectorMatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<T[]>

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

export function getByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<GetByText<T>>
): ReturnType<GetByText<T>>
export function getAllByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<AllByText<T>>
): ReturnType<AllByText<T>>
export function queryByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<QueryByText<T>>
): ReturnType<QueryByText<T>>
export function queryAllByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<AllByText<T>>
): ReturnType<AllByText<T>>
export function findByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<FindByText<T>>
): ReturnType<FindByText<T>>
export function findAllByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<FindAllByText<T>>
): ReturnType<FindAllByText<T>>
