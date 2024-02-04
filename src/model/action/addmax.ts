import { isNotNull, shijianc } from '../utils/utils'
import { data } from '../base/data'
import { Read_danyao, Read_najie, Read_player } from './read'
import { Write_najie } from './write'
/**
 * 增加减少纳戒内物品
 * @param user_id 操作存档theqq号
 * @param name  物品名称
 * @param thing_class  物品类别
 * @param x  操作the数量,取+增加,取 -减少
 * @param pinji 品级 数字0-6
 * @returns 无
 */
export async function Add_najie_thing(
  user_id,
  name,
  thing_class,
  x,
  pinji = 0
) {
  if (x == 0) return
  let najie = await Read_najie(user_id)
  //写入
  //这部分写得很冗余,但能跑
  if (thing_class == '装备') {
    if (!pinji && pinji != 0) {
      pinji = Math.trunc(Math.random() * 6)
    }
    let z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2]
    if (x > 0) {
      if (typeof name != 'object') {
        let list = [
          'equipment_list',
          'timeequipmen_list',
          'duanzhaowuqi',
          'duanzhaohuju',
          'duanzhaobaowu'
        ]
        for (let i of list) {
          let thing = data[i].find((item) => item.name == name)
          if (thing) {
            let equ = JSON.parse(JSON.stringify(thing))
            equ.pinji = pinji
            equ.atk *= z[pinji]
            equ.def *= z[pinji]
            equ.HP *= z[pinji]
            equ.数量 = x
            equ.islockd = 0
            najie[thing_class].push(equ)
            await Write_najie(user_id, najie)
            return
          }
        }
      } else {
        if (!name.pinji) name.pinji = pinji
        name.数量 = x
        name.islockd = 0
        najie[thing_class].push(name)
        await Write_najie(user_id, najie)
        return
      }
    }
    if (typeof name != 'object') {
      najie[thing_class].find(
        (item) => item.name == name && item.pinji == pinji
      ).数量 += x
    } else {
      najie[thing_class].find(
        (item) => item.name == name.name && item.pinji == pinji
      ).数量 += x
    }
    najie.装备 = najie.装备.filter((item) => item.数量 > 0)
    await Write_najie(user_id, najie)
    return
  } else if (thing_class == '仙宠') {
    if (x > 0) {
      if (typeof name != 'object') {
        let thing = data.xianchon().find((item) => item.name == name)
        if (thing) {
          thing = JSON.parse(JSON.stringify(thing))
          thing.数量 = x
          thing.islockd = 0
          najie[thing_class].push(thing)
          await Write_najie(user_id, najie)
          return
        }
      } else {
        name.数量 = x
        name.islockd = 0
        najie[thing_class].push(name)
        await Write_najie(user_id, najie)
        return
      }
    }
    if (typeof name != 'object') {
      najie[thing_class].find((item) => item.name == name).数量 += x
    } else {
      najie[thing_class].find((item) => item.name == name.name).数量 += x
    }
    najie.仙宠 = najie.仙宠.filter((item) => item.数量 > 0)
    await Write_najie(user_id, najie)
    return
  }
  let exist = await exist_najie_thing(user_id, name, thing_class)
  if (x > 0 && !exist) {
    let thing
    let list = [
      'danyao_list',
      'newdanyao_list',
      'timedanyao_list',
      'daoju_list',
      'gongfa_list',
      'timegongfa_list',
      'caoyao_list',
      'xianchonkouliang',
      'duanzhaocailiao'
    ]
    for (let i of list) {
      thing = data[i].find((item) => item.name == name)
      if (thing) {
        najie[thing_class].push(thing)
        najie[thing_class].find((item) => item.name == name).数量 = x
        najie[thing_class].find((item) => item.name == name).islockd = 0
        await Write_najie(user_id, najie)
        return
      }
    }
  }
  najie[thing_class].find((item) => item.name == name).数量 += x
  najie[thing_class] = najie[thing_class].filter((item) => item.数量 > 0)
  await Write_najie(user_id, najie)
  return
}

export async function Add_player_studyskill(user_id, gongfa_name) {
  let player = await Read_player(user_id)
  player.studytheskill.push(gongfa_name)
  data.setData('player', user_id, player)
  await player_efficiency(user_id)
  return
}

//---------------------------------------------分界线------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//修炼效率综合
export async function player_efficiency(user_id) {
  //这里有问题
  let player = await data.getData('player', user_id) //修仙个人信息
  let ass
  let Assoc_efficiency //宗门效率加成
  let linggen_efficiency //talent效率加成
  let gongfa_efficiency = 0 //skill效率加成
  let xianchong_efficiency = 0 // 仙宠效率加成
  if (!isNotNull(player.宗门)) {
    //是否存在宗门信息
    Assoc_efficiency = 0 //不存在，宗门效率为0
  } else {
    ass = await data.getAssociation(player.宗门.宗门名称) //修仙对应宗门信息
    if (ass.宗门驻地 == 0) {
      Assoc_efficiency = ass.宗门等级 * 0.05
    } else {
      let dongTan = await data
        .bless_list()
        .find((item) => item.name == ass.宗门驻地)
      try {
        Assoc_efficiency = ass.宗门等级 * 0.05 + dongTan.efficiency
      } catch {
        Assoc_efficiency = ass.宗门等级 * 0.05 + 0.5
      }
    }
  }
  linggen_efficiency = player.talent.eff //talent修炼速率
  label1: for (let i in player.studytheskill) {
    //存在skill，遍历skill加成
    let gongfa = ['gongfa_list', 'timegongfa_list']
    //这里是查看了skill表
    for (let j of gongfa) {
      let ifexist = data[j].find((item) => item.name == player.studytheskill[i])
      if (ifexist) {
        gongfa_efficiency += ifexist.修炼加成
        continue label1
      }
    }
    player.studytheskill.splice(i, 1)
  }
  if (player.仙宠.type == '修炼') {
    // 是否存在修炼仙宠
    xianchong_efficiency = player.仙宠.加成 // 存在修炼仙宠，仙宠效率为仙宠效率加成
  }
  let dy = await Read_danyao(user_id)
  let bgdan = dy.biguanxl
  if (
    parseInt(player.Improving_cultivation_efficiency) !=
    parseInt(player.Improving_cultivation_efficiency)
  ) {
    player.Improving_cultivation_efficiency = 0
  }

  player.Improving_cultivation_efficiency =
    linggen_efficiency +
    Assoc_efficiency +
    gongfa_efficiency +
    xianchong_efficiency +
    bgdan //修炼效率综合
  data.setData('player', user_id, player)
  return
}

//要用await
export async function exist_najie_thing(
  user_id,
  thing_name,
  thing_class,
  thing_pinji = 0
) {
  let najie = await Read_najie(user_id)
  let ifexist
  if (thing_class == '装备' && (thing_pinji || thing_pinji == 0)) {
    ifexist = najie.装备.find(
      (item) => item.name == thing_name && item.pinji == thing_pinji
    )
  } else {
    let type = [
      '装备',
      '丹药',
      '道具',
      'skill',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ]
    for (let i of type) {
      ifexist = najie[i].find((item) => item.name == thing_name)
      if (ifexist) break
    }
  }
  if (ifexist) {
    return ifexist.数量
  }
  return false
}
