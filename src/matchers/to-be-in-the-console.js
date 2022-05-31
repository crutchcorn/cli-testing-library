/* eslint-disable @babel/no-invalid-this */
import {getDefaultNormalizer} from '../matches.js'
import {checkCliInstance, getMessage} from './utils.js'

export function toBeInTheConsole(instance) {
  if (instance !== null || !this.isNot) {
    checkCliInstance(instance, toBeInTheConsole, this)
  }

  const errormessage = instance
    ? getDefaultNormalizer()(instance.stdoutArr.join('\n'))
    : null

  return {
    // Does not change based on `.not`, and as a result, we must confirm if it _actually_ is there
    pass: !!instance,
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeInTheConsole`,
          'instance',
          '',
        ),
        `Expected ${to} find the instance in the console`,
        '',
        'Received',
        this.utils.printReceived(errormessage),
      )
    },
  }
}
