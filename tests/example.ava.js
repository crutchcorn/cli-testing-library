const test = require("ava");
const { render, UP, DOWN, ENTER } = require("./_test-utils");
// const { waitFor } = require("./_wait-for");
const { resolve } = require("path");

test.skip("Should fail", async (t) => {
  const props = await render([""], {
    cwd: resolve(__dirname, "../example"),
  });

  // console.log("PROPS ARE SET LOL", props);

  const { stdoutArr, stdin, cancel, clear } = props;

  // console.log("BEFORE WAITFOR");
  // await waitFor(() =>
  //   Promise.resolve(/Please choose a generator/.exec(stdoutArr.join("\n")))
  // );
  // console.log("AFTER WAITFOR");

  t.regex(stdoutArr.join("\n"), /Please choose a generator/);

  clear();
  stdin.write(UP);
  stdin.write(DOWN);
  stdin.write(ENTER);
  // await waitFor(() =>
  //   Promise.resolve(/this is a test/.exec(stdoutArr.join("\n")))
  // );

  t.regex(stdoutArr.join("\n"), /this is a test/);
  cancel();
});
