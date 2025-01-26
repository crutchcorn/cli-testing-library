import stripAnsiFn from "strip-ansi";
import type { TestInstance } from "./types";

export type MatcherFunction = (
  content: string,
  element: TestInstance | null,
) => boolean;

export type Matcher = MatcherFunction | RegExp | number | string;

export type NormalizerFn = (text: string) => string;

export interface NormalizerOptions extends DefaultNormalizerOptions {
  normalizer?: NormalizerFn;
}

export interface MatcherOptions {
  exact?: boolean;
  /** Use normalizer with getDefaultNormalizer instead */
  trim?: boolean;
  /** Use normalizer with getDefaultNormalizer instead */
  stripAnsi?: boolean;
  /** Use normalizer with getDefaultNormalizer instead */
  collapseWhitespace?: boolean;
  normalizer?: NormalizerFn;
  /** suppress suggestions for a specific query */
  suggest?: boolean;
}

export type Match = (
  textToMatch: string,
  node: TestInstance | null,
  matcher: Matcher,
  options?: MatcherOptions,
) => boolean;

export interface DefaultNormalizerOptions {
  trim?: boolean;
  collapseWhitespace?: boolean;
  stripAnsi?: boolean;
}

function assertNotNullOrUndefined(matcher: Matcher) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (matcher === null || matcher === undefined) {
    throw new Error(
      `It looks like ${matcher} was passed instead of a matcher. Did you do something like getByText(${matcher})?`,
    );
  }
}

/**
 * @private
 */
function fuzzyMatches(
  textToMatch: string,
  node: TestInstance | null,
  matcher: Matcher,
  normalizer: NormalizerFn,
) {
  if (typeof textToMatch !== "string") {
    return false;
  }
  assertNotNullOrUndefined(matcher);

  const normalizedText = normalizer(textToMatch);

  if (typeof matcher === "string" || typeof matcher === "number") {
    return normalizedText
      .toLowerCase()
      .includes(matcher.toString().toLowerCase());
  } else if (typeof matcher === "function") {
    return matcher(normalizedText, node);
  } else {
    return matcher.test(normalizedText);
  }
}

/**
 * @private
 */
function matches(
  textToMatch: string,
  node: TestInstance | null,
  matcher: Matcher,
  normalizer: NormalizerFn,
): boolean {
  if (typeof textToMatch !== "string") {
    return false;
  }

  assertNotNullOrUndefined(matcher);

  const normalizedText = normalizer(textToMatch);
  if (matcher instanceof Function) {
    return matcher(normalizedText, node);
  } else if (matcher instanceof RegExp) {
    return matcher.test(normalizedText);
  } else {
    return normalizedText === String(matcher);
  }
}

function getDefaultNormalizer({
  trim = true,
  collapseWhitespace = true,
  stripAnsi = true,
}: DefaultNormalizerOptions = {}): NormalizerFn {
  return (text: string) => {
    let normalizedText = text;
    normalizedText = trim ? normalizedText.trim() : normalizedText;
    normalizedText = collapseWhitespace
      ? normalizedText.replace(/\s+/g, " ")
      : normalizedText;
    normalizedText = stripAnsi ? stripAnsiFn(normalizedText) : normalizedText;
    return normalizedText;
  };
}

/**
 * @param {Object} props
 * Constructs a normalizer to pass to functions in matches.js
 * @param {boolean|undefined} props.trim The user-specified value for `trim`, without
 * any defaulting having been applied
 * @param {boolean|undefined} props.stripAnsi The user-specified value for `stripAnsi`, without
 * any defaulting having been applied
 * @param {boolean|undefined} props.collapseWhitespace The user-specified value for
 * `collapseWhitespace`, without any defaulting having been applied
 * @param {Function|undefined} props.normalizer The user-specified normalizer
 * @returns {Function} A normalizer
 */
function makeNormalizer({
  trim,
  stripAnsi,
  collapseWhitespace,
  normalizer,
}: NormalizerOptions): NormalizerFn {
  if (normalizer) {
    // User has specified a custom normalizer
    if (
      typeof trim !== "undefined" ||
      typeof collapseWhitespace !== "undefined" ||
      typeof stripAnsi !== "undefined"
    ) {
      // They've also specified a value for trim or collapseWhitespace
      throw new Error(
        "trim and collapseWhitespace are not supported with a normalizer. " +
          "If you want to use the default trim and collapseWhitespace logic in your normalizer, " +
          'use "getDefaultNormalizer({trim, collapseWhitespace})" and compose that into your normalizer',
      );
    }

    return normalizer;
  } else {
    // No custom normalizer specified. Just use default.
    return getDefaultNormalizer({ trim, collapseWhitespace, stripAnsi });
  }
}

export { fuzzyMatches, matches, getDefaultNormalizer, makeNormalizer };
