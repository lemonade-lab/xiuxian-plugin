import axios, { type AxiosRequestConfig } from 'axios'
class Axios {
  baseURL = '/api'

  server(config: AxiosRequestConfig) {
    const client = axios.create({
      baseURL: this.baseURL
    })
    return client(config)
  }

  /**
   * 用户列表
   */
  list() {
    return this.server({
      url: '/player',
      method: 'GET'
    }).then((res) => res.data)
  }
}
export default new Axios()
