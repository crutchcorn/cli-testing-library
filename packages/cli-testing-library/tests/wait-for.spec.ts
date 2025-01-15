import {waitFor} from '../src/index'
import {configure, getConfig} from '../src/config'
// import {render} from '../pure'
import {test, expect, vi} from 'vitest'

function deferred() {
  let resolve!: (...props: unknown[]) => void;
  let reject!: (...props: unknown[]) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

test('waits callback to not throw an error', async () => {
  const spy = vi.fn()
  // we are using random timeout here to simulate a real-time example
  // of an async operation calling a callback at a non-deterministic time
  const randomTimeout = Math.floor(Math.random() * 60)
  setTimeout(spy, randomTimeout)

  await waitFor(() => expect(spy).toHaveBeenCalledTimes(1))
  expect(spy).toHaveBeenCalledWith()
})

// we used to have a limitation where we had to set an interval of 0 to 1
// otherwise there would be problems. I don't think this limitation exists
// anymore, but we'll keep this test around to make sure a problem doesn't
// crop up.
test('can accept an interval of 0', () => waitFor(() => {}, {interval: 0}))

test('can timeout after the given timeout time', async () => {
  const error = new Error('throws every time')
  const result = await waitFor(
    () => {
      throw error
    },
    {timeout: 8, interval: 5},
  ).catch(e => e)
  expect(result).toBe(error)
})

test('if no error is thrown then throws a timeout error', async () => {
  const result = await waitFor(
    () => {
      // eslint-disable-next-line no-throw-literal
      throw undefined
    },
    {timeout: 8, interval: 5, onTimeout: e => e},
  ).catch(e => e)
  expect(result).toMatchInlineSnapshot(`[Error: Timed out in waitFor.]`)
})

test('if showOriginalStackTrace on a timeout error then the stack trace does not include this file', async () => {
  const result = await waitFor(
    () => {
      // eslint-disable-next-line no-throw-literal
      throw undefined
    },
    {timeout: 8, interval: 5, showOriginalStackTrace: true},
  ).catch(e => e)
  expect(result.stack).not.toMatch(__dirname)
})

test('uses full stack error trace when showOriginalStackTrace present', async () => {
  const error = new Error('Throws the full stack trace')
  // even if the error is a TestingLibraryElementError
  error.name = 'TestingLibraryElementError'
  const originalStackTrace = error.stack
  const result = await waitFor(
    () => {
      throw error
    },
    {timeout: 8, interval: 5, showOriginalStackTrace: true},
  ).catch(e => e)
  expect(result.stack).toBe(originalStackTrace)
})

test('does not change the stack trace if the thrown error is not a TestingLibraryElementError', async () => {
  const error = new Error('Throws the full stack trace')
  const originalStackTrace = error.stack
  const result = await waitFor(
    () => {
      throw error
    },
    {timeout: 8, interval: 5},
  ).catch(e => e)
  expect(result.stack).toBe(originalStackTrace)
})

test('provides an improved stack trace if the thrown error is a TestingLibraryElementError', async () => {
  const error = new Error('Throws the full stack trace')
  error.name = 'TestingLibraryElementError'
  const originalStackTrace = error.stack
  const result = await waitFor(
    () => {
      throw error
    },
    {timeout: 8, interval: 5},
  ).catch(e => e)
  // too hard to test that the stack trace is what we want it to be
  // so we'll just make sure that it's not the same as the original
  expect(result.stack).not.toBe(originalStackTrace)
})

test('throws nice error if provided callback is not a function', () => {
  const someElement = 'Hello'
  expect(() => waitFor(someElement as never)).toThrow(
    'Received `callback` arg must be a function',
  )
})

// eslint-disable-next-line jest/no-commented-out-tests
// test('timeout logs a pretty DOM', async () => {
//   renderIntoDocument(`<div id="pretty">how pretty</div>`)
//   const error = await waitFor(
//     () => {
//       throw new Error('always throws')
//     },
//     {timeout: 1},
//   ).catch(e => e)
//   expect(error.message).toMatchInlineSnapshot(`
// always throws
//
// Ignored nodes: comments, <script />, <style />
// <html>
//   <head />
//   <body>
//     <div
//       id="pretty"
//     >
//       how pretty
//     </div>
//   </body>
// </html>
// `)
// })

test('should delegate to config.getInstanceError', async () => {
  const originalConfig = getConfig()
  const elementError = new Error('Custom instance error')
  const getInstanceError = vi.fn().mockImplementation(() => elementError)
  configure({getInstanceError})

  const error = await waitFor(
    () => {
      throw new Error('always throws')
    },
    {timeout: 1},
  ).catch(e => e)

  expect(getInstanceError).toBeCalledTimes(1)
  expect(error.message).toMatchInlineSnapshot(`Custom instance error`)
  configure(originalConfig)
})

test('when a promise is returned, it does not call the callback again until that promise rejects', async () => {
  const sleep = (t: number) => new Promise(r => setTimeout(r, t))
  const p1 = deferred()
  const waitForCb = vi.fn(() => p1.promise)
  const waitForPromise = waitFor(waitForCb, {interval: 1})
  expect(waitForCb).toHaveBeenCalledTimes(1)
  waitForCb.mockClear()
  await sleep(50)
  expect(waitForCb).toHaveBeenCalledTimes(0)

  const p2 = deferred()
  waitForCb.mockImplementation(() => p2.promise)

  p1.reject('p1 rejection (should not fail this test)')
  await sleep(50)

  expect(waitForCb).toHaveBeenCalledTimes(1)
  p2.resolve()

  await waitForPromise
})

test('when a promise is returned, if that is not resolved within the timeout, then waitFor is rejected', async () => {
  const sleep = (t: number) => new Promise(r => setTimeout(r, t))
  const {promise} = deferred()
  const waitForError = waitFor(() => promise, {timeout: 1}).catch(e => e)
  await sleep(5)

  expect((await waitForError as {message: string}).message).toMatchInlineSnapshot(
    `Timed out in waitFor.`,
  )
})

test('if you switch from fake timers to real timers during the wait period you get an error', async () => {
  vi.useFakeTimers()
  const waitForError = waitFor(() => {
    throw new Error('this error message does not matter...')
  }).catch(e => e)

  // this is the problem...
  vi.useRealTimers()

  const error = await waitForError

  expect(error.message).toMatchInlineSnapshot(
    `Changed from using fake timers to real timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to real timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`,
  )
  // stack trace has this file in it
  expect(error.stack).toMatch(__dirname)
})

test('if you switch from real timers to fake timers during the wait period you get an error', async () => {
  const waitForError = waitFor(() => {
    throw new Error('this error message does not matter...')
  }).catch(e => e)

  // this is the problem...
  vi.useFakeTimers()
  const error = await waitForError

  expect(error.message).toMatchInlineSnapshot(
    `Changed from using real timers to fake timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to fake timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`,
  )
  // stack trace has this file in it
  expect(error.stack).toMatch(__dirname)
})

test('the fake timers => real timers error shows the original stack trace when configured to do so', async () => {
  vi.useFakeTimers()
  const waitForError = waitFor(
    () => {
      throw new Error('this error message does not matter...')
    },
    {showOriginalStackTrace: true},
  ).catch(e => e)

  vi.useRealTimers()

  expect((await waitForError).stack).not.toMatch(__dirname)
})

test('the real timers => fake timers error shows the original stack trace when configured to do so', async () => {
  const waitForError = waitFor(
    () => {
      throw new Error('this error message does not matter...')
    },
    {showOriginalStackTrace: true},
  ).catch(e => e)

  vi.useFakeTimers()

  expect((await waitForError).stack).not.toMatch(__dirname)
})
