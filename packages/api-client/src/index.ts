interface Options {
  verbose?: boolean
}

class ApiClient {
  baseUrl?: string

  static default: ApiClient

  headers: Headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  })

  // default request options
  defaultRequestOptions: RequestInit = {
    mode: 'cors',
  }

  settings: Options = {
    verbose: false,
  }

  constructor(baseUrl?: string, defaultRequestOptions?: RequestInit, settings?: Options) {
    this.baseUrl = baseUrl
    this.defaultRequestOptions = { ...this.defaultRequestOptions, ...defaultRequestOptions }
    this.settings = { ...this.settings, ...settings }

    if (this.settings.verbose) {
      console.warn(
        '@noaignite/api-client: You have enabled verbose logging, this should only be used for development!',
      )
    }
  }

  async request(
    method: string,
    endpoint: string,
    data: Record<string, unknown> = {},
    options?: RequestInit,
  ) {
    const url = new URL(endpoint, this.baseUrl)

    // if method is GET, set data as query parameters
    if (method === 'GET' && data) {
      const urlSearchParams = new URLSearchParams(data as Record<string, string>)
      url.search = `?${urlSearchParams.toString()}`
    }

    if (this.settings.verbose) {
      // eslint-disable-next-line no-console
      console.log('@noaignite/api-client: ApiClient request', url.toString(), data)
    }

    const response = await fetch(url.toString(), {
      headers: this.headers,
      method,
      body: ['POST', 'PUT'].includes(method) ? JSON.stringify(data) : undefined,
      ...this.defaultRequestOptions,
      ...options,
    })

    const json = await response.json()

    return json
  }
}

export default ApiClient
