import {GetErrorFunction, Matcher, SelectorMatcherOptions, waitForOptions} from '../../types'
import {fuzzyMatches, matches, makeNormalizer, buildQueries} from './all-utils'
import {TestInstance} from "../types";

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

const queryByErrorBase: QueryByError = (
  instance,
  text,
  {exact = false, collapseWhitespace, trim, normalizer, stripAnsi} = {},
) => {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({
    stripAnsi,
    collapseWhitespace,
    trim,
    normalizer,
  })
  const str = instance.stderrArr.map(obj => obj.contents).join('\n')
  if (matcher(str, instance, text, matchNormalizer)) return instance
  else return null
}

const getMissingError: GetErrorFunction<[unknown]> = (_c, text) =>
  `Unable to find an stdout line with the text: ${text}. This could be because the text is broken up by multiple lines. In this case, you can provide a function for your text matcher to make your matcher more flexible.`

const [_queryByErrorWithSuggestions, _getByError, _findByError] = buildQueries(
  queryByErrorBase,
  getMissingError,
)

export function getByError<T extends TestInstance = TestInstance>(
  ...args: Parameters<GetByError<T>>
): ReturnType<GetByError<T>> {
  return _getByError<T>(...args);
}

export function queryByError<T extends TestInstance = TestInstance>(
  ...args: Parameters<QueryByError<T>>
): ReturnType<QueryByError<T>> {
  return _queryByErrorWithSuggestions<T>(...args);
}

export function findByError<T extends TestInstance = TestInstance>(
  ...args: Parameters<FindByError<T>>
): ReturnType<FindByError<T>> {
  return _findByError<T>(...args);
}
