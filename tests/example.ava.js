const test = require("ava");
const { render } = require("./_test-utils");
const { waitFor } = require("./_wait-for");
const { resolve } = require("path");

test("Should fail", async (t) => {
  const { cleanup, getByText, fireEvent } = await render([""], {
    cwd: resolve(__dirname, "../example"),
  });
  let outputStr;
  outputStr = await waitFor(() => getByText("Please choose a generator"));

  t.regex(outputStr, /Please choose a generator/);

  cleanup();
  fireEvent.up();
  fireEvent.down();
  fireEvent.enter();
  outputStr = await waitFor(() => getByText("this is a test"));

  t.regex(outputStr, /this is a test/);
});
