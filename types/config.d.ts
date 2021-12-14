import {TestInstance} from './pure'

export interface Config {
  /**
   * WARNING: `unstable` prefix means this API may change in patch and minor releases.
   * @param cb
   */
  unstable_advanceTimersWrapper(cb: (...args: unknown[]) => unknown): unknown
  asyncUtilTimeout: number
  renderAwaitTime: number
  errorDebounceTimeout: number
  showOriginalStackTrace: boolean
  throwSuggestions: boolean
  getInstanceError: (message: string | null, container: TestInstance) => Error
}

export interface ConfigFn {
  (existingConfig: Config): Partial<Config>
}

export function configure(configDelta: ConfigFn | Partial<Config>): void
export function getConfig(): Config
