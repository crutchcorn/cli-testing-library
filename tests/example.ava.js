const test = require("ava");
const { render, UP, DOWN, ENTER } = require("./_test-utils");
const { waitFor } = require("./_wait-for");
const { resolve } = require("path");

test("Should fail", async (t) => {
  const { stdin, cleanup, getByText } = await render([""], {
    cwd: resolve(__dirname, "../example"),
  });
  let outputStr;
  outputStr = await waitFor(() => getByText("Please choose a generator"));

  t.regex(outputStr, /Please choose a generator/);

  cleanup();
  stdin.write(UP);
  stdin.write(DOWN);
  stdin.write(ENTER);
  outputStr = await waitFor(() => getByText("this is a test"));

  t.regex(outputStr, /this is a test/);
});
