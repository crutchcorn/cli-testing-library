interface FakeTimerController {
  advanceTimersByTime: (milliseconds: number) => void;
  isFakeTimers?: () => boolean;
}

type CleanupHook = (callback: () => Promise<void> | void) => void;

interface TestRunnerGlobals {
  afterEach?: CleanupHook;
  jest?: FakeTimerController;
  teardown?: CleanupHook;
  vi?: FakeTimerController;
}

export const testRunnerGlobals = globalThis as unknown as TestRunnerGlobals;
