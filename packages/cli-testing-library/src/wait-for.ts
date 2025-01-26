// Migrated from: https://github.com/testing-library/dom-testing-library/blob/main/src/wait-for.js
// TODO: Migrate back to use `config.js` file
import { getCurrentInstance, jestFakeTimersAreEnabled } from "./helpers";
import { MutationObserver } from "./mutation-observer";
import { getConfig } from "./config";
import type { TestInstance } from "./types";

// This is so the stack trace the developer sees is one that's
// closer to their code (because async stack traces are hard to follow).
function copyStackTrace(target: Error, source: Error) {
  target.stack = source.stack!.replace(source.message, target.message);
}

export interface waitForOptions {
  instance?: TestInstance;
  showOriginalStackTrace?: boolean;
  timeout?: number;
  interval?: number;
  onTimeout?: (error: Error) => Error;
  stackTraceError?: Error;
}

function waitFor<T>(
  callback: () => Promise<T> | T,
  {
    instance = getCurrentInstance(),
    timeout = getConfig().asyncUtilTimeout,
    showOriginalStackTrace = getConfig().showOriginalStackTrace,
    stackTraceError,
    interval = 50,
    onTimeout = (error) => {
      error.message = getConfig().getInstanceError(
        error.message,
        instance!,
      ).message;
      return error;
    },
  }: Omit<waitForOptions, "stackTraceError"> & {
    stackTraceError: Error;
  } = {
    stackTraceError: new Error("STACK_TRACE_MESSAGE"),
  },
): Promise<T> {
  if (typeof callback !== "function") {
    throw new TypeError("Received `callback` arg must be a function");
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let lastError: Error | null = null;
    let intervalId!: NodeJS.Timeout;
    let observer: MutationObserver;
    let finished = false;
    let promiseStatus = "idle";

    const overallTimeoutTimer = setTimeout(handleTimeout, timeout);

    const usingJestFakeTimers = jestFakeTimersAreEnabled();
    if (usingJestFakeTimers) {
      const { unstable_advanceTimersWrapper: advanceTimersWrapper } =
        getConfig();
      checkCallback();
      // this is a dangerous rule to disable because it could lead to an
      // infinite loop. However, eslint isn't smart enough to know that we're
      // setting finished inside `onDone` which will be called when we're done
      // waiting or when we've timed out.

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (!finished) {
        if (!jestFakeTimersAreEnabled()) {
          const error = new Error(
            `Changed from using fake timers to real timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to real timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`,
          );
          if (!showOriginalStackTrace) copyStackTrace(error, stackTraceError);
          reject(error);
          return;
        }
        // we *could* (maybe should?) use `advanceTimersToNextTimer` but it's
        // possible that could make this loop go on forever if someone is using
        // third party code that's setting up recursive timers so rapidly that
        // the user's timer's don't get a chance to resolve. So we'll advance
        // by an interval instead. (We have a test for this case).
        advanceTimersWrapper(() => {
          if (typeof jest !== "undefined") {
            jest.advanceTimersByTime(interval);
          } else if (typeof vi !== "undefined") {
            vi.advanceTimersByTime(interval);
          }
        });

        // It's really important that checkCallback is run *before* we flush
        // in-flight promises. To be honest, I'm not sure why, and I can't quite
        // think of a way to reproduce the problem in a test, but I spent
        // an entire day banging my head against a wall on this.
        checkCallback();

        // In this rare case, we *need* to wait for in-flight promises
        // to resolve before continuing. We don't need to take advantage
        // of parallelization so we're fine.
        // https://stackoverflow.com/a/59243586/971592

        await advanceTimersWrapper(async () => {
          await new Promise((r) => {
            setTimeout(r, 0);
            if (typeof jest !== "undefined") jest.advanceTimersByTime(0);
            else if (typeof vi !== "undefined") vi.advanceTimersByTime(0);
          });
        });
      }
    } else {
      intervalId = setInterval(checkRealTimersCallback, interval);
      observer = new MutationObserver(checkRealTimersCallback);
      observer.observe();
      checkCallback();
    }

    function onDone(error: null, result: T): void;
    function onDone(error: Error, result: null): void;
    function onDone(error: Error | null, result: T | null) {
      finished = true;
      clearTimeout(overallTimeoutTimer);

      if (!usingJestFakeTimers) {
        clearInterval(intervalId);
        observer.disconnect();
      }

      if (error) {
        reject(error);
      } else {
        resolve(result!);
      }
    }

    function checkRealTimersCallback() {
      if (jestFakeTimersAreEnabled()) {
        const error = new Error(
          `Changed from using real timers to fake timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to fake timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`,
        );
        if (!showOriginalStackTrace) copyStackTrace(error, stackTraceError);
        return reject(error);
      } else {
        return checkCallback();
      }
    }

    function checkCallback() {
      if (promiseStatus === "pending") return;
      try {
        const result = callback(); // runWithExpensiveErrorDiagnosticsDisabled(callback)
        const isPromise = (r: unknown): r is Promise<T> =>
          !!r && typeof (r as Promise<T>).then === "function";
        if (isPromise(result)) {
          promiseStatus = "pending";
          result.then(
            (resolvedValue) => {
              promiseStatus = "resolved";
              onDone(null, resolvedValue);
            },
            (rejectedValue) => {
              promiseStatus = "rejected";
              lastError = rejectedValue;
            },
          );
        } else {
          onDone(null, result);
        }
        // If `callback` throws, wait for the next mutation, interval, or timeout.
      } catch (error) {
        // Save the most recent callback error to reject the promise with it in the event of a timeout
        lastError = error as Error;
      }
    }

    function handleTimeout() {
      let error;
      if (lastError) {
        error = lastError;
        if (
          !showOriginalStackTrace &&
          error.name === "TestingLibraryElementError"
        ) {
          copyStackTrace(error, stackTraceError);
        }
      } else {
        error = new Error("Timed out in waitFor.");
        if (!showOriginalStackTrace) {
          copyStackTrace(error, stackTraceError);
        }
      }
      onDone(onTimeout(error), null);
    }
  });
}

function waitForWrapper<T>(
  callback: () => Promise<T> | T,
  options?: waitForOptions,
): Promise<T> {
  // create the error here so its stack trace is as close to the
  // calling code as possible
  const stackTraceError = new Error("STACK_TRACE_MESSAGE");
  return waitFor(callback, { stackTraceError, ...options });
}

export { waitForWrapper as waitFor };
