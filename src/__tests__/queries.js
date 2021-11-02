const {resolve} = require('path')
const {render} = require('../pure')

test('findByText should find text', async () => {
  const {findByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(await findByText('--version')).toBeTruthy()
})

test('findByText should throw errors', async () => {
  const {findByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  await expect(() => findByText('--nothing')).rejects.toThrow('Unable to find an stdout line with the text:')
})

test('queryByText should find text', async () => {
  const {queryByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(await queryByText('--version')).toBeTruthy()
})

test('queryByText should not throw errors', async () => {
  const {queryByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(await queryByText('--nothing')).toBeFalsy();
})

test('getByText should find text', async () => {
  const {getByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(getByText('--version')).toBeTruthy();
})

test('getByText should throw errors', async () => {
  const {getByText} = await render('node', [
    resolve(__dirname, './execute-scripts/list-args.js'),
    '--version',
  ])

  expect(() => getByText('--nothing')).toThrow('Unable to find an stdout line with the text:');
})
