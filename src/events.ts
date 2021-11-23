import {eventMap} from './event-map'
import {TestInstance} from "../types/pure";
import {ShiftArgs} from "../types/helpers";

type FireEventRecord = Record<string, (instance: TestInstance) => void>;

type BoundFireEventRecord = Record<
    string,
    ShiftArgs<FireEventRecord[string]>
>


const fireEvent = Object.entries(eventMap).reduce<FireEventRecord>(
  (prev, [eventName, keyCode]) => {
    prev[eventName] = (instance) => {
      instance.stdin.write(keyCode)
    }
    return prev
  },
  {}
)

function getFireEventForElement (
    instance: TestInstance
) {
    return {
        fireEvent: Object.entries(fireEvent).reduce<BoundFireEventRecord>((prev, [eventName, eventFn]) => {
            prev[eventName] = () => eventFn(instance)
            return prev;
        }, {})
    }
}

export {fireEvent, getFireEventForElement}
