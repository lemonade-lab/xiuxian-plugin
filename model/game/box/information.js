import Data from '../data/index.js'
import Talent from './talent.js'
class Information {
  /**
   * 个人信息
   * @param UID  param0
   * @returns
   */
  showUserPlayer(UID) {
    const equipment = Data.controlAction({
      NAME: UID,
      CHOICE: 'playerEquipment'
    })
    const TalentData = Data.controlAction({
      NAME: UID,
      CHOICE: 'playerTalent'
    })
    const LevelData = Data.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    const SpecialData = Data.controlAction({
      NAME: UID,
      CHOICE: 'playerSpecial'
    })
    const battle = Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
    })
    let linggenName = Talent.getTalentName(TalentData.talent)
    let LifeData = Data.controlAction({ NAME: 'life', CHOICE: 'playerLife' })
    let name = linggenName
    let size = Math.trunc(TalentData.talentsize)
    if (TalentData.talentshow != 0) {
      size = '未知'
      name = '未知'
    } else {
      size = `+${size}%`
    }
    const LevelList = Data.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'gaspractice'
    })
    const LevelMaxList = Data.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'bodypractice'
    })
    return {
      path: 'user/information',
      name: 'information',
      data: {
        UID,
        life: LifeData[UID],
        GP: {},
        level: {
          ...SpecialData,
          levelname: LevelList[LevelData.gaspractice.realm].name, // 练气名
          experience: LevelData.gaspractice.experience, // 练气经验
          levelnamemax: LevelMaxList[LevelData.bodypractice.realm].name, // 练体名
          experiencemax: LevelData.bodypractice.experience // 练体经验
        },
        linggenName: name,
        battle,
        equipment,
        talent: TalentData,
        talentsize: size,
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }

  /**
   * 装备信息
   * @param {*} param0
   * @returns
   */
  showUserEquipment(UID) {
    const battle = Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
    })
    const equipment = Data.controlAction({
      NAME: UID,
      CHOICE: 'playerEquipment'
    })
    const LifeData = Data.controlAction({ NAME: 'life', CHOICE: 'playerLife' })
    return {
      path: 'user/equipment',
      name: 'equipment',
      data: {
        UID,
        battle,
        life: LifeData[UID],
        equipment,
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }

  /**
   * 功法信息
   */
  showUserTalent(UID) {
    const TalentData = Data.controlAction({
      NAME: UID,
      CHOICE: 'playerTalent'
    })
    let linggenName = Talent.getTalentName(TalentData.talent)
    let LifeData = Data.controlAction({ NAME: 'life', CHOICE: 'playerLife' })
    let name = linggenName
    let size = Math.trunc(TalentData.talentsize)
    if (TalentData.talentshow != 0) {
      size = '未知'
      name = '未知'
    } else {
      size = `+${size}%`
    }
    return {
      path: 'user/skills',
      name: 'skills',
      data: {
        UID,
        skills: TalentData.AllSorcery,
        linggenName: name,
        talentsize: size,
        life: LifeData[UID],
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }

  /**
   * 背包
   * @returns
   */
  showUserBag(UID) {
    let LifeData = Data.controlAction({ NAME: 'life', CHOICE: 'playerLife' })
    const battle = Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
    })
    const najie = Data.controlAction({ NAME: UID, CHOICE: 'playerBag' })
    const thing = najie.thing
    const thingList = []
    const danyaoList = []
    const daojuList = []
    thing.forEach((item) => {
      let id = item.id.split('-')
      switch (id[0]) {
        case '4': {
          danyaoList.push(item)
          break
        }
        case '6': {
          daojuList.push(item)
          break
        }
        default: {
          thingList.push(item)
          break
        }
      }
    })
    return {
      path: 'user/bag',
      name: 'bag',
      data: {
        UID,
        GP: {},
        life: LifeData[UID],
        battle,
        najie,
        thing: thingList,
        daojuList,
        danyaoList,
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }

  /**
   * 战斗信息
   */

  showUserBattle({ UID, msgLeft, msgRight }) {
    return {
      path: 'battle',
      name: 'battle',
      data: {
        UID,
        msgLeft,
        msgRight,
        user_avatar: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${UID}`
      }
    }
  }
}
export default new Information()
