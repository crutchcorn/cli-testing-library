const {resolve} = require("path");
const {render} = require("../pure");
const {fireEvent} = require("../events");

test.only("Should handle stderr outputs with rejection", async () => {
    await expect(() => render(
        'node',
        [resolve(__dirname, './execute-scripts/throw.js')]
    )).rejects.toThrow(/Search for this error in stderr/);
});

test("Should handle argument passing", async () => {
    const {findByText} = await render(["--version"]);
    expect(await findByText(/^[\w.-]+$/)).toBeTruthy();
});

test("Is able to make terminal input and view in-progress stdout", async () => {
    const {cleanup, findByText} = await render([""], {
        cwd: resolve(__dirname, "../example"),
    });

    const instance = await findByText("Please choose a generator");

    expect(instance).toBeTruthy();

    cleanup();
    fireEvent.up(instance);
    fireEvent.down(instance);
    fireEvent.enter(instance);
    expect(await findByText("this is a test")).toBeTruthy();
});
