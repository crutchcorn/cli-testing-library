import kill from 'tree-kill';

import isRunning from 'is-running';
import {TestInstance} from "../types/pure";

const eventMap = {
  sigterm: (instance: TestInstance) => instance.pid && isRunning(instance.pid) && kill(instance.pid),
  sigkill: (instance: TestInstance) => instance.pid && isRunning(instance.pid) && kill(instance.pid, 'SIGKILL'),
  write: (instance: TestInstance, props: {value: string}) => instance.stdin.write(props.value)
}

export {eventMap}
