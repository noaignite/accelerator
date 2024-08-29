'use client'

import { createContext, useContext, type ReactNode } from 'react'

/**
 * Create a `useContext` hook where its returned value will always be its
 * intended type. Using the hook outside of its provider tree will result in
 * an error being thrown.
 *
 * @example
 * ```typescript
 * const [useFoo, FooProvider] = createRequiredContext<FooContextValue>('Foo')
 * const [useBaz, BazProvider, BazConsumer] = createRequiredContext<BazContextValue>('Baz')
 * ```
 */
export function createRequiredContext<TContextValue>(contextName: string) {
  const context = createContext<null | TContextValue>(null)

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

  // NOTE: Wrap component for it to be included in the "React Client Manifesto".
  function Provider(props: { children: ReactNode; value: TContextValue }) {
    return <context.Provider {...props} />
  }

  // NOTE: Wrap component for it to be included in the "React Client Manifesto".
  function Consumer(props: { children: (context: TContextValue | null) => ReactNode }) {
    return <context.Consumer {...props} />
  }

  return [useRequiredContext, Provider, Consumer] as const
}
