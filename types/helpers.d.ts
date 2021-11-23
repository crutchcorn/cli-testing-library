// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Shift<Arr extends any[]> = Arr extends [any, ...infer Q] ? Q : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ShiftArgs<Fn extends (...args: any) => any> = (...props: Shift<Parameters<Fn>>) => ReturnType<Fn>
