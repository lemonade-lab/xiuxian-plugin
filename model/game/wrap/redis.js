/** REDIS简单机制 */
const REDIS_DATA = {}
export const REDIS = {
  get: (key) => REDIS_DATA[key],
  set: (key, val) => {
    REDIS_DATA[key] = val
  },
  del: (key) => delete REDIS_DATA[key],
  delall: () => {
    for (let key in REDIS_DATA) {
      delete REDIS_DATA[key]
    }
  },
  val: () => REDIS_DATA
}
