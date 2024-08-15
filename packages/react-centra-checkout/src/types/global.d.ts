interface Window {
  // the interface that the centra checkout scripts adds to window
  CentraCheckout?: {
    suspend: (suspendIgnore?: Record<string, unknown>) => void
    resume: (suspendIgnore?: Record<string, unknown>) => void
    reInitiate: (plugin: string) => void
  }
}

interface CentraCheckoutEventDetails {
  additionalFields?: {
    event: string
    suspendIgnore: Record<string, boolean>
  }
  [key: string]: unknown
}
