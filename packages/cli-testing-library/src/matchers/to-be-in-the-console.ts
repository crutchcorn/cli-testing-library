import { getDefaultNormalizer } from "../matches";
import { checkCliInstance, getMessage } from "./utils";
import type { TestInstance } from "../types";

export function toBeInTheConsole(this: any, instance: TestInstance) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (instance !== null || !this.isNot) {
    checkCliInstance(instance, toBeInTheConsole, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const errormessage = instance
    ? getDefaultNormalizer()(
        instance.stdoutArr.map((obj) => obj.contents).join("\n"),
      )
    : null;

  return {
    // Does not change based on `.not`, and as a result, we must confirm if it _actually_ is there
    pass: !!instance,
    message: () => {
      const to = this.isNot ? "not to" : "to";
      return getMessage(
        this,
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toBeInTheConsole`,
          "instance",
          "",
        ),
        `Expected ${to} find the instance in the console`,
        "",
        "Received",
        this.utils.printReceived(errormessage),
      );
    },
  };
}
