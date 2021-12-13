const {resolve} = require('path')
const {render} = require('../pure')

test('toBeInTheConsole should pass when something is in console', async () => {
  const {findByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  await expect(
      (async () => expect(await findByText('--version')).toBeInTheConsole())()
  ).resolves.not.toThrow()
})

test('toBeInTheConsole should fail when something is not console', async () => {
  const {queryByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(() => expect(queryByText('NotHere')).toBeInTheConsole()).toThrow(/value must be a TestInstance/)
})

test('not.toBeInTheConsole should pass something is not console', async () => {
  const {queryByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(() => expect(queryByText('NotHere')).not.toBeInTheConsole()).not.toThrow()
})

test('not.toBeInTheConsole should fail something is console', async () => {
  const {queryByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(() => expect(queryByText('--version')).not.toBeInTheConsole()).toThrow(/Expected not to find the instance in the console/)
})

test('toHaveErrorMessage should pass during stderr when no string passed', async () => {
  const instance = await render('node', [
    resolve(__dirname, './execute-scripts/throw.js'),
  ])

  await expect(
      (async () => expect(instance).toHaveErrorMessage())()
  ).resolves.not.toThrow()
})

test('toHaveErrorMessage should pass during stderr when string passed', async () => {
  const instance = await render('node', [
    resolve(__dirname, './execute-scripts/throw.js'),
  ])

  await expect(
      (async () => expect(instance).toHaveErrorMessage(/Search for this error in stderr/))()
  ).resolves.not.toThrow()
})

test('toHaveErrorMessage should fail when something is not in stderr', async () => {
  const {findByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  const instance = await findByText('--version')
  expect(() => expect(instance).toHaveErrorMessage("Error isn't here")).toThrow(/Expected the instance to have error message/)
})

test('toHaveErrorMessage should fail when null is passed', async () => {
  const {queryByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(() => expect(queryByText('NotHere')).toHaveErrorMessage()).toThrow(/value must be a TestInstance/)
})
