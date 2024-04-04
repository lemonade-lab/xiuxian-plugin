const Keys = ['biguan'] as const
type RedisKeyEnum = (typeof Keys)[number]
class Redis {
  baseKey = 'xiuxian@1.4'
  message = {
    type: null,
    msg: null,
    data: null
  }

  /**
   *
   * @param key
   * @param uid
   * @returns
   */
  async get(key: RedisKeyEnum, uid: number) {
    const data = await redis.get(`${this.baseKey}:${key}:${uid}`)
    if (!data) {
      return this.message
    }
    try {
      const message = JSON.parse(data)
      return message
    } catch {
      return this.message
    }
  }

  /**
   *
   * @param key
   * @param uid
   */
  del(key: RedisKeyEnum, uid: number) {
    redis.del(`${this.baseKey}:${key}:${uid}`)
  }

  /**
   *
   * @param key
   * @param uid
   * @param msg
   * @param message
   */
  set(key: RedisKeyEnum, uid: number, msg: string, message: Object) {
    this.message.type = key
    this.message.msg = msg
    this.message.data = message
    redis.set(`${this.baseKey}:${key}:${uid}`, JSON.stringify(this.message))
  }
}
export default new Redis()
