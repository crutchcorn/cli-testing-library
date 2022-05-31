import {eventMap} from './event-map.js'

/**
 * Silence TypeScript errors
 * @type {*}
 */
const fireEvent = (instance, event, props = undefined) => {
  eventMap[event](instance, props)
}

Object.entries(eventMap).forEach(([eventName, eventFn]) => {
  fireEvent[eventName] = (instance, ...props) => {
    eventFn(instance, ...props)
  }
})

export {fireEvent}
