/** REDIS简单机制 */
class Redis {
  constructor() {
    this.REDIS_DATA = {}
  }

  get(key) {
    return this.REDIS_DATA[key]
  }

  set(key, val) {
    this.REDIS_DATA[key] = val
  }

  del(key) {
    delete this.REDIS_DATA[key]
  }

  delall() {
    for (let key in this.REDIS_DATA) {
      delete this.REDIS_DATA[key]
    }
  }

  val() {
    return this.REDIS_DATA
  }
}
export default new Redis()
