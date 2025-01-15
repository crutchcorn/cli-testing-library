import {Config, ConfigFn} from '../types/config'
import {TestInstance} from '../types/pure'
// import {prettyDOM} from './pretty-dom'

type Callback<T> = () => T
interface InternalConfig extends Config {
  _disableExpensiveErrorDiagnostics: boolean
}

// It would be cleaner for this to live inside './queries', but
// other parts of the code assume that all exports from
// './queries' are query functions.
let config: InternalConfig = {
  asyncUtilTimeout: 1000,
  // Short amount of time to wait for your process to spin up after a `spawn`. AFAIK There's unfortunately not much
  // of a better way to do this
  renderAwaitTime: 100,
  // Internal timer time to wait before attempting error recovery debounce action
  errorDebounceTimeout: 100,
  unstable_advanceTimersWrapper: cb => cb(),
  // default value for the `hidden` option in `ByRole` queries
  // showOriginalStackTrace flag to show the full error stack traces for async errors
  showOriginalStackTrace: false,

  // throw errors w/ suggestions for better queries. Opt in so off by default.
  throwSuggestions: false,

  // called when getBy* queries fail. (message, container) => Error
  getInstanceError(message, testInstance: TestInstance | undefined) {
    let instanceWarning: string = ''
    if (testInstance) {
      const stdallArrStr = testInstance.getStdallStr()
      instanceWarning = `\n${stdallArrStr}`
    } else {
      instanceWarning = ''
    }
    const error = new Error(
      [message, instanceWarning].filter(Boolean).join('\n\n'),
    )
    error.name = 'TestingLibraryElementError'
    return error
  },
  _disableExpensiveErrorDiagnostics: false,
}

export function runWithExpensiveErrorDiagnosticsDisabled<T>(
  callback: Callback<T>,
) {
  try {
    config._disableExpensiveErrorDiagnostics = true
    return callback()
  } finally {
    config._disableExpensiveErrorDiagnostics = false
  }
}

export function configure(newConfig: ConfigFn | Partial<Config>) {
  if (typeof newConfig === 'function') {
    // Pass the existing config out to the provided function
    // and accept a delta in return
    newConfig = newConfig(config)
  }

  // Merge the incoming config delta
  config = {
    ...config,
    ...newConfig,
  }
}

export function getConfig(): Config {
  return config
}
