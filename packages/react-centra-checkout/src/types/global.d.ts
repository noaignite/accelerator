interface Window {
  // the interface that the centra checkout scripts adds to window
  CentraCheckout?: {
    suspend: () => void
    resume: () => void
    reInitiate: (plugin: string) => void
  }
}

interface GlobalEventHandlersEventMap {
  centra_checkout_callback: CustomEvent<Record<string, unknown> | undefined>
}
