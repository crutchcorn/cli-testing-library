import {eventMap} from './event-map'

/**
 * Silence TypeScript errors
 * @type {*}
 */
const fireEvent = Object.entries(eventMap).reduce(
  (prev, [eventName, eventFn]) => {
    prev[eventName] = ((instance, ...props) => {
        eventFn(instance, ...(props))
    })
    return prev
  },
  {}
)

function getFireEventForElement (
    instance
) {
    return {
        fireEvent: Object.entries(fireEvent).reduce((prev, [eventName, eventFn]) => {
            prev[eventName] = (...props) => eventFn(instance, ...(props))
            return prev;
        }, {})
    }
}

export {fireEvent, getFireEventForElement}
