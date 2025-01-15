import {TestInstance} from '../types'
declare const eventMap: {
  sigterm: (instance: TestInstance) => Promise<void>
  sigkill: (instance: TestInstance) => Promise<void>
  write: (
    instance: TestInstance,
    props: {
      value: string
    },
  ) => boolean
}
export {eventMap}
