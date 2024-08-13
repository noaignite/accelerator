class ApiClient {
  baseUrl: string

  headers: Headers

  options: RequestInit

  private static _default?: ApiClient

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

    const json = await response.json()

    return json
  }

  public static get default(): ApiClient {
    if (!ApiClient._default) {
      ApiClient._default = new ApiClient()
    }

    return ApiClient._default
  }

  public get default(): ApiClient {
    return ApiClient.default
  }
}

export default ApiClient
