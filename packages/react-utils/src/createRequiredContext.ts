'use client'

import { createContext, useContext } from 'react'

/**
 * Create a `useContext` hook that requires the context to be provided.
 * Also passes the provider and consumer components.
 *
 * @example
 * ```typescript
 * const [useFoo, FooProvider] = createRequiredContext<FooContextValue>('Foo')
 * const [useBaz, BazProvider, BazConsumer] = createRequiredContext<BazContextValue>('Baz')
 * ```
 */
export function createRequiredContext<TContextProps>(contextName: string) {
  const context = createContext<null | TContextProps>(null)

  const displayName = `${contextName}Context`
  if (process.env.NODE_ENV !== 'production') {
    context.displayName = displayName
  }

  const useRequiredContext = () => {
    const contextValue = useContext(context)

    if (contextValue === null) {
      throw new Error(
        [
          `The accompanying hook created for \`${displayName}\` may only be used within the React tree of its provider.`,
          'please declare the provider at a higher level.',
        ].join(' '),
      )
    }

    return contextValue
  }

  return [useRequiredContext, context.Provider, context.Consumer] as const
}
