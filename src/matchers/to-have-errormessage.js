/* eslint-disable @babel/no-invalid-this */
import { getDefaultNormalizer } from '../matches.js'
import { checkCliInstance, getMessage } from './utils.js'

/**
 * @param {TestInstance} testInstance
 * @param checkWith
 */
export function toHaveErrorMessage(testInstance, checkWith) {
  checkCliInstance(testInstance, toHaveErrorMessage, this)

  const expectsErrorMessage = checkWith !== undefined

  const errormessage = getDefaultNormalizer()(testInstance.stderrArr.join('\n'))

  return {
    pass: expectsErrorMessage
      ? checkWith instanceof RegExp
        ? checkWith.test(errormessage)
        : this.equals(errormessage, checkWith)
      : Boolean(testInstance.stderrArr.length),
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveErrorMessage`,
          'instance',
          '',
        ),
        `Expected the instance ${to} have error message`,
        this.utils.printExpected(checkWith),
        'Received',
        this.utils.printReceived(errormessage),
      )
    },
  }
}
