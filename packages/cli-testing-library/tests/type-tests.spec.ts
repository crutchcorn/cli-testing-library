import {fireEvent, queries, waitFor, BoundFunctions} from '../index'
import {render, TestInstance} from '../pure'
import userEvent from '../../src/user-event'

const {getByText, queryByText, findByText} = queries

export async function testQueries() {
  // instance queries
  const instance = await render('command', [])
  getByText(instance, 'foo')
  getByText(instance, 1)
  queryByText(instance, 'foo')
  await findByText(instance, 'foo')
  await findByText(instance, 'foo', undefined, {timeout: 10})
}

export function testBoundFunctions() {
  const boundfunctions = {} as BoundFunctions<{
    customQueryOne: (instance: TestInstance, text: string) => TestInstance
    customQueryTwo: (
      instance: TestInstance,
      text: string,
      text2: string,
    ) => TestInstance
    customQueryThree: (instance: TestInstance, number: number) => TestInstance
  }>

  boundfunctions.customQueryOne('one')
  boundfunctions.customQueryTwo('one', 'two')
  boundfunctions.customQueryThree(3)
}

export async function eventTest() {
  const instance = await render('command', [])

  // eslint-disable-next-line @typescript-eslint/await-thenable
  await fireEvent.sigterm(instance)

  fireEvent.write(instance, {value: 'test'})
}

export async function keyboardTest() {
  const instance = await render('command', [])

  await userEvent.keyboard(instance, 'Test')
  await instance.userEvent.keyboard('Test')
  await instance.userEvent.keyboard('Test', {delay: 0})

  fireEvent.write(instance, {value: 'test'})
}

export async function testWaitFors() {
  const instance = await render('command', [])

  await waitFor(() => getByText(instance, 'apple'))
  const result: TestInstance = await waitFor(() => getByText(instance, 'apple'))
  if (!result) {
    // Use value
    throw new Error(`Can't find result`)
  }

  await waitFor(async () => {})
}

/*
eslint
  @typescript-eslint/no-unnecessary-condition: "off",
  import/no-extraneous-dependencies: "off"
*/
