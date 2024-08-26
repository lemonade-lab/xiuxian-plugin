export type AssociationType = {
  id: number
  name: string
  level: number
  members: number[]
  money: number
  master: number
  notice: string
  created: number
}

class AssociationDB {
  #key: string
  constructor(key: string) {
    this.#key = key
  }

  async checkName(name: string) {
    const nameMap = await redis.get(`${this.#key}:nameMap`)
    if (!nameMap) return false
    const nameMapData = JSON.parse(nameMap) as Array<{
      name: string
      id: number
    }>
    return nameMapData.some(item => item.name === name)
  }
  async create(name: string, uid: number) {
    let length = await redis.get(`${this.#key}:length`)
    if (!length) {
      await redis.set(`${this.#key}:length`, 0)
      length = '0'
    }
    const id = parseInt(length) + 1
    const data: AssociationType = {
      id,
      name,
      money: 0,
      level: 1,
      members: [uid],
      master: uid,
      notice: '',
      created: Date.now()
    }
    await redis.incr(`${this.#key}:length`)
    const nameMap = await redis.get(`${this.#key}:nameMap`)
    let nameMapData: Array<{
      name: string
      id: number
    }> = []
    if (nameMap) {
      nameMapData = JSON.parse(nameMap) as Array<{
        name: string
        id: number
      }>
    }
    nameMapData.push({ name, id })
    await this.set(id, data)
    await redis.set(`${this.#key}:nameMap`, JSON.stringify(nameMapData))
    return data
  }

  async get(id: number): Promise<AssociationType> {
    try {
      const data = await redis.get(`${this.#key}:${id}`)
      return JSON.parse(data) as AssociationType
    } catch (e) {
      console.error('宗门数据获取失败', e)
    }
  }
  async set(id: number, data: AssociationType): Promise<void> {
    try {
      await redis.set(`${this.#key}:${id}`, JSON.stringify(data))
    } catch (e) {
      console.error('宗门数据更新失败', e)
    }
  }

  async del(id: number): Promise<void> {
    try {
      await redis.del(`${this.#key}:${id}`)
    } catch (e) {
      console.error('宗门数据删除失败', e)
    }
  }

  async list(): Promise<AssociationType[]> {
    const length = await redis.get(`${this.#key}:length`)
    if (!length) {
      return []
    }
    const keys = await redis.keys(`${this.#key}:*`)
    const data = await Promise.all(
      keys.map(async key => {
        const id = parseInt(key.split(':')[1])
        return this.get(id)
      })
    )
    return data
  }
  async getByName(name: string): Promise<AssociationType> {
    const nameMap = await redis.get(`${this.#key}:nameMap`)
    if (!nameMap) {
      return null
    }
    const id = JSON.parse(nameMap).find(item => item.name === name)?.id
    if (!id) {
      return null
    }
    return this.get(id)
  }

  async getList() {
    const names = await redis.get(`${this.#key}:nameMap`)
    if (!names) {
      return []
    }
    return JSON.parse(names)
  }
}

export const associationDB = new AssociationDB('xiuxian:association')
