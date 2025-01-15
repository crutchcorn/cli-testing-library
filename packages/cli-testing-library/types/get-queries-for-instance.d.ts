import {TestInstance} from './pure'
import * as queries from './queries'

export function getQueriesForInstance<T extends Queries = typeof queries>(
  instance: TestInstance,
  queriesToBind?: T,
): BoundFunctions<T>
