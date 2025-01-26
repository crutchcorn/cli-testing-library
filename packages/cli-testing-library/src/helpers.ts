import type { TestInstance } from "./types";

function jestFakeTimersAreEnabled() {
  /* istanbul ignore else */
  if (
    (typeof vi !== "undefined" && vi.isFakeTimers && vi.isFakeTimers()) ||
    (typeof jest !== "undefined" && jest !== null)
  ) {
    return (
      // legacy timers
      (
        setTimeout as unknown as {
          _isMockFunction: boolean;
        }
      )._isMockFunction === true ||
      // modern timers

      Object.prototype.hasOwnProperty.call(setTimeout, "clock")
    );
  }
  // istanbul ignore next
  return false;
}

const instanceRef = { current: undefined as TestInstance | undefined };

if (typeof afterEach === "function") {
  afterEach(() => {
    instanceRef.current = undefined;
  });
}

function getCurrentInstance() {
  /**
   * Worth mentioning that this deviates from the upstream implementation
   * of `dom-testing-library`'s `getDocument` in waitFor, which throws an error whenever
   * `window` is not defined.
   *
   * Admittedly, this is another way that `cli-testing-library` will need to figure out
   * the right solution to this problem, since there is no omni-present parent `instance`
   * in a CLI like there is in a browser. (although FWIW, "process" might work)
   *
   * Have ideas how to solve? Please let us know:
   * https://github.com/crutchcorn/cli-testing-library/issues/
   */
  return instanceRef.current;
}

// TODO: Does this need to be namespaced for each test that runs?
//  That way, we don't end up with a "singleton" that ends up wiped between
//  parallel tests.
function setCurrentInstance(newInstance: TestInstance) {
  instanceRef.current = newInstance;
}

function debounce<T extends (...args: Array<any>) => void>(
  func: T,
  timeout: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore this is fine
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * This is used to bind a series of functions where `instance` is the first argument
 * to an instance, removing the implicit first argument.
 */
function bindObjectFnsToInstance(
  instance: TestInstance,
  object: Record<string, (...props: Array<unknown>) => unknown>,
) {
  return Object.entries(object).reduce(
    (prev, [key, fn]) => {
      prev[key] = (...props: Array<unknown>) => fn(instance, ...props);
      return prev;
    },
    {} as typeof object,
  );
}

export {
  jestFakeTimersAreEnabled,
  setCurrentInstance,
  getCurrentInstance,
  debounce,
  bindObjectFnsToInstance,
};
