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
