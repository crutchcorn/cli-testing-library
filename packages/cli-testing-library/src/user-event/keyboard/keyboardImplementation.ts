import { fireEvent } from "../../events";
import { wait } from "../utils";
import { getNextKeyDef } from "./getNextKeyDef";
import type { TestInstance } from "../../types";
import type { keyboardKey, keyboardOptions } from "./types";

export async function keyboardImplementation(
  instance: TestInstance,
  text: string,
  options: keyboardOptions,
): Promise<void> {
  let remainingText = text;

  while (remainingText) {
    const { keyDef, consumedLength } = getNextKeyDef(remainingText, options);

    keypress(keyDef, instance);
    remainingText = remainingText.slice(consumedLength);

    if (remainingText && options.delay > 0) {
      await wait(options.delay);
    }
  }
}

function keypress(keyDef: keyboardKey, instance: TestInstance) {
  fireEvent.write(instance, { value: keyDef.hex! });
}
