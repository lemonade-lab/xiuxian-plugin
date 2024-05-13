import axios, { type AxiosRequestConfig } from 'axios'
import { token } from './token'
class Axios {
  baseURL = '/api'

  server(config: AxiosRequestConfig) {
    const client = axios.create({
      baseURL: this.baseURL
    })
    return client(config)
  }

  /**
   * 用户登录
   * @param {*} data
   * @returns
   */
  async login(data) {
    return this.server({
      method: 'post',
      url: '/login',
      data
    }).then((res) => res.data)
  }

  /**
   * 用户注册
   * @param {*} data
   * @returns
   */
  async logon(data) {
    return this.server({
      method: 'post',
      url: '/logon',
      data
    }).then((res) => res.data)
  }

  /**
   * 用户列表
   */
  async list() {
    return this.server({
      url: '/player',
      method: 'GET',
      headers: {
        authorization: token.get()
      }
    }).then((res) => res.data)
  }

  /**
   * 指定用户信息
   * @returns
   */
  message(params) {
    return this.server({
      url: '/message',
      method: 'GET',
      params
    }).then((res) => res.data)
  }
}
export default new Axios()
