import {getUserCodeFrame} from './get-user-code-frame'
import {getCurrentInstance} from './helpers'

// Regarding `maxLength`:
// This may cause a problem if an ANSI escape sequence is not closed during this length
// Can we just, like, pass all ANSI escape sequences through?
function prettyCLI(instance, maxLength) {
  if (!instance) {
    instance = getCurrentInstance()
  }
  if (typeof maxLength !== 'number') {
    maxLength =
      (typeof process !== 'undefined' && process.env.DEBUG_PRINT_LIMIT) || 7000
  }

  if (maxLength === 0) {
    return ''
  }

  const contentArr = instance.stdoutArr()

  const finalArr = [];

  let currSize = 0;
  for (let content of contentArr) {
    if (currSize >= maxLength) {
      break;
    }
    let maxValLength = maxLength - currSize;
    if (maxValLength <= 0) maxValLength = 0;
    if (Buffer.isBuffer(content)) {
      const bufferSize = Buffer.byteLength(content);
      if (bufferSize > maxValLength) {
        content = content.slice(0, maxValLength);
      }
      finalArr.push(content);
      currSize += bufferSize;
      continue;
    }
    // content is a string
    if (content.length > maxValLength) {
      content = content.substr(0, maxValLength);
    }
    finalArr.push(content);
    currSize += content.length;
  }

  return finalArr;
}

const logCLI = (...args) => {
  const userCodeFrame = getUserCodeFrame()
  process.stdout.write(prettyCLI(...args))
  if (userCodeFrame) {
    console.log(`\n\n${userCodeFrame}`)
  }
}

export {prettyCLI, logCLI}
