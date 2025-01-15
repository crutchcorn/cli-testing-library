import {cleanup} from './pure'

// if we're running in a test runner that supports afterEach
// or teardown then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other
// if you don't like this then set the CTL_SKIP_AUTO_CLEANUP env variable to 'true'.
if (
  typeof process === 'undefined' ||
  !(process.env && process.env.CTL_SKIP_AUTO_CLEANUP)
) {
  // ignore teardown() in code coverage because Jest does not support it
  /* istanbul ignore else */
  if (typeof afterEach === 'function') {
    afterEach(async () => {
      await cleanup()
    })
  } else if (typeof teardown === 'function') {
    // Block is guarded by `typeof` check.
    // eslint does not support `typeof` guards.
    // eslint-disable-next-line no-undef
    teardown(async () => {
      await cleanup()
    })
  }
}

export * from './config'
export * from './helpers.js'
export * from './events.js'
export * from './get-queries-for-instance.js'
export * from './matches.js'
export * from './pure'
export * from './query-helpers'
export * from './queries/index.js'
export * from './mutation-observer.js'
export * from './wait-for.js'
export * from './user-event'
