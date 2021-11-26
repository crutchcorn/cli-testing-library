const {resolve} = require('path')
const isRunning = require('is-running')
const {render} = require('../pure')
const {fireEvent} = require('../events')
const {waitFor} = require("../wait-for");
const {getConfig, configure} = require("../config");

let originalConfig
beforeEach(() => {
  originalConfig = getConfig()
  configure({asyncUtilTimeout: 15000})
})

afterEach(() => {
  configure(originalConfig)
})

// TODO: fireEvent should not be bound

// Refactor to use `fireEvent` and not `userEvent` style
test.skip('Is able to use fireEvent as function', async () => {
  const props = await render('node', [
    resolve(__dirname, './execute-scripts/stdio-inquirer.js'),
  ])

  const {clear, findByText} = props;

  const instance = await findByText('First option')

  expect(instance).toBeTruthy()

  // Windows uses ">", Linux/MacOS use "❯"
  expect(await findByText(/[❯>] One/)).toBeTruthy()

  clear()

  fireEvent(instance, 'down')

  expect(await findByText(/[❯>] Two/)).toBeTruthy()

  clear()

  fireEvent(instance, 'enter')

  expect(await findByText('First option: Two')).toBeTruthy()
})

// Refactor to use `fireEvent` and not `userEvent` style
// TODO: fireEvent should not be bound
test.skip('fireEvent works when bound', async () => {
  const {fireEvent: fireEventLocal, findByText, clear} = await render('node', [
    resolve(__dirname, './execute-scripts/stdio-inquirer.js'),
  ])

  const instance = await findByText('First option')

  expect(instance).toBeTruthy()

  // Windows uses ">", Linux/MacOS use "❯"
  expect(await findByText(/[❯>] One/)).toBeTruthy()

  clear();

  fireEventLocal.down()

  expect(await findByText(/[❯>] Two/)).toBeTruthy()

  fireEventLocal.enter()
  fireEventLocal.enter()
  clear();
})

// Refactor to use `fireEvent` and not `userEvent` style
// TODO: fireEvent should not be bound
test.skip('fireEvent works when bound and used as function', async () => {
  const {fireEvent: fireEventLocal, findByText, clear} = await render('node', [
    resolve(__dirname, './execute-scripts/stdio-inquirer.js'),
  ])

  const instance = await findByText('First option')

  expect(instance).toBeTruthy()

  // Windows uses ">", Linux/MacOS use "❯"
  expect(await findByText(/[❯>] One/)).toBeTruthy()

  clear();

  fireEventLocal('down')

  expect(await findByText(/[❯>] Two/)).toBeTruthy()

  fireEventLocal('enter')
  fireEventLocal('enter')
  clear();
})

// Refactor to use `fireEvent` and not `userEvent` style
test.skip('SigTerm works', async () => {
  const {findByText} = await render('node', [
    resolve(__dirname, './execute-scripts/stdio-inquirer.js'),
  ])

  const instance = await findByText('First option')

  expect(instance).toBeTruthy()

  fireEvent.sigterm(instance);

  await waitFor(() => expect(isRunning(instance.pid)).toBeFalsy())
})

test.todo('userEvent SigTerm works')

// Refactor to use `fireEvent` and not `userEvent` style
test.skip('input works', async () => {
  const {findByText, fireEvent: fireEventLocal, clear} = await render('node', [
    resolve(__dirname, './execute-scripts/stdio-inquirer-input.js'),
  ])

  expect(await findByText('What is your name?')).toBeTruthy()

  fireEventLocal.keyboard("Corbin");

  expect(await findByText('Corbin')).toBeTruthy()

  fireEventLocal.enter();

  clear()
})

test.todo("UserEvent.keyboard works")
