interface Window {
  // the interface that the centra checkout scripts adds to window
  CentraCheckout?: {
    suspend: () => void
    resume: () => void
    reInitiate: (plugin: string) => void
  }
}
