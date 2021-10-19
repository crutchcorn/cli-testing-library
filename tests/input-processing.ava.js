const test = require("ava");
const { render } = require("./_test-utils");

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

test.skip("should show help information on help flag", async (t) => {
  const { stdoutArr } = await render(["--help"]);
  t.regex(stdoutArr.join("\n"), /Usage:/);
  t.snapshot(stdoutArr.join("\n"));
});

test.skip("should show version on version flag", async (t) => {
  const { stdoutArr } = await render(["--version"]);
  t.regex(stdoutArr.join("\n"), /^[\w\.-]+$/);
});

test("should show version on v flag", async (t) => {
  const props = await render(["-v"]);
  t.regex(props.stdoutArr.join("\n"), /^[\w\.-]+$/);
});
