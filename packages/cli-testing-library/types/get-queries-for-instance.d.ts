import {TestInstance} from './pure'
import * as queries from './queries'

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

export function getQueriesForInstance<T extends Queries = typeof queries>(
  instance: TestInstance,
  queriesToBind?: T,
): BoundFunctions<T>
