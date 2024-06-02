/**
 * ****************
 * 基于JSON而设计的数据库系统
 * ****************
 */
import { existsSync, mkdirSync, promises, readFileSync, writeFile } from 'fs'
import { extname, join } from 'path'
import { UserMessageBase } from './base'

/**
 * 默认索引为 id
 *
 * 如果经常以某一值为搜索条件
 * 必须建立索引
 * 也就是关系映射
 *
 */

export class MyData<T> {
  #dir = process.cwd()

  /**
   * 数据库路径初始化
   * @param dir
   */
  constructor(dir: string) {
    const d = join(process.cwd(), dir)
    this.#dir = d
    mkdirSync(this.#dir, {
      recursive: true
    })
  }

  /**
   * 是否存在
   * @param key
   * @returns
   */
  exists(key: string) {
    const dir = join(this.#dir, `${key}.json`)
    return existsSync(dir)
  }

  /**
   * 得到所有用户数据
   */
  async findAll() {
    return new Promise((resolve, reject) => {
      promises
        .readdir(this.#dir)
        .then(async (files) => {
          const data: T[] = []
          for (const file of files) {
            const filePath = join(this.#dir, file)
            const stats = await promises.stat(filePath)
            if (stats.isFile() && extname(filePath) === '.json') {
              const d = readFileSync(filePath, 'utf-8')
              data.push(JSON.parse(d) as T)
            }
          }
          resolve(data)
        })
        .catch(reject)
    })
  }

  /**
   * 数据长度
   */
  async count() {
    let c = 0
    try {
      const files = await promises.readdir(this.#dir)
      for (const file of files) {
        const filePath = join(this.#dir, file)
        const stats = await promises.stat(filePath)
        if (stats.isFile() && extname(filePath) === '.json') {
          c++
        }
      }
      return c
    } catch (error) {
      console.error('Error:', error)
      // 返回-1表示出现错误
      return -1
    }
  }

  /**
   *
   */
  lock = new Map()

  /**
   * 读取数据
   */
  findOne(key: string): Promise<T | false> {
    return new Promise((resolve, reject) => {
      if (!this.lock.has(key)) return reject(false)
      // 锁住行为
      this.lock.set(key, Date.now)
      const dir = join(this.#dir, `${key}.json`)
      if (existsSync(dir)) {
        try {
          const data = readFileSync(dir, 'utf-8')
          this.lock.delete(key)
          resolve(JSON.parse(data) as T)
        } catch (err) {
          console.error(err)
          this.lock.delete(key)
          reject(err)
        }
      } else {
        this.lock.delete(key)
        reject(false)
      }
    })
  }

  /**
   *
   * @param key
   * @param data
   * @returns
   */
  create(key: string, data: T) {
    return new Promise((resolve, reject) => {
      if (!this.lock.has(key)) {
        reject(false)
        return
      }
      const dir = join(this.#dir, `${key}.json`)
      writeFile(dir, JSON.stringify(data), 'utf-8', (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * 更新数据的指定key
   */
  async update(key: string, data: T) {
    const d = await this.findOne(key)
    if (!d) return false
    const n = {
      ...d,
      ...data
    }
    return this.create(key, n)
  }

  //
}

export const DB = new MyData<typeof UserMessageBase>('/data')

// const d = DB.findOne('')
