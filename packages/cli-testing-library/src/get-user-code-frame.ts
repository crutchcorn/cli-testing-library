// We try to load node dependencies
import chalk from 'chalk'
import fs from 'fs'
import {codeFrameColumns} from '@babel/code-frame'

const readFileSync = fs.readFileSync

// frame has the form "at myMethod (location/to/my/file.js:10:2)"
function getCodeFrame(frame: string) {
  const locationStart = frame.indexOf('(') + 1
  const locationEnd = frame.indexOf(')')
  const frameLocation = frame.slice(locationStart, locationEnd)

  const frameLocationElements = frameLocation.split(':')
  const [filename, line, column] = [
    frameLocationElements[0]!,
    parseInt(frameLocationElements[1]!, 10),
    parseInt(frameLocationElements[2]!, 10),
  ]

  let rawFileContents = ''
  try {
    rawFileContents = readFileSync(filename, 'utf-8')
  } catch (e) {
    return ''
  }

  const codeFrame = codeFrameColumns(
    rawFileContents,
    {
      start: {line, column},
    },
    {
      highlightCode: false,
      linesBelow: 0,
    },
  )
  return `${chalk.dim(frameLocation)}\n${codeFrame}\n`
}

function getUserCodeFrame() {
  // If we couldn't load dependencies, we can't generate the user trace
  /* istanbul ignore next */
  if (!readFileSync || !codeFrameColumns) {
    return ''
  }
  const err = new Error()
  const firstClientCodeFrame = err.stack
    ?.split('\n')
    .slice(1) // Remove first line which has the form "Error: TypeError"
    .find(frame => !frame.includes('node_modules/')) // Ignore frames from 3rd party libraries

  return getCodeFrame(firstClientCodeFrame!)
}

export {getUserCodeFrame}
