// TypeScript Version: 3.8

/// <reference types="jest" />

declare namespace jest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R, T = {}> {
    /**
     * @description
     * Assert whether a query is present in the console or not.
     * @example
     * expect(queryByText('Hello world')).toBeInTheDocument()
     */
    toBeInTheConsole(): R
    /**
     * @description
     * Check whether the given instance has an stderr message or not.
     * @example
     * expect(instance).toHaveErrorMessage(/command could not be found/i) // to partially match
     */
    toHaveErrorMessage(): R
  }
}
