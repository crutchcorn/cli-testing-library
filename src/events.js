import {eventMap} from './event-map';

const fireEvent = Object.entries(eventMap).reduce(
  (prev, [eventName, keyCode]) => {
    prev[eventName] = (instance) => {
      instance.stdin.write(keyCode);
    };
    return prev;
  },
  {}
);

export { fireEvent };
