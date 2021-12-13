import '../src/extend-expect';
import {configure, getConfig} from "../src/config";
import hasAnsi from 'has-ansi';
import stripAnsi from 'strip-ansi';

/**
 * We have instances where we need to disable this serializer to test for ANSI codes
 * @see jest-snapshot-serializer-ansi
 */
expect.addSnapshotSerializer({
  test: value => typeof value === 'string' && !value.includes("__disable_ansi_serialization") && hasAnsi(value),
  print: (value, serialize) => serialize(stripAnsi(value)),
});

// add serializer for MutationRecord
expect.addSnapshotSerializer({
  print: (record, serialize) => {
    return serialize({
      addedNodes: record.addedNodes,
      attributeName: record.attributeName,
      attributeNamespace: record.attributeNamespace,
      nextSibling: record.nextSibling,
      oldValue: record.oldValue,
      previousSibling: record.previousSibling,
      removedNodes: record.removedNodes,
      target: record.target,
      type: record.type,
    })
  },
  test: value => {
    // list of records will stringify to the same value
    return (
      Array.isArray(value) === false &&
      String(value) === '[object MutationRecord]'
    )
  },
})

beforeAll(() => {
  const originalWarn = console.warn
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    if (args[0] && args[0].includes && args[0].includes('deprecated')) {
      return
    }
    originalWarn(...args)
  })
})

afterEach(async () => {
  if (jest.isMockFunction(global.setTimeout)) {
    jest.useRealTimers()
  }
})

afterAll(() => {
  jest.restoreAllMocks()
})

jest.setTimeout(20000)

let originalConfig
beforeAll(() => {
  originalConfig = getConfig()
  configure({asyncUtilTimeout: 15000, renderAwaitTime: 800})
})

afterAll(() => {
  configure(originalConfig)
})
