import treeKill from 'tree-kill';

import {TestInstance} from "../types";

const kill = (instance: TestInstance, signal: string) => new Promise<void>((resolve, reject) => {
    if (!instance.pid || (instance.pid && instance.hasExit())) {
        resolve();
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    treeKill(instance.pid, signal, err => {
        if (err) {
            if (err.message.includes("The process") && err.message.includes("not found.")) {
                resolve()
                return;
            }
            reject(err)
        }
        else resolve()
    })
});

const eventMap = {
    sigterm: (instance: TestInstance) => kill(instance, "SIGTERM"),
    sigkill: (instance: TestInstance) => kill(instance, "SIGKILL"),
    write: (instance: TestInstance, props: { value: string }) => instance.stdin.write(props.value)
}

export {eventMap}
