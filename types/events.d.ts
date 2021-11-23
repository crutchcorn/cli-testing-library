import {eventMap} from "../src/event-map";
import {ShiftArgs} from "./helpers";
import {TestInstance} from "./pure";

export const fireEvent = typeof eventMap;

export function getFireEventForElement (
    instance: TestInstance
): {
    [key in keyof FireEventRecord]: ShiftArgs<FireEventRecord[key]>;
};
