import { UserMessageBase } from '@src/model/base'
import { Redis as redis } from 'yunzaijs'
import _ from 'lodash'

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
    return redis.exists(this.getKey(key)).then(res => res === 1)
  }

  /**
   * 得到所有用户数据
   */
  async findAll() {
    const k = `${this.#key}-list`
    const uids = await redis.get(k)
    if (!uids) {
      return []
    }
    const list = JSON.parse(uids)
    const data = await this.getDataWithIds(list)
    return data
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
        .then(res => {
          this.lock.delete(key)
          // 不存在
          if (!res) {
            // 载入uid
            this.push(key)
            resolve(this.init(key))
            return
          }
          resolve(JSON.parse(res) as T)
        })
        .catch(err => {
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
        .catch(err => {
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
    const d = _.cloneDeep(this.#init) as any
    d.uid = key
    this.create(key, d)
    return d
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

  /**
   * 批量获取玩家数据
   * @param list 玩家id列表
   * @returns
   */
  async getDataWithIds(list: Array<number | string>) {
    if (list.length === 0) return []
    if (list.length > 20) {
      const res = await Promise.all(
        list.slice(0, 20).map(async key => {
          const res = await this.findOne(key)
          if (res) return res
        })
      )
      return res.concat(await this.getDataWithIds(list.slice(20)))
    }
    return Promise.all(
      list.map(async key => {
        const res = await this.findOne(key)
        if (res) return res
      })
    )
  }

  async pushAll() {
    try {
      const key = `${this.#key}-list`
      const list = (await getKeys(`${this.#key}:*`))
        .map(e => parseInt(e))
        .filter(e => e > 10000)

      await redis.set(key, JSON.stringify(list))
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

async function getKeys(key: string): Promise<string[]> {
  const keys: string[] = []
  let cursor = 0
  while (true) {
    const reply = await redis.scan(cursor, {
      MATCH: key,
      COUNT: 1000
    })

    cursor = reply.cursor
    keys.push(...reply.keys)
    if (cursor === 0) {
      break
    }
  }
  const list = keys.map(item => item.replace(`${key.replace('*', '')}`, ''))
  return list
}

// 数据库系统
export const DB = new MyData('xiuxian:player', UserMessageBase)
