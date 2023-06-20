import user from './index.js'
import Listdata from '../data/listdata.js'
import Wrap from '../wrap/index.js'
class UserAction {
  constructor() {
    this.CopywritingLevel = {
      0: '突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美!险些走火入魔,丧失了size[name]',
      1: '突破瓶颈时想到鸡哥了,险些走火入魔,丧失了size[name]',
      2: '突破瓶颈时突然想起后花园种有药草,强行打断突破,嘴角流血,丧失了size[name]',
      3: '突破失败,丧失了size[name]',
      4: '突破失败,你刚刚气沉丹田就被一口老痰差点噎死,丧失了size[name]',
      5: '噗～你一口老血喷了出,突破失败,丧失了size[name]',
      6: '砰!你突破时身后的柜子动了一下,吓得你一时不敢突破并丧失了size[name]',
      7: '突破失败,你也不知道为啥,并且丧失了size[name]',
      8: '突破失败,可能是因为姿势不对吧,你尝试换了个姿势,发现丧失了size[name]',
      9: '突破失败,你差一点就成功了,你决定再试一次,可惜刚入定就被反噬,丧失了size[name]',
      10: '突破失败,你到瓶颈期,却因为今天是KFC疯狂星期四,决定不突破了去吃了KFC,回来直接变身喷射战士,并丧失了size[name]'
    }
    this.LevelMiniName = {
      0: '初期',
      1: '中期',
      2: '后期',
      3: '巅峰',
      4: '圆满'
    }
  }

  /**
   * @param { UID, levelId, acount } param0
   * @returns
   */
  userLifeUp({ UID, levelId, acount }) {
    const LifeDAta = Listdata.controlAction({
      NAME: 'life',
      CHOICE: 'playerLife'
    })
    if (acount) {
      LifeDAta[UID].life += acount
    } else {
      LifeDAta[UID].life += Math.floor(levelId * 30)
    }
    const size = LifeDAta[UID].life
    Listdata.controlAction({
      NAME: 'life',
      CHOICE: 'playerLife',
      DATA: LifeDAta
    })
    return { size }
  }

  /**
   * @param {*} param0
   * @returns
   */
  levelBreak(UID) {
    const ifexistplay = user.getUserLifeSatus(UID)
    if (!ifexistplay) {
      return `已仙鹤`
    }
    const UserLevel = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    if (UserLevel.levelId != 10) {
      /* 不是渡劫 */
      return `非渡劫期`
    }
    let CDID = '13'
    let CDTime = 360
    const nowTime = new Date().getTime()
    const { state: coolingState, msg: coolingMsg } = Wrap.cooling(UID, CDID)
    if (coolingState == 4001) {
      return `${coolingMsg}`
    }
    Wrap.setRedis(UID, CDID, nowTime, CDTime)
  }

  breakLevelUp = ({ UID, choise }) => {
    const GP = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    const Levellist = Listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'gaspractice'
    })
    const Levelmaxlist = Listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'bodypractice'
    })
    let returnTXT = ''
    if (choise) {
      GP.rankMaxId = 0
      GP.levelMaxId = GP.levelMaxId + 1
      GP.levelnamemax = Levelmaxlist[GP.levelMaxId].name
      returnTXT = `突破成功至${GP.levelnamemax}${this.LevelMiniName[GP.rankId]}`
    } else {
      GP.rankId = 0
      GP.levelId = GP.levelId + 1
      GP.levelname = Levellist[GP.levelId].name
      const { size } = this.userLifeUp({
        UID,
        levelId: GP.levelId
      })
      returnTXT = `突破成功至${GP.levelname}${this.LevelMiniName[GP.rankId]},寿命至${size}`
    }
    Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel',
      DATA: GP
    })
    user.updatePanel(UID)
    return {
      UserLevelUpMSG: `${returnTXT}`
    }
  }
}
export default new UserAction()
