import { getSuggestedQuery } from "./suggestions";
import { waitFor } from "./wait-for";
import { getConfig } from "./config";
import type { waitForOptions as WaitForOptions } from "./wait-for";
import type { Variant } from "./suggestions";
import type { TestInstance } from "./types";
import type { Matcher, MatcherOptions } from "./matches";

export type WithSuggest = { suggest?: boolean };

export type GetErrorFunction<TArguments extends Array<any> = [string]> = (
  c: TestInstance | null,
  ...args: TArguments
) => string;

export interface SelectorMatcherOptions extends MatcherOptions {
  selector?: string;
  ignore?: boolean | string;
}

export type QueryMethod<TArguments extends Array<any>, TReturn> = (
  container: TestInstance,
  ...args: TArguments
) => TReturn;

function getInstanceError(message: string | null, instance: TestInstance) {
  return getConfig().getInstanceError(message, instance);
}

function getSuggestionError(
  suggestion: { toString: () => string },
  container: TestInstance,
) {
  return getConfig().getInstanceError(
    `A better query is available, try this:
${suggestion.toString()}
`,
    container,
  );
}

// this accepts a query function and returns a function which throws an error
// if an empty list of elements is returned
function makeGetQuery<TArguments extends Array<unknown>>(
  queryBy: (instance: TestInstance, ...args: TArguments) => TestInstance | null,
  getMissingError: GetErrorFunction<TArguments>,
) {
  return <T extends TestInstance = TestInstance>(
    instance: TestInstance,
    ...args: TArguments
  ): T => {
    const el = queryBy(instance, ...args);
    if (!el) {
      throw getConfig().getInstanceError(
        getMissingError(instance, ...args),
        instance,
      );
    }

    return el as T;
  };
}

// this accepts a getter query function and returns a function which calls
// waitFor and passing a function which invokes the getter.
function makeFindQuery<TQueryFor>(
  getter: (
    container: TestInstance,
    text: Matcher,
    options?: MatcherOptions,
  ) => TQueryFor,
) {
  return <T extends TestInstance = TestInstance>(
    instance: TestInstance,
    text: Matcher,
    options?: MatcherOptions,
    waitForOptions?: WaitForOptions,
  ): Promise<T> => {
    return waitFor(
      () => {
        return getter(instance, text, options) as unknown as T;
      },
      { instance, ...waitForOptions },
    );
  };
}

const wrapSingleQueryWithSuggestion =
  <TArguments extends Array<unknown>>(
    query: (container: TestInstance, ...args: TArguments) => TestInstance | null,
    queryByName: string,
    variant: Variant,
  ) =>
  <T extends TestInstance = TestInstance>(
    container: TestInstance,
    ...args: TArguments
  ): T => {
    const instance = query(container, ...args);
    const [{ suggest = getConfig().throwSuggestions } = {}] = args.slice(
      -1,
    ) as [WithSuggest];
    if (instance && suggest) {
      const suggestion = getSuggestedQuery(instance, variant);
      if (suggestion && !queryByName.endsWith(suggestion.queryName)) {

        throw getSuggestionError(suggestion.toString(), container);
      }
    }

    return instance as T;
  };

function buildQueries(
  queryBy: QueryMethod<
    [matcher: Matcher, options?: MatcherOptions],
    TestInstance | null
  >,
  getMissingError: GetErrorFunction<
    [matcher: Matcher, options?: MatcherOptions]
  >,
) {
  const getBy = makeGetQuery(queryBy, getMissingError);

  const queryByWithSuggestions = wrapSingleQueryWithSuggestion(
    queryBy,
    queryBy.name,
    "get",
  );

  const getByWithSuggestions = wrapSingleQueryWithSuggestion(
    getBy,
    queryBy.name,
    "get",
  );

  const findBy = makeFindQuery(
    wrapSingleQueryWithSuggestion(getBy, queryBy.name, "find"),
  );

  return [queryByWithSuggestions, getByWithSuggestions, findBy] as const;
}

export {
  getInstanceError,
  wrapSingleQueryWithSuggestion,
  makeFindQuery,
  buildQueries,
};
