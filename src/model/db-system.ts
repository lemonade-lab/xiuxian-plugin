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
    return new Promise(() => {
      //
    })
  }

  /**
   * 数据长度
   */
  async count() {
    //
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
