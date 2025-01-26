import redent from "redent";
import type { TestInstance } from "../types";

class GenericTypeError extends Error {
  constructor(
    expectedString: string,
    received: any,
    matcherFn: Function,
    context: any,
  ) {
    super();

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn);
    }
    let withType = "";
    try {
      withType = context.utils.printWithType(
        "Received",
        received,
        context.utils.printReceived,
      );
    } catch (e) {
      // Can throw for Document:
      // https://github.com/jsdom/jsdom/issues/2304
    }
    this.message = [
      context.utils.matcherHint(
        `${context.isNot ? ".not" : ""}.${matcherFn.name}`,
        "received",
        "",
      ),
      "",
       
      `${context.utils.RECEIVED_COLOR(
        "received",
      )} value must ${expectedString}.`,
      withType,
    ].join("\n");
  }
}

type GenericTypeErrorArgs = ConstructorParameters<typeof GenericTypeError>;

type AllButFirst<T> = T extends [infer _First, ...infer Rest] ? Rest : never;

class CliInstanceTypeError extends GenericTypeError {
  constructor(...args: AllButFirst<GenericTypeErrorArgs>) {
    super("be a TestInstance", ...args);
  }
}

type CliInstanceTypeErrorArgs = ConstructorParameters<
  typeof CliInstanceTypeError
>;

function checkCliInstance(
  cliInstance: TestInstance,
  ...args: AllButFirst<CliInstanceTypeErrorArgs>
) {
  if (!(cliInstance && cliInstance.process && cliInstance.process.stdout)) {
    throw new CliInstanceTypeError(cliInstance, ...args);
  }
}

function display(context: any, value: any) {
  return typeof value === "string" ? value : context.utils.stringify(value);
}

function getMessage(
  context: any,
  matcher: string,
  expectedLabel: string,
  expectedValue: string,
  receivedLabel: string,
  receivedValue: string,
) {
  return [
    `${matcher}\n`,
    `${expectedLabel}:\n${context.utils.EXPECTED_COLOR(
      redent(display(context, expectedValue), 2),
    )}`,
    `${receivedLabel}:\n${context.utils.RECEIVED_COLOR(
      redent(display(context, receivedValue), 2),
    )}`,
  ].join("\n");
}

export { CliInstanceTypeError, checkCliInstance, getMessage };
