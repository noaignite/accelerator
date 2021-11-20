import unfetch from 'isomorphic-unfetch'

class ApiClient {
  token: string

  baseUrl: string

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
    this.token = ''
  }

  async request(method = 'GET', endpoint: string, data: Record<string, unknown> = {}) {
    const headers: {
      Accept: string
      'Content-Type': string
      'api-token'?: string
    } = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    if (this.token !== '') {
      headers['api-token'] = this.token
    }

    const response = await unfetch(`${this.baseUrl}/${endpoint}`, {
      headers,
      mode: 'cors',
      method,
      body: ['POST', 'PUT'].includes(method) ? JSON.stringify(data) : undefined,
    })

    const json = await response.json()

    return json
  }
}

export default ApiClient
