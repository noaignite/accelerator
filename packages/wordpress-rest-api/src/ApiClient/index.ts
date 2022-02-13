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

  async getPages(data: Record<string, unknown> = {}) {
    const response = await this.request('GET', '/wp/v2/pages', data)
    return response
  }

  async getPosts(data: Record<string, unknown> = {}) {
    const response = await this.request('GET', '/wp/v2/post', data)
    return response
  }
}

// create default singleton instance
if (!ApiClient.default) {
  ApiClient.default = new ApiClient()
}

export default ApiClient
