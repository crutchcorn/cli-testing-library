import redent from 'redent'

class GenericTypeError extends Error {
  constructor(expectedString, received, matcherFn, context) {
    super()

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn)
    }
    let withType = ''
    try {
      withType = context.utils.printWithType(
        'Received',
        received,
        context.utils.printReceived,
      )
    } catch (e) {
      // Can throw for Document:
      // https://github.com/jsdom/jsdom/issues/2304
    }
    this.message = [
      context.utils.matcherHint(
        `${context.isNot ? '.not' : ''}.${matcherFn.name}`,
        'received',
        '',
      ),
      '',
      // eslint-disable-next-line @babel/new-cap
      `${context.utils.RECEIVED_COLOR(
        'received',
      )} value must ${expectedString}.`,
      withType,
    ].join('\n')
  }
}

class CliInstanceTypeError extends GenericTypeError {
  constructor(...args) {
    super('be a TestInstance', ...args)
  }
}

/**
 * @param {TestInstance} cliInstance
 * @param args
 */
function checkCliInstance(cliInstance, ...args) {
  if (!(cliInstance && cliInstance.process && cliInstance.process.stdout)) {
    throw new CliInstanceTypeError(cliInstance, ...args)
  }
}

function display(context, value) {
  return typeof value === 'string' ? value : context.utils.stringify(value)
}

function getMessage(
  context,
  matcher,
  expectedLabel,
  expectedValue,
  receivedLabel,
  receivedValue,
) {
  return [
    `${matcher}\n`,
    // eslint-disable-next-line @babel/new-cap
    `${expectedLabel}:\n${context.utils.EXPECTED_COLOR(
      redent(display(context, expectedValue), 2),
    )}`,
    // eslint-disable-next-line @babel/new-cap
    `${receivedLabel}:\n${context.utils.RECEIVED_COLOR(
      redent(display(context, receivedValue), 2),
    )}`,
  ].join('\n')
}

export {CliInstanceTypeError, checkCliInstance, getMessage}
