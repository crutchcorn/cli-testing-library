import {checkCliInstance} from "./utils";

export function toBeInTheConsole(instance) {
  // eslint-disable-next-line @babel/no-invalid-this
  if (instance !== null || !this.isNot) {
    // eslint-disable-next-line @babel/no-invalid-this
    checkCliInstance(instance, toBeInTheConsole, this)
  }

  // Assuming it passed above, it must have passed
  return {
    pass: true,
    message: () => []
  }
}
