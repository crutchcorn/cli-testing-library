const expectedLength = Number.parseInt(process.argv[2] ?? "", 10);

if (!Number.isSafeInteger(expectedLength) || expectedLength < 0) {
  throw new TypeError("Expected a non-negative stdin byte length");
}

/** @type {Array<Buffer>} */
const chunks = [];
let receivedLength = 0;

process.stdin.on("data", (chunk) => {
  const buffer = Buffer.from(chunk);
  chunks.push(buffer);
  receivedLength += buffer.length;

  if (receivedLength < expectedLength) return;

  const bytes = Buffer.concat(chunks);
  process.stdout.write(
    `BYTES:${JSON.stringify({
      hex: bytes.toString("hex"),
      length: bytes.length,
    })}\n`,
    () => process.exit(receivedLength === expectedLength ? 0 : 1),
  );
});

process.stdout.write("READY\n");
