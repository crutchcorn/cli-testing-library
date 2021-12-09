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
       if (
        !(cliInstance && cliInstance.process && cliInstance.process.stdout)
    ) {
        throw new CliInstanceTypeError(cliInstance, ...args)
    }
}

export {
    CliInstanceTypeError,
    checkCliInstance,
}
