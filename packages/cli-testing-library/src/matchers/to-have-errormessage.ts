import { getDefaultNormalizer } from "../matches";
import { checkCliInstance, getMessage } from "./utils";
import { TestInstance } from "../types";

export function toHaveErrorMessage(
  this: any,
  testInstance: TestInstance,
  checkWith: string | RegExp,
) {
  checkCliInstance(testInstance, toHaveErrorMessage, this);

  const expectsErrorMessage = checkWith !== undefined;

  const errormessage = getDefaultNormalizer()(
    testInstance.stderrArr.map((obj) => obj.contents).join("\n"),
  );

  return {
    pass: expectsErrorMessage
      ? checkWith instanceof RegExp
        ? checkWith.test(errormessage)
        : this.equals(errormessage, checkWith)
      : Boolean(testInstance.stderrArr.length),
    message: () => {
      const to = this.isNot ? "not to" : "to";
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toHaveErrorMessage`,
          "instance",
          "",
        ),
        `Expected the instance ${to} have error message`,
        this.utils.printExpected(checkWith),
        "Received",
        this.utils.printReceived(errormessage),
      );
    },
  };
}
