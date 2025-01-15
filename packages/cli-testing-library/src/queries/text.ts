import { TestInstance } from '../types'
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  buildQueries,
  Matcher,
  SelectorMatcherOptions,
  GetErrorFunction
} from './all-utils'
import {waitForOptions} from "../wait-for";

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

const queryByTextBase: QueryByText = (
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
  const str = instance.stdoutArr.map(output => output.contents).join('\n')
  if (matcher(str, instance, text, matchNormalizer)) return instance
  else return null
}

const getMissingError: GetErrorFunction<[unknown]> = (_c, text) =>
  `Unable to find an stdout line with the text: ${text}. This could be because the text is broken up by multiple lines. In this case, you can provide a function for your text matcher to make your matcher more flexible.`

const [_queryByTextWithSuggestions, _getByText, _findByText] = buildQueries(
  queryByTextBase,
  getMissingError,
)

export function getByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<GetByText<T>>
): ReturnType<GetByText<T>> {
  return _getByText<T>(...args);
}
export function queryByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<QueryByText<T>>
): ReturnType<QueryByText<T>> {
  return _queryByTextWithSuggestions<T>(...args);
}
export function findByText<T extends TestInstance = TestInstance>(
  ...args: Parameters<FindByText<T>>
): ReturnType<FindByText<T>> {
  return _findByText(...args);
}
