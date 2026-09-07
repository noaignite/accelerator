declare global {
  interface Window {
    klaviyo?: {
      identify?: (payload: unknown) => void
      push?: (args: unknown[]) => void
      track?: (eventName: string, payload?: unknown) => void
    }
  }
}

// Exports this file as a module and thus `declare global` augments as expected when consuming this package.
export {}
