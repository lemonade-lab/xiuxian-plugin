import { KJUR } from 'jsrsasign'
import { ScratchTokenKey } from './localStorage'

export class Token {
  #key = ScratchTokenKey

  // 提前10分钟失效
  #base = 1000 * 60 * 10

  /**
   *
   * @returns
   */
  get() {
    return localStorage.getItem(this.#key)
  }

  /**
   *
   * @param {*} val
   */
  set(val) {
    localStorage.setItem(this.#key, val)
  }

  /**
   * 获取信息
   * @returns
   */
  getDecodedToken() {
    const token = this.get()
    if (!token) return false
    try {
      const data = KJUR.jws.JWS.parse(token)
      if (!data) return false
      return data.payloadObj as {
        id: number
        exp: number
      }
    } catch {
      return false
    }
  }

  /**
   *
   * @returns
   */
  onMessage() {
    const msg = this.getDecodedToken()
    if (!msg) return false
    return msg
  }

  /**
   *
   * @param {*} msg
   * @returns
   */
  onLoin(msg) {
    const time = msg.exp
    if (Date.now() + this.#base < time) {
      this.del()
      console.log('令牌已过期')
      return false
    }
    return true
  }

  /**
   * 登录是否过期
   * @returns
   */
  isLogin() {
    const msg = this.getDecodedToken()
    if (!msg) return false
    const time = msg.exp
    if (Date.now() + this.#base < time) {
      this.del()
      console.log('令牌已过期')
      return false
    }
    return true
  }

  /**
   * 删除登录
   */
  del() {
    localStorage.removeItem(this.#key)
  }
}
export const token = new Token()
