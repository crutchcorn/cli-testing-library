import * as defaultQueries from './queries/index.js'

/**
 * @typedef {{[key: string]: Function}} FuncMap
 */

/**
 * @param {TestInstance} instance
 * @param {FuncMap} queries object of functions
 * @param {Object} initialValue for reducer
 * @returns {FuncMap} returns object of functions bound to container
 */
function getQueriesForElement(
  instance,
  queries = defaultQueries,
  initialValue = {},
) {
  return Object.keys(queries).reduce((helpers, key) => {
    const fn = queries[key]
    helpers[key] = fn.bind(null, instance)
    return helpers
  }, initialValue)
}

export {getQueriesForElement}
