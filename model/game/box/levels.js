import listdata from '../data/listdata.js'

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
  enhanceRealm(UID, id) {
    const LevelList = listdata.controlAction({ NAME: this.LEVELMAP[id], CHOICE: 'fixed_levels' })
    const UserLevel = listdata.controlAction({ NAME: UID, CHOICE: 'user_level' })
    let realm = UserLevel.level[this.LEVELMAP[id]].realm
    realm += 1
    // 境界上限了
    if (!LevelList[realm]) {
      return {
        state: 4001,
        smg: '已达上限'
      }
    }
    let experience = UserLevel.level[this.LEVELMAP[id]].experience
    /** 判断经验够不够 */
    if (experience < LevelList[realm].exp) {
      return {
        state: 4001,
        smg: '经验不足'
      }
    }
    // 减少境界
    UserLevel.level[this.LEVELMAP[id]].experience -= experience
    // 调整境界
    UserLevel.level[this.LEVELMAP[id]].realm = realm
    /** 保存境界信息  */
    listdata.controlAction({ NAME: UID, CHOICE: 'user_level', DATA: UserLevel })
    return {
      state: 2000,
      smg: '提升成功'
    }
  }

  // 掉落境界
  fallingRealm(UID, id) {
    // 读取境界
    const LevelList = listdata.controlAction({ NAME: this.LEVELMAP[id], CHOICE: 'fixed_levels' })
    const UserLevel = listdata.controlAction({ NAME: UID, CHOICE: 'user_level' })
    let realm = UserLevel.level[this.LEVELMAP[id]].realm
    realm -= 1
    // 已经是最低境界
    if (!LevelList[realm]) {
      return {
        state: 4001,
        smg: '已达上限'
      }
    }
    // 调整境界
    UserLevel.level[this.LEVELMAP[id]].realm = realm
    /** 保存境界信息 */
    listdata.controlAction({ NAME: UID, CHOICE: 'user_level', DATA: UserLevel })
    return {
      state: 2000,
      smg: '提升成功'
    }
  }
}

export default new Levels()
