import type {
  GetErrorFunction,
  QueryMethod,
  WithSuggest,
} from '../types'
import {getSuggestedQuery, Variant} from './suggestions'
import {waitFor, waitForOptions as WaitForOptions} from './wait-for'
import {getConfig} from './config'
import {TestInstance} from "./types";
import {Matcher, MatcherOptions} from "./matches";

function getInstanceError(message: string | null, instance: TestInstance) {
  return getConfig().getInstanceError(message, instance)
}

function getSuggestionError(
  suggestion: {toString(): string},
  container: TestInstance,
) {
  return getConfig().getInstanceError(
    `A better query is available, try this:
${suggestion.toString()}
`,
    container,
  )
}

// this accepts a query function and returns a function which throws an error
// if an empty list of elements is returned
function makeGetQuery<Arguments extends unknown[]>(
  queryBy: (instance: TestInstance, ...args: Arguments) => TestInstance | null,
  getMissingError: GetErrorFunction<Arguments>,
) {
  return <T extends TestInstance = TestInstance>(instance: TestInstance, ...args: Arguments): T => {
    const el = queryBy(instance, ...args)
    if (!el) {
      throw getConfig().getInstanceError(
        getMissingError(instance, ...args),
        instance,
      )
    }

    return el as T
  }
}

// this accepts a getter query function and returns a function which calls
// waitFor and passing a function which invokes the getter.
function makeFindQuery<QueryFor>(
  getter: (
    container: TestInstance,
    text: Matcher,
    options?: MatcherOptions,
  ) => QueryFor,
) {
  return <T extends TestInstance = TestInstance>(
    instance: TestInstance,
    text: Matcher,
    options?: MatcherOptions,
    waitForOptions?: WaitForOptions,
  ): Promise<T> => {
    return waitFor(
      () => {
        return getter(instance, text, options) as unknown as T
      },
      {instance, ...waitForOptions},
    )
  }
}

const wrapSingleQueryWithSuggestion =
  <Arguments extends unknown[]>(
    query: (container: TestInstance, ...args: Arguments) => TestInstance | null,
    queryByName: string,
    variant: Variant,
  ) =>
  (<T extends TestInstance = TestInstance>(container: TestInstance, ...args: Arguments): T => {
    const instance = query(container, ...args)
    const [{suggest = getConfig().throwSuggestions} = {}] = args.slice(-1) as [
      WithSuggest,
    ]
    if (instance && suggest) {
      const suggestion = getSuggestedQuery(instance, variant)
      if (suggestion && !queryByName.endsWith(suggestion.queryName as string)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw getSuggestionError(suggestion.toString(), container)
      }
    }

    return instance as T
  })

// TODO: This deviates from the published declarations
// However, the implementation always required a dyadic (after `container`) not variadic `queryAllBy` considering the implementation of `makeFindQuery`
// This is at least statically true and can be verified by accepting `QueryMethod<Arguments, TestInstance[]>`
function buildQueries(
  queryBy: QueryMethod<
    [matcher: Matcher, options?: MatcherOptions],
    TestInstance | null
  >,
  getMissingError: GetErrorFunction<
    [matcher: Matcher, options?: MatcherOptions]
  >,
) {
  const getBy = makeGetQuery(queryBy, getMissingError)

  const queryByWithSuggestions = wrapSingleQueryWithSuggestion(
    queryBy,
    queryBy.name,
    'get',
  )

  const getByWithSuggestions = wrapSingleQueryWithSuggestion(
    getBy,
    queryBy.name,
    'get',
  )

  const findBy = makeFindQuery(
    wrapSingleQueryWithSuggestion(getBy, queryBy.name, 'find'),
  )

  return [queryByWithSuggestions, getByWithSuggestions, findBy] as const;
}

export {
  getInstanceError,
  wrapSingleQueryWithSuggestion,
  makeFindQuery,
  buildQueries,
}
