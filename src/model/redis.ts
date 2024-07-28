import { Redis as redis } from 'yunzai'
import { SetOptions } from 'redis'

const Keys = [
  'door',
  'mining',
  'reCreate',
  'sign',
  'leaderBoard',
  'boss'
] as const

type RedisKeyEnum = (typeof Keys)[number]
class Redis {
  #baseKey = 'xiuxian@1.4'
  #message = {
    type: null,
    msg: null,
    data: null
  }
  getKey(key: RedisKeyEnum, uid: number | string) {
    return `${this.#baseKey}:${key}:${uid}`
  }

  /**
   *
   * @param key
   * @param uid
   * @returns
   */
  async get(key: RedisKeyEnum, uid: number | string) {
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
  async del(key: RedisKeyEnum, uid: number | string) {
    return redis.del(this.getKey(key, uid))
  }

  /**
   *
   * @param key
   * @param uid
   * @param msg
   * @param message
   */
  async set(
    key: RedisKeyEnum,
    uid: number | string,
    msg: string,
    message: object,
    option?: SetOptions
  ) {
    const $message = {
      ...this.#message
    }
    $message.type = key
    $message.msg = msg
    $message.data = message
    return redis.set(this.getKey(key, uid), JSON.stringify($message), option)
  }

  /**
   *
   * @param key
   * @param uid
   * @returns
   */
  async exist(key: RedisKeyEnum, uid: number | string) {
    return redis.exists(this.getKey(key, uid))
  }
  /**
   * 根据前缀删除key
   * @param key
   * @returns
   */
  async delKeysWithPrefix(key: string) {
    const list = await redis.keys(`${this.#baseKey}:${key}:*`)
    if (list.length == 0) return
    for (const i of list) {
      await redis.del(i)
    }
  }
}
export default new Redis()
