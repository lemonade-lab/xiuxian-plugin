const timeObj = {}

class Place {
  getUserAction(key) {
    return timeObj[key]
  }

  setUserAction(key, val) {
    timeObj[key] = val
  }

  deleteUserAction(key) {
    delete timeObj[key]
  }
}

export default new Place()
