/**
 * Shorthand for correctly expressing any function.
 *
 * @example
 * ```tsx
 * const execute = (func: AnyFunction) => { ... }
 *
 * const func1 = () => { ... }
 * const func2 = (arg: string) => { ... }
 *
 * execute(func1) // OK
 * execute(func2) // OK
 * ```
 */
export type AnyFunction = (...args: any[]) => any
