import {
  ensureNoExpected,
  matcherHint,
  printReceived,
} from 'jest-matcher-utils';

export function toBeInTheConsole(instance, expected) {
  // This code is 1:1 with Jest's built-in "ToBeTruthy"
  // @see https://github.com/facebook/jest/blob/main/packages/expect/src/matchers.ts#L398-L414
  const matcherName = 'toBeTruthy';
  const options = {
    // eslint-disable-next-line @babel/no-invalid-this
    isNot: this.isNot,
    // eslint-disable-next-line @babel/no-invalid-this
    promise: this.promise,
  };
  ensureNoExpected(expected, matcherName, options);

  const pass = !!instance;

  const message = () =>
      `${matcherHint(matcherName, undefined, '', options) 
      }\n\n` +
      `Received: ${printReceived(instance)}`;

  return {message, pass};
}
