/**
 * TODO: Bring more inline with `dom-testing-library` implementation
 *  when we've figured out what `findAllByText` should do
 *
 *  TODO: Add queryByText
 */
import * as QueryTypes from '../../types/queries';
import { waitFor } from "../wait-for";
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
} from "./all-utils";

type GetTextParams = Parameters<typeof QueryTypes.getByText>;
type Instance = GetTextParams[0]
type Text = GetTextParams[1]
type Opts = GetTextParams[2]

function getByText(instance: Instance, text: Text, opts: Opts = {}) {
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
    // Why TypeScript, why?
  } as unknown as true);
  const str = instance.stdoutStr;
  if (matcher(str, instance, text, matchNormalizer)) return instance;
  else return null;
}

/**
 *
 * @param {TestInstance} instance
 * @param {string} text
 * @returns {Promise<TestInstance>}
 */
function findByText(instance: Instance, text: Text, opts: Opts) {
  return waitFor(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(getByText(instance, text, opts));
        }, 0);
      })
  );
}

export {
  getByText,
  findByText,
};
