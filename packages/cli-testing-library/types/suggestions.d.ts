export interface QueryOptions {
  [key: string]: RegExp | boolean
}

export type QueryArgs = [string, QueryOptions?]

export interface Suggestion {
  queryName: string
  queryMethod: string
  queryArgs: QueryArgs
  variant: string
  warning?: string
  toString(): string
}

export type Variant = 'find' | 'get' | 'query'

export type Method = 'Text' | 'text'

export function getSuggestedQuery(
  element: HTMLElement,
  variant?: Variant,
  method?: Method,
): Suggestion | undefined
