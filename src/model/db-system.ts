import { UserMessageBase } from './base'

export class MyData<T> {
  #key = 'xiuxian'

  #init: T = null

  /**
   *
   */
  lock = new Map()

  /**
   * 数据库路径初始化
   * @param dir
   */
  constructor(key: string, init: T) {
    this.#key = key
    this.#init = init
  }

  /**
   * 推送用户
   * @param key
   */
  async push(key: string | number) {
    const k = `${this.#key}-list`
    const uids = await redis.get(k)
    // 不存在
    if (!uids) {
      redis.set(k, JSON.stringify([key]))
    } else {
      const data = JSON.parse(uids) as (string | number)[]
      if (!data.includes) {
        data.push(key)
        redis.set(k, JSON.stringify(data))
      }
    }
  }

  /**
   *
   * @param key
   */
  getKey(key: string | number) {
    return `${this.#key}:${key}`
  }

  /**
   * 是否存在指定数据
   * @param key
   * @returns
   */
  async exists(key: string | number) {
    return redis.exists(this.getKey(key)).then((res) => res === 1)
  }

  /**
   * 得到所有用户数据
   */
  async findAll() {
    return new Promise((resolve, reject) => {
      const k = `${this.#key}-list`
      redis
        .get(k)
        .then(async (uids) => {
          if (!uids) {
            // 无数据
            resolve([])
          } else {
            // 收集数据
            const data = []
            for (const key of uids) {
              await this.findOne(key)
                .then((res) => {
                  if (res) data.push(data)
                })
                .catch(console.error)
            }
            resolve(data)
          }
        })
        .catch(reject)
    })
  }

  /**
   * 玩家量
   * @returns
   */
  async count() {
    const k = `${this.#key}-list`
    const uids = await redis.get(k)
    if (!uids) {
      return 0
    } else {
      const data = JSON.parse(uids) as (string | number)[]
      return data.length
    }
  }

  /**
   * 查找数据
   * @param key
   * @returns
   */
  findOne(key: string | number): Promise<T | false> {
    return new Promise((resolve, reject) => {
      if (this.lock.has(key)) {
        reject(false)
        return
      }
      // 锁住行为
      this.lock.set(key, Date.now)
      // for in 存储
      redis
        .get(this.getKey(key))
        .then((res) => {
          this.lock.delete(key)
          // 不存在
          if (!res) {
            // 载入uid
            this.push(key)
            resolve(this.#init)
            return
          }
          resolve(JSON.parse(res) as T)
        })
        .catch((err) => {
          this.lock.delete(key)
          console.error(err)
          reject(false)
        })
    })
  }

  /**
   * 创建数据
   * @param key
   * @param data
   * @returns
   */
  create(key: string | number, data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.lock.has(key)) {
        reject(false)
        return
      }
      // 锁住行为
      this.lock.set(key, Date.now)

      // for in 读取

      // 开始写入数据
      redis
        .set(this.getKey(key), JSON.stringify(data))
        .then(() => {
          this.lock.delete(key)
          resolve(true)
        })
        .catch((err) => {
          this.lock.delete(key)
          console.error(err)
          reject(false)
        })
    })
  }

  /**
   * 初始化数据
   * @param key
   * @returns
   */
  init(key: string | number) {
    return this.create(this.getKey(key), this.#init)
  }

  /**
   * 更新数据
   * @param key
   * @param data
   * @returns
   */
  async update(key: string | number, data: T) {
    const d = await this.findOne(this.getKey(key))
    if (!d) return false
    return this.create(this.getKey(key), {
      ...d,
      ...data
    })
  }

  //
}

// 数据库系统
export const DB = new MyData('xiuxian:player', UserMessageBase)
