export type MatcherFunction = (
  content: string,
  element: Element | null,
) => boolean
export type Matcher = MatcherFunction | RegExp | number | string

export type NormalizerFn = (text: string) => string

export interface NormalizerOptions extends DefaultNormalizerOptions {
  normalizer?: NormalizerFn
}

export interface MatcherOptions {
  exact?: boolean
  /** Use normalizer with getDefaultNormalizer instead */
  trim?: boolean
  /** Use normalizer with getDefaultNormalizer instead */
  stripAnsi?: boolean
  /** Use normalizer with getDefaultNormalizer instead */
  collapseWhitespace?: boolean
  normalizer?: NormalizerFn
  /** suppress suggestions for a specific query */
  suggest?: boolean
}

export type Match = (
  textToMatch: string,
  node: HTMLElement | null,
  matcher: Matcher,
  options?: MatcherOptions,
) => boolean

export interface DefaultNormalizerOptions {
  trim?: boolean
  collapseWhitespace?: boolean
  stripAnsi?: boolean
}

export function getDefaultNormalizer(
  options?: DefaultNormalizerOptions,
): NormalizerFn

// N.B. Don't expose fuzzyMatches + matches here: they're not public API
