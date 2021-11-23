const kill = require('tree-kill');

const eventMap = {
  down: instance => instance.stdin.write('\x1B\x5B\x42'),
  up: instance => instance.stdin.write('\x1B\x5B\x41'),
  enter: instance => instance.stdin.write('\x0D'),
  sigterm: instance => kill(instance.pid),
  sigkill: instance => kill(instance.pid, 'SIGKILL')
}

export {eventMap}
