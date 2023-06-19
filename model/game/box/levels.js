import listdata from '../data/listdata.js'
/** 存档模拟 */
const UserLevel = {
  gaspractice: {
    // 经验
    experience: 0,
    // 境界
    realm: 1
  },
  bodypractice: {
    experience: 0,
    realm: 1
  },
  soul: {
    experience: 0,
    realm: 1
  }
}

class Levels {
  constructor() {
    this.LEVELMAP = {
      // 练气
      0: 'gaspractice',
      // 练体
      1: 'bodypractice',
      // 练魂
      2: 'soul'
    }
  }

  // 提升境界
  enhanceRealm(id) {
    const LevelList = listdata.controlAction({ NAME: 'fixed_levels', CHOICE: this.LEVELMAP[id] })
    let realm = UserLevel[this.LEVELMAP[id]].realm
    realm += 1
    // 境界上限了
    if (!LevelList[realm]) {
      return false
    }
    let experience = UserLevel[this.LEVELMAP[id]].experience
    /** 判断经验够不够 */
    if (experience < LevelList[realm].exp) {
      return false
    }
    // 减少境界
    UserLevel[this.LEVELMAP[id]].experience -= experience
    // 调整境界
    UserLevel[this.LEVELMAP[id]].realm = realm
    /** 保存境界信息  */
    return true
  }

  // 掉落境界
  fallingRealm(id) {
    // 读取境界
    const LevelList = listdata.controlAction({ NAME: 'fixed_levels', CHOICE: this.LEVELMAP[id] })
    let realm = UserLevel[this.LEVELMAP[id]].realm
    realm += 1
    // 已经是最低境界
    if (!LevelList[realm]) {
      return false
    }
    // 调整境界
    UserLevel[this.LEVELMAP[id]].realm = realm
    /** 保存境界信息 */
    return true
  }
}

export default new Levels()
