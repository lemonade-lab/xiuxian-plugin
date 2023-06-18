import config from '../data/defset.js'
import user from './index.js'
import listdata from '../data/listdata.js'
import Wrap from '../wrap/index.js'
const CopywritingLevel = {
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
const LevelMiniName = {
  0: '初期',
  1: '中期',
  2: '后期',
  3: '巅峰',
  4: '圆满'
}
class UserAction {
  /**
   * @param { UID, choise } param0
   * @returns
   */
  userLevelUp({ UID, choise }) {
    const ifexistplay = user.existUserSatus(UID)
    if (!ifexistplay) {
      return { UserLevelUpMSG: `已仙鹤` }
    }
    const player = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    let CDID = '6'
    const cf = config.getConfig({ app: 'parameter', name: 'cooling' })
    let CDTime = cf.CD.Level_up ? cf.CD.Level_up : 0
    let name = '修为'
    const Levellist = listdata.controlAction({
      CHOICE: 'generate_level',
      NAME: 'gaspractice'
    })
    const Levelmaxlist = listdata.controlAction({
      CHOICE: 'generate_level',
      NAME: 'bodypractice'
    })
    const Level = Levellist.find((item) => item.id == player.levelId)
    const LevelMax = Levelmaxlist.find((item) => item.id == player.levelmax_id)
    if (choise) {
      CDID = '7'
      CDTime = cf.CD.LevelMax_up ? cf.CD.LevelMax_up : 0
      name = '气血'
      if (player.levelmax_id >= 11) {
        return
      }
      if (player.experiencemax < LevelMax.exp) {
        return {
          UserLevelUpMSG: `再积累${LevelMax.exp - player.experiencemax}气血后方可突破`
        }
      }
    } else {
      if (player.levelId == 10) {
        return { UserLevelUpMSG: `[(#|/)渡劫]后,成就仙人镜` }
      }
      if (player.levelId >= 11) {
        /* 仙人境 */
        return
      }
      if (player.experience < Level.exp) {
        return {
          UserLevelUpMSG: `再积累${Level.exp - player.experience}修为后方可突破`
        }
      }
    }
    const nowTime = new Date().getTime()
    const { state: coolingState, msg: coolingMsg } = Wrap.cooling(UID, CDID)
    if (coolingState == 4001) {
      return { coolingMsg: `${coolingMsg}` }
    }
    Wrap.setRedis(UID, CDID, nowTime, CDTime)
    if (Math.random() >= 1 - player.levelmax_id / 22) {
      let size = ''
      if (choise) {
        size = Math.floor(Math.random() * player.experiencemax)
        player.experiencemax -= size
      } else {
        size = Math.floor(Math.random() * player.experience)
        player.experience -= size
      }
      listdata.controlAction({
        NAME: UID,
        CHOICE: 'user_level',
        DATA: player
      })
      return {
        UserLevelUpMSG: `${CopywritingLevel[
          Math.floor(Math.random() * Object.keys(CopywritingLevel).length)
        ]
          .replace(/name/g, name)
          .replace(/size/g, size)}`
      }
    }
    let returnTXT = ''
    if (choise) {
      if (player.levelmax_id > 1 && player.rankmax_id < 4) {
        player.rankmax_id = player.rankmax_id + 1
      } else {
        player.rankmax_id = 0
        player.levelmax_id = player.levelmax_id + 1
        player.levelnamemax = Levelmaxlist.find((item) => item.id == player.levelmax_id).name
      }
      player.experiencemax -= LevelMax.exp
      returnTXT = `突破成功至${player.levelnamemax}${LevelMiniName[player.rankmax_id]}`
    } else {
      if (player.levelId > 1 && player.rank_id < 4) {
        player.rank_id = player.rank_id + 1
        returnTXT = `突破成功至${player.levelname}${LevelMiniName[player.rank_id]}`
      } else {
        player.rank_id = 0
        player.levelId = player.levelId + 1
        player.levelname = Levellist.find((item) => item.id == player.levelId).name
        const { size } = this.userLifeUp({
          UID,
          levelId: player.levelId
        })
        returnTXT = `突破成功至${player.levelname}${LevelMiniName[player.rank_id]},寿命至${size}`
      }
      player.experience -= Level.exp
    }
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_level',
      DATA: player
    })
    user.readPanel({ UID })
    return {
      UserLevelUpMSG: `${returnTXT}`
    }
  }

  /**
   * @param { UID, levelId, acount } param0
   * @returns
   */
  userLifeUp({ UID, levelId, acount }) {
    let size = 0
    const life = listdata.controlAction({
      NAME: 'life',
      CHOICE: 'user_life'
    })
    life.forEach((item) => {
      if (item.qq == UID) {
        if (acount) {
          item.life += acount
        } else {
          item.life += Math.floor(levelId * 30)
        }
        size = item.life
      }
    })
    listdata.controlAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: life
    })
    return { size }
  }

  /**
   * @param {*} param0
   * @returns
   */
  levelBreak({ UID }) {
    const ifexistplay = user.existUserSatus(UID)
    if (!ifexistplay) {
      return `已仙鹤`
    }
    const UserLevel = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
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
    const player = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    const Levellist = listdata.controlAction({
      CHOICE: 'generate_level',
      NAME: 'gaspractice'
    })
    const Levelmaxlist = listdata.controlAction({
      CHOICE: 'generate_level',
      NAME: 'bodypractice'
    })
    let returnTXT = ''
    if (choise) {
      player.rankmax_id = 0
      player.levelmax_id = player.levelmax_id + 1
      player.levelnamemax = Levelmaxlist.find((item) => item.id == player.levelmax_id).name
      returnTXT = `突破成功至${player.levelnamemax}${LevelMiniName[player.rank_id]}`
    } else {
      player.rank_id = 0
      player.levelId = player.levelId + 1
      player.levelname = Levellist.find((item) => item.id == player.levelId).name
      const { size } = this.userLifeUp({
        UID,
        levelId: player.levelId
      })
      returnTXT = `突破成功至${player.levelname}${LevelMiniName[player.rank_id]},寿命至${size}`
    }
    listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_level',
      DATA: player
    })
    user.readPanel({ UID })
    return {
      UserLevelUpMSG: `${returnTXT}`
    }
  }
}
export default new UserAction()
