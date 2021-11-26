import {eventMap} from './event-map'

const fireEvent = (instance, event) => {
    fireEvent[event](instance);
}

Object.entries(eventMap).forEach(
  ([eventName, eventFn]) => {
    fireEvent[eventName] = ((instance, ...props) => {
        eventFn(instance, ...(props))
    })
  }
)

function getFireEventForElement (
    instance
) {
    const fireEventElement = event => fireEvent(instance, event);
    Object.entries(fireEvent).forEach(( [eventName, eventFn]) => {
        fireEventElement[eventName] = (...props) => eventFn(instance, ...(props))
    })
    return {
        fireEvent: fireEventElement
    }
}

export {fireEvent, getFireEventForElement}
