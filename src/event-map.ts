import {TestInstance} from '../types'
import {killProc} from "./process-helpers";

const isWin = process.platform === "win32";

const eventMap = {
  sigterm: (instance: TestInstance) => killProc(instance, isWin ? undefined : 'SIGTERM'),
  sigkill: (instance: TestInstance) => killProc(instance, isWin ? undefined : 'SIGKILL'),
  write: (instance: TestInstance, props: {value: string}) =>
    instance.stdin.write(props.value),
}

export {eventMap}
