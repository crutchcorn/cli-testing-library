import { test, expect } from 'vitest'
import { fuzzyMatches, matches } from '../src/matches'

// unit tests for text match utils

const node = null
const normalizer = (str: string) => str

test('matchers accept strings', () => {
  expect(matches('ABC', node, 'ABC', normalizer)).toBe(true)
  expect(fuzzyMatches('ABC', node, 'ABC', normalizer)).toBe(true)
})

test('matchers accept regex', () => {
  expect(matches('ABC', node, /ABC/, normalizer)).toBe(true)
  expect(fuzzyMatches('ABC', node, /ABC/, normalizer)).toBe(true)
})

test('matchers accept functions', () => {
  expect(matches('ABC', node, (text: string) => text === 'ABC', normalizer)).toBe(true)
  expect(fuzzyMatches('ABC', node, (text: string) => text === 'ABC', normalizer)).toBe(
    true,
  )
})

test('matchers return false if text to match is not a string', () => {
  expect(matches(null as never, node, 'ABC', normalizer)).toBe(false)
  expect(fuzzyMatches(null as never, node, 'ABC', normalizer)).toBe(false)
})

test('matchers throw on invalid matcher inputs', () => {
  expect(() =>
    matches('ABC', node, null as never, normalizer),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: It looks like null was passed instead of a matcher. Did you do something like getByText(null)?]`,
  )
  expect(() =>
    fuzzyMatches('ABC', node, undefined as never, normalizer),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: It looks like undefined was passed instead of a matcher. Did you do something like getByText(undefined)?]`,
  )
})
