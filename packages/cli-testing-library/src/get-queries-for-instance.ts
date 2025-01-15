import * as defaultQueries from './queries'
import * as queries from "../types/queries";
import { TestInstance } from './types';


export type BoundFunction<T> = T extends (
    container: TestInstance,
    ...args: infer P
  ) => infer R
  ? (...args: P) => R
  : never

export type BoundFunctions<Q> = Q extends typeof queries
  ? {
  getByText<T extends TestInstance = TestInstance>(
    ...args: Parameters<BoundFunction<queries.GetByText<T>>>
  ): ReturnType<queries.GetByText<T>>
  queryByText<T extends TestInstance = TestInstance>(
    ...args: Parameters<BoundFunction<queries.QueryByText<T>>>
  ): ReturnType<queries.QueryByText<T>>
  findByText<T extends TestInstance = TestInstance>(
    ...args: Parameters<BoundFunction<queries.FindByText<T>>>
  ): ReturnType<queries.FindByText<T>>
} & {
  [P in keyof Q]: BoundFunction<Q[P]>
}
  : {
    [P in keyof Q]: BoundFunction<Q[P]>
  }

export type Query = (
  container: TestInstance,
  ...args: any[]
) =>
  | Error
  | TestInstance
  | TestInstance[]
  | Promise<TestInstance[]>
  | Promise<TestInstance>
  | null

export interface Queries {
  [T: string]: Query
}

/**
 * @param {TestInstance} instance
 * @param {FuncMap} queries object of functions
 * @param {Object} initialValue for reducer
 * @returns {FuncMap} returns object of functions bound to container
 */
function getQueriesForElement<T extends Queries = typeof queries>(
  instance: TestInstance,
  queries?: T = defaultQueries,
): BoundFunctions<T> {
  return Object.keys(queries).reduce((helpers, key) => {
    const fn = queries[key]
    helpers[key] = fn.bind(null, instance)
    return helpers
  }, {})
}

export {getQueriesForElement}
