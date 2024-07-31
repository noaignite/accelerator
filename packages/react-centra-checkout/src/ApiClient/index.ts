class ApiClient {
  baseUrl: string;

  headers: Headers;

  options: RequestInit;

  static default: ApiClient;

  constructor(baseUrl = '', options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = options;
    this.headers = new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...this.options.headers,
    });
  }

  request = async (method: string, endpoint: string, data: Record<string, unknown> = {}) => {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      ...this.options,
      headers: this.headers,
      mode: 'cors',
      method,
      body: ['POST', 'PUT'].includes(method) ? JSON.stringify(data) : undefined,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO: fix this
    const json = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- TODO: fix this
    return json;
  };
}

// create default singleton instance
if (!('default' in ApiClient)) {
  ApiClient.default = new ApiClient();
}

export default ApiClient;
