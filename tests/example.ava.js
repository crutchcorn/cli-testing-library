const test = require("ava");
const { render, UP, DOWN, ENTER } = require("./_test-utils");
const { waitFor } = require("./_wait-for");
const { resolve } = require("path");

test("Should fail", async (t) => {
  const props = await render([""], {
    cwd: resolve(__dirname, "../example"),
  });

  const { stdoutArr, stdin, cleanup } = props;

  await waitFor(() =>
    Promise.resolve(/Please choose a generator/.exec(stdoutArr.join("\n")))
  );

  t.regex(stdoutArr.join("\n"), /Please choose a generator/);

  cleanup();
  stdin.write(UP);
  stdin.write(DOWN);
  stdin.write(ENTER);
  await waitFor(() =>
    Promise.resolve(/this is a test/.exec(stdoutArr.join("\n")))
  );

  t.regex(stdoutArr.join("\n"), /this is a test/);
});
