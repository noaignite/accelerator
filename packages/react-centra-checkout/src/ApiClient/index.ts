class ApiClient {
  baseUrl: string

  static default: ApiClient

  headers: Headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  })

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
  }

  async request(method: string, endpoint: string, data: Record<string, unknown> = {}) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      headers: this.headers,
      mode: 'cors',
      method,
      body: ['POST', 'PUT'].includes(method) ? JSON.stringify(data) : undefined,
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
