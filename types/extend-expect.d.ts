// TypeScript Version: 3.8

/// <reference types="jest" />

declare namespace jest {
    interface Matchers<R, ignored> {
        /**
         * @description
         * Assert whether an element is present in the console or not.
         * @example
         * expect(queryByText('Hello world')).toBeInTheDocument()
         */
        toBeInTheConsole(): R;
    }
}
