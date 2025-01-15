import {killProc} from './process-helpers'
import {TestInstance} from "./types";

const isWin = process.platform === 'win32'

const eventMap = {
  sigterm: (instance: TestInstance): Promise<void> =>
    killProc(instance, isWin ? undefined : 'SIGTERM'),
  sigkill: (instance: TestInstance): Promise<void> =>
    killProc(instance, isWin ? undefined : 'SIGKILL'),
  write: (instance: TestInstance, props: {value: string}): boolean =>
    instance.process.stdin.write(props.value),
}

export {eventMap}
