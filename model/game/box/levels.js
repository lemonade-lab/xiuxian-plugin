import Defset from '../data/defset.js'
import Data from '../data/index.js'
import Burial from '../wrap/burial.js'

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
    this.CopywritingLevel = {
      0: '突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美!险些走火入魔,丧失了size[name]',
      1: '突破时想到鸡哥了,险些走火入魔,丧失了size[name]',
      2: '突破时突然想起后花园种有药草,强行打断突破,嘴角流血,丧失了size[name]',
      3: '突破失败,丧失了size[name]',
      4: '突破失败,你刚刚气沉丹田就被一口老痰差点噎死,丧失了size[name]',
      5: '噗～你一口老血喷了出,突破失败,丧失了size[name]',
      6: '砰!你突破时身后的柜子动了一下,吓得你一时不敢突破并丧失了size[name]',
      7: '突破失败,你也不知道为啥,并且丧失了size[name]',
      8: '突破失败,可能是因为姿势不对吧,你尝试换了个姿势,发现丧失了size[name]',
      9: '突破失败,你差一点就成功了,你决定再试一次,可惜刚入定就被反噬,丧失了size[name]',
      10: '突破失败,因为今天是KFC疯狂星期四,决定不突破了去吃了KFC,回来直接变身喷射战士,并丧失了size[name]'
    }
    this.LevelMiniName = {
      0: '初期',
      1: '中期',
      2: '后期',
      3: '巅峰',
      4: '圆满'
    }
    this.CdMap = {
      6: 'Level_up',
      7: 'LevelMax_up'
    }
  }

  /**
   * @param {*} id
   * @param {*} DATA
   */
  write(UID, DATA) {
    Data.controlAction({
      CHOICE: 'playerLevel',
      NAME: UID,
      DATA
    })
  }

  /**
   * @param {*} id
   * @returns
   */
  read(UID) {
    return Data.controlAction({
      CHOICE: 'playerLevel',
      NAME: UID
    })
  }

  /**
   * 随机一个失败文案
   */

  getCopywriting(id, randomKey, size) {
    const name = this.NAMEMAP[id]
    const copywriting = this.CopywritingLevel[randomKey]
    const result = copywriting.replace('size[name]', `${size}[${name}]`)
    return result
  }

  /**
   * 设置突破冷却
   * @param {} UID
   * @param {*} CDID
   */
  setSpecial(UID, CDID) {
    const nowTime = new Date().getTime()
    const cf = Defset.getConfig({ name: 'cooling' })
    const CDTime = cf.CD[this.CdMap[CDID]] ? cf.CD[this.CdMap[CDID]] : 5
    Burial.set(UID, CDID, nowTime, CDTime)
  }

  /**
   * 得到境界
   * @param {*} UID
   * @param {*} id
   * @returns
   */
  getMsg(UID, id) {
    const UserLevel = Data.controlAction({ NAME: UID, CHOICE: 'playerLevel' })
    return UserLevel[this.LEVELMAP[id]]
  }

  // 提升境界
  enhanceRealm(UID, id) {
    const LevelList = Data.controlAction({ NAME: this.LEVELMAP[id], CHOICE: 'fixed_levels' })
    const UserLevel = Data.controlAction({ NAME: UID, CHOICE: 'playerLevel' })
    let realm = UserLevel[this.LEVELMAP[id]].realm
    realm += 1
    // 境界上限了
    if (!LevelList[realm]) {
      return {
        state: 4001,
        msg: null
      }
    }
    let experience = UserLevel[this.LEVELMAP[id]].experience
    /** 判断经验够不够 */
    if (experience < LevelList[realm].exp) {
      return {
        state: 4001,
        msg: `${this.NAMEMAP[id]}不足`
      }
    }
    // 减少境界
    UserLevel[this.LEVELMAP[id]].experience -= LevelList[realm].exp
    // 调整境界
    UserLevel[this.LEVELMAP[id]].realm = realm
    /** 保存境界信息  */
    Data.controlAction({ NAME: UID, CHOICE: 'playerLevel', DATA: UserLevel })
    return {
      state: 2000,
      msg: `境界提升至${LevelList[realm].name}`
    }
  }

  // 掉落境界
  fallingRealm(UID, id) {
    // 读取境界
    const LevelList = Data.controlAction({ NAME: this.LEVELMAP[id], CHOICE: 'fixed_levels' })
    const UserLevel = Data.controlAction({ NAME: UID, CHOICE: 'playerLevel' })
    let realm = UserLevel[this.LEVELMAP[id]].realm
    realm -= 1
    // 已经是最低境界
    if (!LevelList[realm]) {
      return {
        state: 4001,
        msg: null
      }
    }
    // 调整境界
    UserLevel[this.LEVELMAP[id]].realm = realm
    /** 保存境界信息 */
    Data.controlAction({ NAME: UID, CHOICE: 'playerLevel', DATA: UserLevel })
    return {
      state: 2000,
      msg: `境界跌落至${LevelList[realm].name}`
    }
  }

  /** 经验增加 */
  addExperience(UID, id, size) {
    const UserLevel = Data.controlAction({ NAME: UID, CHOICE: 'playerLevel' })
    UserLevel[this.LEVELMAP[id]].experience += size
    Data.controlAction({ NAME: UID, CHOICE: 'playerLevel', DATA: UserLevel })
    return {
      state: 2000,
      msg: `${this.NAMEMAP[id]}增加${size}`
    }
  }

  /* 经验减少 */
  reduceExperience(UID, id, size) {
    const UserLevel = Data.controlAction({ NAME: UID, CHOICE: 'playerLevel' })
    UserLevel[this.LEVELMAP[id]].experience -= size
    Data.controlAction({ NAME: UID, CHOICE: 'playerLevel', DATA: UserLevel })
    return {
      state: 2000,
      msg: `${this.NAMEMAP[id]}增加${size}`
    }
  }
}

export default new Levels()
