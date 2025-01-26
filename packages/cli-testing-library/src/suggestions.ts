import { getDefaultNormalizer } from "./matches";
import type { TestInstance } from "./types";

export interface QueryOptions {
  [key: string]: RegExp | boolean;
}

export type QueryArgs = [string, QueryOptions?];

export interface Suggestion {
  queryName: string;
  queryMethod: string;
  queryArgs: QueryArgs;
  variant: string;
  warning?: string;
  toString: () => string;
}

export type Variant = "find" | "get" | "query";

export type Method = "Text" | "text";

const normalize = getDefaultNormalizer();

function escapeRegExp(string: string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function getRegExpMatcher(string: string) {
  return new RegExp(escapeRegExp(string.toLowerCase()), "i");
}

function makeSuggestion(
  queryName: string,
  _instance: TestInstance,
  content: string,
  {
    variant,
    name,
  }: {
    variant: Variant;
    name?: string;
  },
): Suggestion | undefined {
  const warning = "";
  const queryOptions = {} as QueryOptions;
  const queryArgs = [
    [].includes(queryName as never) ? content : getRegExpMatcher(content),
  ] as QueryArgs;

  if (name) {
    queryOptions.name = getRegExpMatcher(name);
  }

  if (Object.keys(queryOptions).length > 0) {
    queryArgs.push(queryOptions);
  }

  const queryMethod = `${variant}By${queryName}`;

  return {
    queryName,
    queryMethod,
    queryArgs,
    variant,
    warning,
    toString() {
      if (warning) {
        console.warn(warning);
      }
      const [text, options] = queryArgs;

      const newText = typeof text === "string" ? `'${text}'` : text;

      const newOptions = options
        ? `, { ${Object.entries(options)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")} }`
        : "";

      return `${queryMethod}(${newText}${newOptions})`;
    },
  };
}

function canSuggest(
  currentMethod: Method,
  requestedMethod: Method | undefined,
  data: unknown,
) {
  return (
    data &&
    (!requestedMethod ||
      requestedMethod.toLowerCase() === currentMethod.toLowerCase())
  );
}

export function getSuggestedQuery(
  instance: TestInstance,
  variant: Variant = "get",
  method?: Method,
): Suggestion | undefined {
  const textContent = normalize(
    instance.stdoutArr.map((obj) => obj.contents).join("\n"),
  );
  if (canSuggest("Text", method, textContent)) {
    return makeSuggestion("Text", instance, textContent, { variant });
  }

  return undefined;
}
