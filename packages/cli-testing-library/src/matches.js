import stripAnsiFn from 'strip-ansi'

function assertNotNullOrUndefined(matcher) {
  if (matcher === null || matcher === undefined) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- implicitly converting `T` to `string`
      `It looks like ${matcher} was passed instead of a matcher. Did you do something like getByText(${matcher})?`,
    )
  }
}

function fuzzyMatches(textToMatch, node, matcher, normalizer) {
  if (typeof textToMatch !== 'string') {
    return false
  }
  assertNotNullOrUndefined(matcher)

  const normalizedText = normalizer(textToMatch)

  if (typeof matcher === 'string' || typeof matcher === 'number') {
    return normalizedText
      .toLowerCase()
      .includes(matcher.toString().toLowerCase())
  } else if (typeof matcher === 'function') {
    return matcher(normalizedText, node)
  } else {
    return matcher.test(normalizedText)
  }
}

function matches(textToMatch, node, matcher, normalizer) {
  if (typeof textToMatch !== 'string') {
    return false
  }

  assertNotNullOrUndefined(matcher)

  const normalizedText = normalizer(textToMatch)
  if (matcher instanceof Function) {
    return matcher(normalizedText, node)
  } else if (matcher instanceof RegExp) {
    return matcher.test(normalizedText)
  } else {
    return normalizedText === String(matcher)
  }
}

function getDefaultNormalizer({
  trim = true,
  collapseWhitespace = true,
  stripAnsi = true,
} = {}) {
  return text => {
    let normalizedText = text
    normalizedText = trim ? normalizedText.trim() : normalizedText
    normalizedText = collapseWhitespace
      ? normalizedText.replace(/\s+/g, ' ')
      : normalizedText
    normalizedText = stripAnsi ? stripAnsiFn(normalizedText) : normalizedText
    return normalizedText
  }
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

function makeNormalizer({trim, stripAnsi, collapseWhitespace, normalizer}) {
  if (normalizer) {
    // User has specified a custom normalizer
    if (
      typeof trim !== 'undefined' ||
      typeof collapseWhitespace !== 'undefined' ||
      typeof stripAnsi !== 'undefined'
    ) {
      // They've also specified a value for trim or collapseWhitespace
      throw new Error(
        'trim and collapseWhitespace are not supported with a normalizer. ' +
          'If you want to use the default trim and collapseWhitespace logic in your normalizer, ' +
          'use "getDefaultNormalizer({trim, collapseWhitespace})" and compose that into your normalizer',
      )
    }

    return normalizer
  } else {
    // No custom normalizer specified. Just use default.
    return getDefaultNormalizer({trim, collapseWhitespace, stripAnsi})
  }
}

export {fuzzyMatches, matches, getDefaultNormalizer, makeNormalizer}
