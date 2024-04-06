export class Token {
  #key = 'xiuxian-token-1'

  // 提前10分钟失效
  #base = 1000 * 60 * 10

  token = null

  message = null

  /**
   * 切换key
   * @param {} val
   */
  key(val) {
    this.#key = val
  }

  get() {
    return localStorage.getItem(this.#key)
  }

  /**
   *
   * @param val
   */
  set(val: string) {
    localStorage.setItem(this.#key, val)
  }

  /**
   * 获取信息
   * @returns
   */
  getMessage() {
    return this.getDecodedToken()
  }

  /**
   * 获取信息
   * @returns
   */
  getDecodedToken() {
    if (this.message) return this.message
    const token = this.get()
    if (!token) return
    const data = token.split('.')[1]
    if (!data) return
    const de = atob(data)
    this.token = token
    const message = JSON.parse(de)
    this.message = message
    return message
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
    this.message = null
    this.token = null
    localStorage.removeItem(this.#key)
  }
}
export const token = new Token()
