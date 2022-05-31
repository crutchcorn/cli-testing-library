const {resolve} = require('path')
const {render} = require('../pure')
const {prettyCLI} = require('../pretty-cli')

test('Should pretty print with ANSI codes properly', async () => {
  const instance = await render('node', [
    resolve(__dirname, './execute-scripts/log-output.js'),
  ])

  await instance.findByText('Hello')

  expect(prettyCLI(instance, 9000)).toMatchInlineSnapshot(`
    __disable_ansi_serialization
    [34mHello[39m World[31m![39m
  `)
})

test('Should escape ANSI codes properly when sliced too thin', async () => {
  const instance = await render('node', [
    resolve(__dirname, './execute-scripts/log-output.js'),
  ])

  await instance.findByText('Hello')

  expect(prettyCLI(instance, 30)).toMatchInlineSnapshot(`
    __disable_ansi_serialization
    [34mH[39m
  `)
})
