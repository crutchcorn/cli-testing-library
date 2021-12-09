/* eslint-disable @babel/no-invalid-this */
import {checkCliInstance} from "./utils";

export function toBeInTheConsole(instance) {
  if (instance !== null || !this.isNot) {
    checkCliInstance(instance, toBeInTheConsole, this)
  }

  // Assuming it passed above, it must have passed
  return {
    pass: true,
    message: () => []
  }
}
