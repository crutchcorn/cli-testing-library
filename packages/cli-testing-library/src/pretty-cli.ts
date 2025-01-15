import sliceAnsi from 'slice-ansi'
import {getUserCodeFrame} from './get-user-code-frame.js'
import {TestInstance} from "./types";

function prettyCLI(testInstance: TestInstance, maxLength: number | string) {
  if (typeof maxLength !== 'number') {
    maxLength =
      (typeof process !== 'undefined' && process.env.DEBUG_PRINT_LIMIT) || 7000
  }

  if (maxLength === 0) {
    return ''
  }

  if (!('stdoutArr' in testInstance && 'stderrArr' in testInstance)) {
    throw new TypeError(`Expected an instance but got ${testInstance}`)
  }

  const outStr = testInstance.getStdallStr()

  // eslint-disable-next-line no-negated-condition
  return maxLength !== undefined && outStr.length > Number(maxLength)
    ? sliceAnsi(outStr, 0, Number(maxLength))
    : outStr
}

const logCLI = (...args: Parameters<typeof prettyCLI>) => {
  const userCodeFrame = getUserCodeFrame()
  if (userCodeFrame) {
    process.stdout.write(`${prettyCLI(...args)}\n\n${userCodeFrame}`)
  } else {
    process.stdout.write(prettyCLI(...args))
  }
}

export {prettyCLI, logCLI}
