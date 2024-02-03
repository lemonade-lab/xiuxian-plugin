class REDIS {
  name = 'xiuxian@1.4.0'
  /**
   * 设置冷却
   * @param user_id
   */
  set(user_id: string, key: string) {
    return redis.set(this.name + ':' + user_id + ':' + key, 1)
  }
  /**
   * 得到冷却
   * @param user_id
   * @param key
   * @returns
   */
  get(user_id: string, key: string) {
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
}
/**
 * 封装好theredis
 */
export const Redis = new REDIS()
