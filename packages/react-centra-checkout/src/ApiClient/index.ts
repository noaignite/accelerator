class ApiClient {
  baseUrl: string

  headers: Headers

  options: RequestInit

  static default: ApiClient

  constructor(baseUrl = '', options: RequestInit = {}) {
    this.baseUrl = baseUrl
    this.options = options
    this.headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...this.options.headers,
    })
  }

  request = async (method: string, endpoint: string, data: Record<string, unknown> = {}) => {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      ...this.options,
      headers: this.headers,
      mode: 'cors',
      method,
      body: ['POST', 'PUT'].includes(method) ? JSON.stringify(data) : undefined,
    })

    const json = (await response.json()) as unknown

    return json
  }
}

// create default singleton instance
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- TODO: Fix this
if (!ApiClient.default) {
  ApiClient.default = new ApiClient()
}

export default ApiClient
