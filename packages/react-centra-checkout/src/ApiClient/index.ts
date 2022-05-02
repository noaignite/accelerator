class ApiClient {
  baseUrl: string

  options: RequestInit

  static default: ApiClient

  headers: Headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  })

  constructor(baseUrl = '', options: RequestInit = {}) {
    this.baseUrl = baseUrl
    this.options = options
  }

  async request(method: string, endpoint: string, data: Record<string, unknown> = {}) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      headers: this.headers,
      mode: 'cors',
      method,
      body: ['POST', 'PUT'].includes(method) ? JSON.stringify(data) : undefined,
      ...this.options,
    })

    const json = await response.json()

    return json
  }
}

// create default singleton instance
if (!ApiClient.default) {
  ApiClient.default = new ApiClient()
}

export default ApiClient
