import {resolve} from 'path';
import {render} from '../src/pure';
import {fireEvent} from '../src/events';
import {test, expect} from 'vitest';

test('Should render { and } in user keyboard', async () => {
  const {findByText, userEvent: userEventLocal} = await render('node', [
    resolve(__dirname, './execute-scripts/stdio-inquirer-input.js'),
  ])

  const instance = await findByText('What is your name?')
  expect(instance).toBeTruthy()

  userEventLocal.keyboard('{Hello}')

  expect(await findByText('{Hello}')).toBeTruthy()

  await fireEvent.sigterm(instance)
})
