import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import fs from 'node:fs'
import { getUserCodeFrame } from '../src/get-user-code-frame'

vi.mock(import('fs'), async (importOriginal) => {
  const actual = await importOriginal()
  return ({
    ...actual,
    default: {
      ...actual.default,
      readFileSync: vi.fn(
        () => `
    import {screen} from '@testing-library/dom'
    it('renders', () => {
      document.body.appendChild(
        document.createTextNode('Hello world')
      )
      screen.debug()
      expect(screen.getByText('Hello world')).toBeInTheDocument()
    })
    `,
      ),
    }
  });
})

const userStackFrame = 'at somethingWrong (/sample-error/error-example.js:7:14)'

let globalErrorMock!: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  globalErrorMock = vi.spyOn(global, 'Error') as never
})

afterEach(() => {
  vi.mocked(global.Error).mockRestore()
})

test('it returns only user code frame when code frames from node_modules are first', () => {
  const stack = `Error: Kaboom
      at Object.<anonymous> (/sample-error/node_modules/@es2050/console/build/index.js:4:10)
      ${userStackFrame}
  `
  globalErrorMock.mockImplementationOnce(() => ({stack}))
  const userTrace = getUserCodeFrame()

  expect(userTrace).toMatchInlineSnapshot(`
    "/sample-error/error-example.js:7:14
    [0m [90m 5 |[39m         document[33m.[39mcreateTextNode([32m'Hello world'[39m)
     [90m 6 |[39m       )
    [31m[1m>[22m[39m[90m 7 |[39m       screen[33m.[39mdebug()
     [90m   |[39m              [31m[1m^[22m[39m[0m
    "
  `)
})

test('it returns only user code frame when node code frames are present afterwards', () => {
  const stack = `Error: Kaboom
      at Object.<anonymous> (/sample-error/node_modules/@es2050/console/build/index.js:4:10)
      ${userStackFrame}
      at Object.<anonymous> (/sample-error/error-example.js:14:1)
      at internal/main/run_main_module.js:17:47
  `
  globalErrorMock.mockImplementationOnce(() => ({stack}))
  const userTrace = getUserCodeFrame()

  expect(userTrace).toMatchInlineSnapshot(`
    "/sample-error/error-example.js:7:14
    [0m [90m 5 |[39m         document[33m.[39mcreateTextNode([32m'Hello world'[39m)
     [90m 6 |[39m       )
    [31m[1m>[22m[39m[90m 7 |[39m       screen[33m.[39mdebug()
     [90m   |[39m              [31m[1m^[22m[39m[0m
    "
  `)
})

test("it returns empty string if file from code frame can't be read", () => {
  (fs.readFileSync as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
    throw Error()
  })
  const stack = `Error: Kaboom
      ${userStackFrame}
  `
  globalErrorMock.mockImplementationOnce(() => ({stack}))

  expect(getUserCodeFrame(stack)).toEqual('')
})
