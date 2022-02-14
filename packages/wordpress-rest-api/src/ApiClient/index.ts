import ApiClient from '@noaignite/api-client'

class WpClient extends ApiClient {
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
if (!WpClient.default) {
  WpClient.default = new WpClient()
}

export default WpClient
