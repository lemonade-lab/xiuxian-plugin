import gameUser from './index.js'
import listdata from '../data/listdata.js'
class information {
  /**
   * 基础信息
   * @param { UID } param0
   * @returns
   */
  userDataShow = async ({ UID }) => {
    const player = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_player'
    })
    const equipment = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_equipment'
    })
    const talent = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    const level = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    const battle = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const linggenname = await gameUser.getTalentName({ data: talent })
    let life = await listdata.listAction({ NAME: 'life', CHOICE: 'user_life' })
    life = life.find((item) => item.qq == UID)
    let name = ''
    for (var i = 0; i < linggenname.length; i++) {
      name = name + linggenname[i]
    }
    let size = Math.trunc(talent.talentsize)
    if ((await talent.talentshow) != 0) {
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
        life,
        player,
        level,
        linggenname: name,
        battle,
        equipment,
        talent,
        talentsize: size
      }
    }
  }
  /**
   * 装备信息
   * @param {*} param0 
   * @returns 
   */
  userEquipmentShow = async ({ UID }) => {
    const battle = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const equipment = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_equipment'
    })
    //tudo
    let life = await listdata.listAction({ NAME: 'life', CHOICE: 'user_life' })
    life = life.find((item) => item.qq == UID)
    return {
      path: 'user/equipment',
      name: 'equipment',
      data: {
        UID,
        battle,
        life,
        equipment
      }
    }
  }
  
  /**
   * 功法信息
   */
  userTalentShow = async ({ UID }) => {
    const talent = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    const linggenname = await gameUser.getTalentName({ data: talent })
    let life = await listdata.listAction({ NAME: 'life', CHOICE: 'user_life' })
    life = life.find((item) => item.qq == UID)
    let name = ''
    for (var i = 0; i < linggenname.length; i++) {
      name = name + linggenname[i]
    }
    let size = Math.trunc(talent.talentsize)
    if ((await talent.talentshow) != 0) {
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
        skills:talent['AllSorcery'],
        linggenname: name,
        talentsize: size
      }
    }
  }

  /**
   * 背包
   * @returns 
   */
  userBagShow = async ({ UID }) => {
    let life = await listdata.listAction({ NAME: 'life', CHOICE: 'user_life' })
    life = life.find((item) => item.qq == UID)
    const player = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_player'
    })
    const battle = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const najie = await listdata.listAction({ NAME: UID, CHOICE: 'user_bag' })
    const thing = najie.thing
    const thing_list = []
    const danyao_list = []
    const daoju_list = []
    thing.forEach((item) => {
      let id = item.id.split('-')
      switch (id[0]) {
        case '4': {
          danyao_list.push(item)
          break
        }
        case '6': {
          daoju_list.push(item)
          break
        }
        default: {
          thing_list.push(item)
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
        life,
        battle,
        najie,
        thing: thing_list,
        daoju_list,
        danyao_list
      }
    }
  }
}
export default new information()