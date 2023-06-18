const useraction = {}
const forwardsetTime = {}
const deliverysetTime = {}

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
}

export default new Place()
