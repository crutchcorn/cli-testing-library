const test = require("ava");
const { render } = require("./test-utils/_index");

test("should report a missing plopfile when not copied", async (t) => {
  await t.throwsAsync(
    async () => {
      await render();
    },
    {
      message: /\[PLOP\] No plopfile found/,
    }
  );
});

test("should show help information on help flag", async (t) => {
  const { stdoutStr } = await render(["--help"]);
  t.regex(stdoutStr, /Usage:/);
  t.snapshot(stdoutStr);
});

test("should show version on version flag", async (t) => {
  const { stdoutStr } = await render(["--version"]);
  t.regex(stdoutStr, /^[\w\.-]+$/);
});

test("should show version on v flag", async (t) => {
  const { stdoutStr } = await render(["-v"]);
  t.regex(stdoutStr, /^[\w\.-]+$/);
});
