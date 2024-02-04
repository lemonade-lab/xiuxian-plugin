// redis json key
type JsonKeyType = 'action'

// redis key
type KeyType = 'game_action' | JsonKeyType

class REDIS {
  name = 'xiuxian@1.4.0'

  /**
   * 设置冷却
   * @param user_id
   * @param key
   * @returns
   */
  set(user_id: string, key: KeyType, val: string) {
    return redis.set(this.name + ':' + user_id + ':' + key, val)
  }
  /**
   * 得到冷却
   * @param user_id
   * @param key
   * @returns
   */
  get(user_id: string, key: KeyType) {
    return redis.get(this.name + ':' + user_id + ':' + key)
  }

  /**
   * 删除
   * @param user_id
   * @param key
   * @returns
   */
  del(user_id: string, key: string) {
    return redis.del(this.name + ':' + user_id + ':' + key)
  }

  /**
   * 设置json数据
   * @param user_id
   * @param key
   * @param val
   * @returns
   */
  async setJSON(user_id: string, key: JsonKeyType, val) {
    return this.set(user_id, key, JSON.stringify(val))
  }

  /**
   * 读取json数据
   * @param user_id
   * @param key
   * @returns
   */
  async getJSON(user_id: string, key: JsonKeyType) {
    return JSON.parse(await this.get(user_id, key))
  }
}
/**
 * App Redis
 */
export const Redis = new REDIS()
