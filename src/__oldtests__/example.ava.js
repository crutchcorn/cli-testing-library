const test = require("ava");
const { render, waitFor, fireEvent } = require("./test-utils/_index");
const { resolve } = require("path");

test("Is able to make terminal input and view in-progress stdout", async (t) => {
  const { cleanup, getByText } = await render([""], {
    cwd: resolve(__dirname, "../example"),
  });
  let outputStr;
  outputStr = await waitFor(() => getByText("Please choose a generator"));

  t.truthy(outputStr);

  cleanup();
  fireEvent.up(outputStr);
  fireEvent.down(outputStr);
  fireEvent.enter(outputStr);
  outputStr = await waitFor(() => getByText("this is a test"));

  t.truthy(outputStr);
});
