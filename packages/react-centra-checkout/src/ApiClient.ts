export class ApiClient {
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

  async request(method: string, endpoint: string, data: Record<string, unknown> = {}) {
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

  public static get default(): ApiClient {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- TODO: Remove rule disable when appropriate
    if (!ApiClient._default) {
      ApiClient._default = new ApiClient()
    }

    return ApiClient._default
  }

  public get default(): ApiClient {
    // This getter method exist to gain access to the static singleton from all instances of `ApiClient`.
    return ApiClient.default
  }
}
