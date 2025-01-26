import * as defaultQueries from "./queries/index";
import type { TestInstance } from "./types";

export type BoundFunction<T> = T extends (
  container: TestInstance,
  ...args: infer P
) => infer R
  ? (...args: P) => R
  : never;

export type BoundFunctions<TQueries> = TQueries extends typeof defaultQueries
  ? {
      getByText: <T extends TestInstance = TestInstance>(
        ...args: Parameters<BoundFunction<defaultQueries.GetByText<T>>>
      ) => ReturnType<defaultQueries.GetByText<T>>;
      queryByText: <T extends TestInstance = TestInstance>(
        ...args: Parameters<BoundFunction<defaultQueries.QueryByText<T>>>
      ) => ReturnType<defaultQueries.QueryByText<T>>;
      findByText: <T extends TestInstance = TestInstance>(
        ...args: Parameters<BoundFunction<defaultQueries.FindByText<T>>>
      ) => ReturnType<defaultQueries.FindByText<T>>;
    } & {
      [P in keyof TQueries]: BoundFunction<TQueries[P]>;
    }
  : {
      [P in keyof TQueries]: BoundFunction<TQueries[P]>;
    };

export type Query = (
  container: TestInstance,
  ...args: Array<any>
) =>
  | Error
  | TestInstance
  | Array<TestInstance>
  | Promise<Array<TestInstance>>
  | Promise<TestInstance>
  | null;

export interface Queries {
  [T: string]: Query;
}

/**
 * @param instance
 * @param queries object of functions
 * @param initialValue for reducer
 * @returns returns object of functions bound to container
 */
function getQueriesForElement<T extends Queries = typeof defaultQueries>(
  instance: TestInstance,
  queries: T = defaultQueries as unknown as T,
  initialValue = {},
): BoundFunctions<T> {
  return Object.keys(queries).reduce((helpers, key) => {
    const fn = queries[key];
    helpers[key] = fn!.bind(null, instance);
    return helpers;
  }, initialValue as BoundFunctions<T>);
}

export { getQueriesForElement };
