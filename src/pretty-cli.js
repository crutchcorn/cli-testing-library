import sliceAnsi from 'slice-ansi'
import {getUserCodeFrame} from './get-user-code-frame'

function prettyCLI(testInstance, maxLength) {
  if (typeof maxLength !== 'number') {
    maxLength =
      (typeof process !== 'undefined' && process.env.DEBUG_PRINT_LIMIT) || 7000
  }

  if (maxLength === 0) {
    return ''
  }

  if (!('stdoutArr' in testInstance)) {
    throw new TypeError(`Expected an instance but got ${testInstance}`)
  }

  const outStr = testInstance.stdoutArr.join('\n')

  // eslint-disable-next-line no-negated-condition
  return maxLength !== undefined && outStr.length > maxLength
    ? sliceAnsi(outStr, 0, maxLength)
    : outStr
}

const logCLI = (...args) => {
  const userCodeFrame = getUserCodeFrame()
  if (userCodeFrame) {
    process.stdout.write(`${prettyCLI(...args)}\n\n${userCodeFrame}`)
  } else {
    process.stdout.write(prettyCLI(...args))
  }
}

export {prettyCLI, logCLI}
