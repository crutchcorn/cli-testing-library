const {resolve} = require('path')
const {render} = require('../pure')
const {waitFor} = require('../wait-for')

test('Should expect error codes when intended', async () => {
  const instance = await render('node', [
    resolve(__dirname, './execute-scripts/throw.js'),
  ])
  await waitFor(() => expect(instance.hasExit()).toMatchObject({exitCode: 1}))
})

test('Should handle argument passing', async () => {
  const {findByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(await findByText('--version')).toBeTruthy()
})

test('Is able to make terminal input and view in-progress stdout', async () => {
  const props = await render('node', [
    resolve(__dirname, './execute-scripts/stdio-inquirer.js'),
  ])

  const {clear, findByText, userEvent} = props

  const instance = await findByText('First option')

  expect(instance).toBeTruthy()

  // Windows uses ">", Linux/MacOS use "❯"
  expect(await findByText(/[❯>] One/)).toBeTruthy()

  clear()

  userEvent.keyboard('[ArrowDown]')

  expect(await findByText(/[❯>] Two/)).toBeTruthy()

  clear()

  userEvent.keyboard('[Enter]')

  expect(await findByText('First option: Two')).toBeTruthy()
})
