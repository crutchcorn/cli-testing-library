const {resolve} = require('path')
const {render} = require('../pure')
const {fireEvent} = require('../events')

test('Should handle stderr outputs with rejection', async () => {
  await expect(() =>
    render('node', [resolve(__dirname, './execute-scripts/throw.js')]),
  ).rejects.toThrow(/Search for this error in stderr/)
})

test('Should handle argument passing', async () => {
  const {findByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(await findByText('--version')).toBeTruthy()
})

test('Is able to make terminal input and view in-progress stdout', async () => {
  const {cleanup, findByText} = await render('node', [
    resolve(__dirname, './execute-scripts/stdio-inquirer.js'),
  ])

  const instance = await findByText('First option')

  expect(instance).toBeTruthy()

  expect(await findByText('❯ One')).toBeTruthy()

  cleanup()

  fireEvent.down(instance)

  expect(await findByText('❯ Two')).toBeTruthy()

  cleanup()

  fireEvent.enter(instance)

  expect(await findByText('First option: Two')).toBeTruthy()
})
