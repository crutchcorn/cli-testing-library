import {getDefaultNormalizer} from './matches'

const normalize = getDefaultNormalizer()

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function getRegExpMatcher(string) {
  return new RegExp(escapeRegExp(string.toLowerCase()), 'i')
}

function makeSuggestion(queryName, element, content, {variant, name}) {
  const warning = ''
  const queryOptions = {}
  const queryArgs = [
    [].includes(queryName)
      ? content
      : getRegExpMatcher(content),
  ]

  if (name) {
    queryOptions.name = getRegExpMatcher(name)
  }

  if (Object.keys(queryOptions).length > 0) {
    queryArgs.push(queryOptions)
  }

  const queryMethod = `${variant}By${queryName}`

  return {
    queryName,
    queryMethod,
    queryArgs,
    variant,
    warning,
    toString() {
      if (warning) {
        console.warn(warning)
      }
      let [text, options] = queryArgs

      text = typeof text === 'string' ? `'${text}'` : text

      options = options
        ? `, { ${Object.entries(options)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')} }`
        : ''

      return `${queryMethod}(${text}${options})`
    },
  }
}

function canSuggest(currentMethod, requestedMethod, data) {
  return (
    data &&
    (!requestedMethod ||
      requestedMethod.toLowerCase() === currentMethod.toLowerCase())
  )
}

export function getSuggestedQuery(instance, variant = 'get', method) {
  const textContent = normalize(instance.stdoutStr)
  if (canSuggest('Text', method, textContent)) {
    return makeSuggestion('Text', instance, textContent, {variant})
  }

  return undefined
}
