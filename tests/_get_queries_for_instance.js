const EVENTS_MAP = {
  down: "\x1B\x5B\x42",
  up: "\x1B\x5B\x41",
  enter: "\x0D",
};

const fireEvent = Object.entries(EVENTS_MAP).reduce(
  (prev, [eventName, keyCode]) => {
    prev[eventName] = (instance) => {
      instance.stdin.write(keyCode);
    };
    return prev;
  },
  {}
);

function getFireEventProxy(instance) {
    return new Proxy(fireEvent, {
        get: function (object, name) {
            return () => object[name](instance);
        }
    })
}

module.exports = { fireEvent, getFireEventProxy };
