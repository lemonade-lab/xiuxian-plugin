const Keys = ['door', 'mining'] as const
type RedisKeyEnum = (typeof Keys)[number]
class Redis {
  baseKey = 'xiuxian@1.4'

  #message = {
    type: null,
    msg: null,
    data: null
  }

  getKey(key: RedisKeyEnum, uid: number) {
    return `${this.baseKey}:${key}:${uid}`
  }

  /**
   *
   * @param key
   * @param uid
   * @returns
   */
  async get(key: RedisKeyEnum, uid: number) {
    const data = await redis.get(this.getKey(key, uid))
    if (!data) return this.#message
    try {
      return JSON.parse(data)
    } catch {
      return this.#message
    }
  }

  /**
   *
   * @param key
   * @param uid
   */
  async del(key: RedisKeyEnum, uid: number) {
    return redis.del(this.getKey(key, uid))
  }

  /**
   *
   * @param key
   * @param uid
   * @param msg
   * @param message
   */
  async set(key: RedisKeyEnum, uid: number, msg: string, message: Object) {
    const $message = {
      ...this.#message
    }
    $message.type = key
    $message.msg = msg
    $message.data = message
    return redis.set(this.getKey(key, uid), JSON.stringify($message))
  }
}
export default new Redis()
