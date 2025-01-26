export interface CLITestingLibraryMatchers<TReturn> {
  /**
   * @description
   * Assert whether a query is present in the console or not.
   * @example
   * expect(queryByText('Hello world')).toBeInTheDocument()
   */
  toBeInTheConsole: () => TReturn;

  /**
   * @description
   * Check whether the given instance has a stderr message or not.
   * @example
   * expect(instance).toHaveErrorMessage(/command could not be found/i) // to partially match
   */
  toHaveErrorMessage: () => TReturn;
}
