# [WIP] CLI Testing Library

Usage example:

```javascript
const {resolve} = require('path')
const {render, fireEvent} = require('cli-testing-library')

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
```