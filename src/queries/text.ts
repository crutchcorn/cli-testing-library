import {GetErrorFunction, QueryByText} from '../../types/index.js'
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  buildQueries,
} from './all-utils.js'

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
  const str = instance.stdoutArr.join('\n')
  if (matcher(str, instance, text, matchNormalizer)) return instance
  else return null
}

const getMissingError: GetErrorFunction<[unknown]> = (c, text) =>
  `Unable to find an stdout line with the text: ${text}. This could be because the text is broken up by multiple lines. In this case, you can provide a function for your text matcher to make your matcher more flexible.`

const [queryByTextWithSuggestions, getByText, findByText] = buildQueries(
  queryByTextBase,
  getMissingError,
)

export {queryByTextWithSuggestions as queryByText, getByText, findByText}
