import { emitKeypressEvents } from "node:readline";

const expectedEventCount = Number.parseInt(process.argv[2] ?? "", 10);

if (!Number.isSafeInteger(expectedEventCount) || expectedEventCount < 1) {
  throw new TypeError("Expected a positive keypress event count");
}

/**
 * @type {Array<{
 *   code: string | null;
 *   ctrl: boolean;
 *   input: string | null;
 *   meta: boolean;
 *   name: string | null;
 *   sequenceHex: string;
 *   shift: boolean;
 * }>}
 */
const events = [];

emitKeypressEvents(process.stdin);
process.stdin.on("keypress", (input, key = {}) => {
  events.push({
    code: key.code ?? null,
    ctrl: key.ctrl ?? false,
    input: input ?? null,
    meta: key.meta ?? false,
    name: key.name ?? null,
    sequenceHex: Buffer.from(key.sequence ?? "").toString("hex"),
    shift: key.shift ?? false,
  });

  if (events.length < expectedEventCount) return;

  process.stdout.write(`KEYS:${JSON.stringify(events)}\n`, () =>
    process.exit(0),
  );
});

process.stdout.write("READY\n");
