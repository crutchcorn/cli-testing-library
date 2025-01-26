import { resolve } from "node:path";
import { expect, test } from "vitest";
import { render } from "../src/pure";
import { prettyCLI } from "../src/pretty-cli";

test("Should pretty print with ANSI codes properly", async () => {
  const instance = await render("node", [
    resolve(__dirname, "./execute-scripts/log-output.js"),
  ]);

  await instance.findByText("Hello");

  expect(prettyCLI(instance, 9000)).toMatchInlineSnapshot(`
    "__disable_ansi_serialization
    [34mHello[39m World[31m![39m"
  `);
});

test("Should escape ANSI codes properly when sliced too thin", async () => {
  const instance = await render("node", [
    resolve(__dirname, "./execute-scripts/log-output.js"),
  ]);

  await instance.findByText("Hello");

  expect(prettyCLI(instance, 30)).toMatchInlineSnapshot(`
    "__disable_ansi_serialization
    [34mH[39m"
  `);
});

test("Should show proper stderr and stdout output", async () => {
  const instance = await render("node", [
    resolve(__dirname, "./execute-scripts/log-err.js"),
  ]);

  await instance.findByError("Error here");

  expect(prettyCLI(instance, 300)).toMatchInlineSnapshot(`
    "Log here
    Warn here
    Error here"
  `);
});
