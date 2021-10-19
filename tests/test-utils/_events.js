const {eventMap} = require('./_event-map');

const fireEvent = Object.entries(eventMap).reduce(
  (prev, [eventName, keyCode]) => {
    prev[eventName] = (instance) => {
      instance.stdin.write(keyCode);
    };
    return prev;
  },
  {}
);

module.exports = { fireEvent };
