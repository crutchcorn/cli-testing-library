import kill from 'tree-kill';

import {TestInstance} from "../types/pure";
import isRunning from 'is-running';

const eventMap = {
  down: (instance: TestInstance) => instance.stdin.write('\x1B\x5B\x42'),
  up: (instance: TestInstance) => instance.stdin.write('\x1B\x5B\x41'),
  enter: (instance: TestInstance) => instance.stdin.write('\x0D'),
  sigterm: (instance: TestInstance) => instance.pid && isRunning(instance.pid) && kill(instance.pid),
  sigkill: (instance: TestInstance) => instance.pid && isRunning(instance.pid) && kill(instance.pid, 'SIGKILL'),
  type: (instance: TestInstance, text: string) => instance.stdin.write(text)
}

export {eventMap}
