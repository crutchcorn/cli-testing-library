const {resolve} = require("path");
const {render} = require("../pure");
const {fireEvent} = require("../events");

test("Should handle stderr outputs with rejection", async () => {
    await expect(() => render(
        'node',
        [resolve(__dirname, './execute-scripts/throw.js')]
    )).rejects.toThrow(/Search for this error in stderr/);
});

test("Should handle argument passing", async () => {
    const {stdoutStr} = await render(
        'node',
        [resolve(__dirname, './execute-scripts/list-args.js'), '--version'],
    );

    expect(stdoutStr.includes('--version')).toBeTruthy();
});

test("Is able to make terminal input and view in-progress stdout", async () => {
    const {cleanup, findByText} = await render(
        'node',
        [resolve(__dirname, './execute-scripts/stdio-inquirer.js')],
    );

    const instance = await findByText("First option");

    expect(instance).toBeTruthy();

    expect(await findByText("❯ One")).toBeTruthy();

    await cleanup();

    fireEvent.down(instance);

    expect(await findByText("❯ Two")).toBeTruthy();

    fireEvent.enter(instance);
});
