/**
 * TODO: Bring more inline with `dom-testing-library` implementation
 *  when we've figured out what `findAllByText` should do
 *
 *  TODO: Add queryByText
 */
const { waitFor } = require("../_wait-for");
const {
  fuzzyMatches,
  matches,
  makeNormalizer,
} = require("./_all-utils");

/**
 * @param {TestInstance} instance
 * @param {string} text
 * @param {*} opts
 * @returns {null|TestInstance}
 */
function getByText(instance, text, opts = {}) {
  const {
    exact = true,
    collapseWhitespace,
    trim,
    normalizer,
  } = opts;
  const matcher = exact ? matches : fuzzyMatches;
  const matchNormalizer = makeNormalizer({
    collapseWhitespace,
    trim,
    normalizer,
  });
  const str = instance.stdoutStr;
  matcher(str, instance, text, matchNormalizer);
  if (new RegExp(text).exec(str)) return instance;
  else return null;
}

/**
 *
 * @param {TestInstance} instance
 * @param {string} text
 * @returns {Promise<TestInstance>}
 */
function findByText(instance, text, opts) {
  return waitFor(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(getByText(instance, text, opts));
        }, 0);
      })
  );
}

module.exports = {
  getByText,
  findByText,
};
