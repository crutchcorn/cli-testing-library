import {MatcherOptions} from './matches'
import {waitForOptions} from './wait-for'

export type WithSuggest = {suggest?: boolean}

export type GetErrorFunction<Arguments extends any[] = [string]> = (
  c: Element | null,
  ...args: Arguments
) => string

export interface SelectorMatcherOptions extends MatcherOptions {
  selector?: string
  ignore?: boolean | string
}

/**
 * query methods have a common call signature. Only the return type differs.
 */
export type QueryMethod<Arguments extends any[], Return> = (
  container: HTMLElement,
  ...args: Arguments
) => Return
export type QueryBy<Arguments extends any[]> = QueryMethod<
  Arguments,
  HTMLElement | null
>
export type GetAllBy<Arguments extends any[]> = QueryMethod<
  Arguments,
  HTMLElement[]
>
export type FindAllBy<Arguments extends any[]> = QueryMethod<
  [Arguments[0], Arguments[1]?, waitForOptions?],
  Promise<HTMLElement[]>
>
export type GetBy<Arguments extends any[]> = QueryMethod<Arguments, HTMLElement>
export type FindBy<Arguments extends any[]> = QueryMethod<
  [Arguments[0], Arguments[1]?, waitForOptions?],
  Promise<HTMLElement>
>

export type BuiltQueryMethods<Arguments extends any[]> = [
  QueryBy<Arguments>,
  GetAllBy<Arguments>,
  GetBy<Arguments>,
  FindAllBy<Arguments>,
  FindBy<Arguments>,
]

export function buildQueries<Arguments extends any[]>(
  queryAllBy: GetAllBy<Arguments>,
  getMultipleError: GetErrorFunction<Arguments>,
  getMissingError: GetErrorFunction<Arguments>,
): BuiltQueryMethods<Arguments>
