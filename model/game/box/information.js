import Player from './index.js'
import listdata from '../data/listdata.js'
class Information {
  /**
   * 基础信息
   * @param UID  param0
   * @returns
   */
  userDataShow(UID) {
    const player = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_player'
    })
    const equipment = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment'
    })
    const talent = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    const level = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    const battle = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const linggenname = Player.getTalentName(talent)
    let LifeData = listdata.controlAction({ NAME: 'life', CHOICE: 'user_life' })
    let name = ''
    for (var i = 0; i < linggenname.length; i++) {
      name = name + linggenname[i]
    }
    let size = Math.trunc(talent.talentsize)
    if (talent.talentshow != 0) {
      size = '未知'
      name = '未知'
    } else {
      size = `+${size}%`
    }
    return {
      path: 'user/information',
      name: 'information',
      data: {
        UID,
        life: LifeData[UID],
        player,
        level,
        linggenname: name,
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
    const battle = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const equipment = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment'
    })
    // tudo
    let LifeData = listdata.controlAction({ NAME: 'life', CHOICE: 'user_life' })
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
    const talent = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    const linggenname = Player.getTalentName(talent)
    let LifeData = listdata.controlAction({ NAME: 'life', CHOICE: 'user_life' })
    let name = ''
    for (var i = 0; i < linggenname.length; i++) {
      name = name + linggenname[i]
    }
    let size = Math.trunc(talent.talentsize)
    if (talent.talentshow != 0) {
      size = '未知'
      name = '未知'
    } else {
      size = `+${size}%`
    }
    console.log(talent)
    return {
      path: 'user/skills',
      name: 'skills',
      data: {
        UID,
        skills: talent.AllSorcery,
        linggenname: name,
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
  userBagShow(UID) {
    let LifeData = listdata.controlAction({ NAME: 'life', CHOICE: 'user_life' })
    const player = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_player'
    })
    const battle = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const najie = listdata.controlAction({ NAME: UID, CHOICE: 'user_bag' })
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
        player,
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
