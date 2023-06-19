import Listdata from '../data/listdata.js'

class Levels {
  constructor() {
    this.LEVELMAP = {
      0: 'gaspractice',
      1: 'bodypractice',
      2: 'soul'
    }
    this.NAMEMAP = {
      0: '修为',
      1: '气血',
      2: '魂力'
    }
  }

  // 提升境界
  enhanceRealm(UID, id) {
    const LevelList = Listdata.controlAction({ NAME: this.LEVELMAP[id], CHOICE: 'fixed_levels' })
    const UserLevel = Listdata.controlAction({ NAME: UID, CHOICE: 'user_level' })
    let realm = UserLevel.level[this.LEVELMAP[id]].realm
    realm += 1
    // 境界上限了
    if (!LevelList[realm]) {
      return {
        state: 4001,
        msg: null
      }
    }
    let experience = UserLevel.level[this.LEVELMAP[id]].experience
    /** 判断经验够不够 */
    if (experience < LevelList[realm].exp) {
      return {
        state: 4001,
        msg: `${this.NAMEMAP[id]}不足`
      }
    }
    // 减少境界
    UserLevel.level[this.LEVELMAP[id]].experience -= LevelList[realm].exp
    // 调整境界
    UserLevel.level[this.LEVELMAP[id]].realm = realm
    /** 保存境界信息  */
    Listdata.controlAction({ NAME: UID, CHOICE: 'user_level', DATA: UserLevel })
    return {
      state: 2000,
      msg: `境界提升至${LevelList[realm].name}`
    }
  }

  // 掉落境界
  fallingRealm(UID, id) {
    // 读取境界
    const LevelList = Listdata.controlAction({ NAME: this.LEVELMAP[id], CHOICE: 'fixed_levels' })
    const UserLevel = Listdata.controlAction({ NAME: UID, CHOICE: 'user_level' })
    let realm = UserLevel.level[this.LEVELMAP[id]].realm
    realm -= 1
    // 已经是最低境界
    if (!LevelList[realm]) {
      return {
        state: 4001,
        msg: null
      }
    }
    // 调整境界
    UserLevel.level[this.LEVELMAP[id]].realm = realm
    /** 保存境界信息 */
    Listdata.controlAction({ NAME: UID, CHOICE: 'user_level', DATA: UserLevel })
    return {
      state: 2000,
      msg: `境界跌落至${LevelList[realm].name}`
    }
  }

  /** 经验增加 */
  addExperience(UID, id, size) {
    const UserLevel = Listdata.controlAction({ NAME: UID, CHOICE: 'user_level' })
    UserLevel.level[this.LEVELMAP[id]].experience += size
    Listdata.controlAction({ NAME: UID, CHOICE: 'user_level', DATA: UserLevel })
    return {
      state: 2000,
      msg: `${this.NAMEMAP[id]}增加${size}`
    }
  }

  /* 经验减少 */
  reduceExperience(UID, id, size) {
    const UserLevel = Listdata.controlAction({ NAME: UID, CHOICE: 'user_level' })
    UserLevel.level[this.LEVELMAP[id]].experience -= size
    Listdata.controlAction({ NAME: UID, CHOICE: 'user_level', DATA: UserLevel })
    return {
      state: 2000,
      msg: `${this.NAMEMAP[id]}增加${size}`
    }
  }
}

export default new Levels()
