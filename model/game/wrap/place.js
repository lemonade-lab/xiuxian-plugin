class Place {
  constructor() {
    this.timeObj = {}
  }

  getUserAction(key) {
    return this.timeObj[key]
  }

  setUserAction(key, val) {
    this.timeObj[key] = val
  }

  deleteUserAction(key) {
    delete this.timeObj[key]
  }
}
export default new Place()
