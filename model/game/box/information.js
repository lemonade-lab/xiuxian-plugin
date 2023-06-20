import Listdata from '../data/listdata.js'
import Talent from './talent.js'
class Information {
  /**
   * 个人信息
   * @param UID  param0
   * @returns
   */
  userDataShow(UID) {
    const equipment = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerEquipment'
    })
    const talent = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerTalent'
    })
    const LevelData = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    const SpecialData = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerSpecial'
    })
    const battle = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
    })
    let linggenName = Talent.getTalentName(talent)
    let LifeData = Listdata.controlAction({ NAME: 'life', CHOICE: 'playerLife' })
    let name = ''
    for (var i = 0; i < linggenName.length; i++) {
      name = name + linggenName[i]
    }
    let size = Math.trunc(talent.talentsize)
    if (talent.talentshow != 0) {
      size = '未知'
      name = '未知'
    } else {
      size = `+${size}%`
    }
    const LevelList = Listdata.controlAction({
      CHOICE: 'fixed_levels',
      NAME: 'gaspractice'
    })
    const LevelMaxList = Listdata.controlAction({
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
        talent,
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
  userEquipmentShow(UID) {
    const battle = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
    })
    const equipment = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerEquipment'
    })
    const LifeData = Listdata.controlAction({ NAME: 'life', CHOICE: 'playerLife' })
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
  userTalentShow(UID) {
    const talent = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerTalent'
    })
    let linggenName = Talent.getTalentName(talent)
    let LifeData = Listdata.controlAction({ NAME: 'life', CHOICE: 'playerLife' })
    let name = ''
    for (var i = 0; i < linggenName.length; i++) {
      name = name + linggenName[i]
    }
    let size = Math.trunc(talent.talentsize)
    if (talent.talentshow != 0) {
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
        skills: talent.AllSorcery,
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
  addBagThingShow(UID) {
    let LifeData = Listdata.controlAction({ NAME: 'life', CHOICE: 'playerLife' })
    const battle = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
    })
    const najie = Listdata.controlAction({ NAME: UID, CHOICE: 'playerBag' })
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

  showBattle({ UID, msgLeft, msgRight }) {
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
