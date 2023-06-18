const useraction = {}
const forwardsetTime = {}
const deliverysetTime = {}

const levelaction = []

class Place {
  getUserAction(key) {
    return useraction[key]
  }

  setUserAction(key, val) {
    useraction[key] = val
  }

  deleteUserAction(key) {
    delete useraction[key]
  }

  getUserTime(key) {
    return forwardsetTime[key]
  }

  setUserTime(key, val) {
    forwardsetTime[key] = val
  }

  deleteUserTime(key) {
    delete forwardsetTime[key]
  }

  getUserDelivery(key) {
    return deliverysetTime[key]
  }

  setUserDelivery(key, val) {
    deliverysetTime[key] = val
  }

  deleteUserDelivery(key) {
    delete deliverysetTime[key]
  }

  getUserLevel(key) {
    return levelaction[key]
  }

  setUserLevel(key, val) {
    levelaction[key] = val
  }

  deleteUserLevel(key) {
    delete levelaction[key]
  }
}

export default new Place()

/**
 * 行为统计
 *
 * 闭关 出关  降妖
 * 前往 传送
 * 渡劫
 */

/**
 * 走路行为定时任务都算作行为数据
 * 因此所有的定时行为数据都需要存储起来
 */
