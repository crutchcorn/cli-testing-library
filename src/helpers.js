function jestFakeTimersAreEnabled() {
  /* istanbul ignore else */
  if (typeof jest !== 'undefined' && jest !== null) {
    return (
      // legacy timers
      setTimeout._isMockFunction === true ||
      // modern timers
      Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
    )
  }
  // istanbul ignore next
  return false
}

const instance = {current: undefined};

afterEach(() => {
  instance.current = undefined;
})

function getCurrentInstance() {
  /**
   * Worth mentioning that this deviates from the upstream implementation
   * of `dom-testing-library`'s `getDocument`, which throws an error whenever
   * `window` is not defined.
   *
   * Admittedly, this is another way that `cli-testing-library` will need to figure out
   * the right solution to this problem, since there is no omni-present parent `instance`
   * in a CLI like there is in a browser. (although FWIW, "process" might work)
   *
   * Have ideas how to solve? Please let us know:
   * https://github.com/crutchcorn/cli-testing-library/issues/2
   */
  return instance.current
}

// TODO: Does this need to be namespaced for each test that runs?
//  That way, we don't end up with a "singleton" that ends up wiped between
//  parallel tests.
function setCurrentInstance(newInstance) {
  instance.current = newInstance;
}

export {jestFakeTimersAreEnabled, setCurrentInstance, getCurrentInstance}
