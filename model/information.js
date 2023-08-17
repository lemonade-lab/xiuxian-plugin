import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import config from './config.js'
import Show from './show.js'
import data from './xiuxiandata.js'
import fs from 'fs'
import {
  get_random_talent,
  player_efficiency,
  get_random_fromARR
} from './xiuxian.js'
/**
 * 返回该玩家的法体
 * @return image
 */
export async function get_power_img(e) {
  let usr_qq = e.user_id
  let player = await data.getData('player', usr_qq)
  let lingshi = Math.trunc(player.灵石)
  if (player.灵石 > 999999999999) {
    lingshi = 999999999999
  }
  data.setData('player', usr_qq, player)
  await player_efficiency(usr_qq)
  if (!isNotNull(player.level_id)) {
    e.reply('请先#同步信息')
    return
  }
  let this_association = {}
  if (!isNotNull(player.宗门)) {
    this_association = {
      宗门名称: '无',
      职位: '无'
    }
  } else {
    this_association = player.宗门
  }
  //境界名字需要查找境界名
  let levelMax = data.levelMax_list.find(
    (item) => item.level_id == player.Physique_id
  ).level
  let playercopy = {
    user_id: usr_qq,
    nickname: player.名号,
    expMax: player.血气,
    levelMax: levelMax,
    lingshi: lingshi,
    player_maxHP: player.血量上限,
    player_nowHP: player.当前血量,
    learned_gongfa: player.学习的功法,
    association: this_association
  }
  const data1 = await new Show(e).get_playercopyData(playercopy)
  let img = await puppeteer.screenshot('playercopy', {
    ...data1
  })
  return img
}
/**
 * 返回该玩家的存档图片
 * @return image
 */
export async function get_player_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let equipment = await data.getData('equipment', usr_qq)
  let player_status = await getPlayerAction(usr_qq)
  let status = '空闲'
  if (player_status.time != null) {
    status = player_status.action + '(剩余时间:' + player_status.time + ')'
  }
  let lingshi = Math.trunc(player.灵石)
  if (player.灵石 > 999999999999) {
    lingshi = 999999999999
  }
  if (player.宣言 == null || player.宣言 == undefined) {
    player.宣言 = '这个人很懒什么都没写'
  }
  if (player.灵根 == null || player.灵根 == undefined) {
    player.灵根 = await get_random_talent()
  }
  data.setData('player', usr_qq, player)
  await player_efficiency(usr_qq)
  if ((await player.linggenshow) != 0) {
    player.灵根.type = '无'
    player.灵根.name = '未知'
    player.灵根.法球倍率 = '0'
    player.修炼效率提升 = '0'
  }

  if (!isNotNull(player.level_id)) {
    e.reply('请先#同步信息')
    return
  }
  //境界名字需要查找境界名
  let level = data.level_list.find(
    (item) => item.level_id == player.level_id
  ).level
  let player_data = {
    user_id: usr_qq,
    nickname: player.名号,
    linggen: player.灵根, //
    declaration: player.宣言,
    exp: player.修为,
    level: level,
    lingshi: lingshi,
    player_maxHP: player.血量上限,
    player_nowHP: player.当前血量,
    arms: equipment.武器,
    armor: equipment.护具,
    treasure: equipment.法宝,
    talent: parseInt(player.修炼效率提升 * 100), //
    player_action: status
  }
  const data1 = await new Show(e).get_playerData(player_data)
  let img = await puppeteer.screenshot('player', {
    ...data1
  })
  return img
}
/**
 * 我的宗门
 * @return image
 */
export async function get_association_img(e) {
  let usr_qq = e.user_id
  //无存档
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }

  //门派
  let player = data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) {
    return
  }
  //境界
  let now_level_id
  if (!isNotNull(player.level_id)) {
    e.reply('请先#同步信息')
    return
  }

  now_level_id = data.level_list.find(
    (item) => item.level_id == player.level_id
  ).level_id
  if (now_level_id >= 42) {
    //在这里退出宗门
    //查宗门，是宗门的仙人直接退出
    if (player.宗门.职位 != '宗主') {
      let ass = data.getAssociation(player.宗门.宗门名称)
      ass[player.宗门.职位] = ass[player.宗门.职位].filter(
        (item) => item != usr_qq
      )
      ass['所有成员'] = ass['所有成员'].filter((item) => item != usr_qq)
      data.setAssociation(ass.宗门名称, ass)
      delete player.宗门
      data.setData('player', usr_qq, player)
      await player_efficiency(usr_qq)
      e.reply('退出宗门成功')
    } else {
      let ass = data.getAssociation(player.宗门.宗门名称)
      if (ass.所有成员.length < 2) {
        fs.rmSync(
          `${data.filePathMap.association}/${player.宗门.宗门名称}.json`
        )
        delete player.宗门 //删除存档里的宗门信息
        data.setData('player', usr_qq, player)
        await player_efficiency(usr_qq)
        e.reply('退出宗门成功,推出后宗门空无一人,自动解散')
      } else {
        ass['所有成员'] = ass['所有成员'].filter((item) => item != usr_qq) //原来的成员表删掉这个B
        delete player.宗门 //删除这个B存档里的宗门信息
        data.setData('player', usr_qq, player)
        await player_efficiency(usr_qq)
        //随机一个幸运儿的QQ,优先挑选等级高的
        let randmember_qq
        if (ass.长老.length > 0) {
          randmember_qq = await get_random_fromARR(ass.长老)
        } else if (ass.内门弟子.length > 0) {
          randmember_qq = await get_random_fromARR(ass.内门弟子)
        } else {
          randmember_qq = await get_random_fromARR(ass.所有成员)
        }
        let randmember = await data.getData('player', randmember_qq) //获取幸运儿的存档
        ass[randmember.宗门.职位] = ass[randmember.宗门.职位].filter(
          (item) => item != randmember_qq
        ) //原来的职位表删掉这个幸运儿
        ass['宗主'] = randmember_qq //新的职位表加入这个幸运儿
        randmember.宗门.职位 = '宗主' //成员存档里改职位
        data.setData('player', randmember_qq, randmember) //记录到存档
        data.setData('player', usr_qq, player)
        data.setAssociation(ass.宗门名称, ass) //记录到宗门
        e.reply(`退出宗门成功,退出后,宗主职位由${randmember.名号}接管`)
      }
    }
    return
  }

  //有加入宗门
  let ass = data.getAssociation(player.宗门.宗门名称)
  //寻找
  let mainqq = await data.getData('player', ass.宗主)
  //门槛
  let level = data.level_list.find(
    (item) => item.level_id === ass.最低加入境界
  ).level

  //长老
  let zhanglao = []
  for (let item in ass.长老) {
    zhanglao[item] =
      '道号:' +
      data.getData('player', ass.长老[item]).名号 +
      'QQ:' +
      ass.长老[item]
  }
  //内门弟子
  let neimen = []
  for (let item in ass.内门弟子) {
    neimen[item] =
      '道号:' +
      data.getData('player', ass.内门弟子[item]).名号 +
      'QQ:' +
      ass.内门弟子[item]
  }
  //外门弟子
  let waimen = []
  for (let item in ass.外门弟子) {
    waimen[item] =
      '道号:' +
      data.getData('player', ass.外门弟子[item]).名号 +
      'QQ:' +
      ass.外门弟子[item]
  }

  let state = '需要维护'

  let now = new Date()
  let nowTime = now.getTime() //获取当前日期的时间戳
  if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
    state = '不需要维护'
  }

  //计算修炼效率
  let xiulian = ass.宗门等级 * 0.05 * 100
  xiulian = Math.trunc(xiulian)

  let association_data = {
    user_id: usr_qq,
    ass: ass,
    mainname: mainqq.名号,
    mainqq: ass.宗主,
    xiulian: xiulian,
    level: level,
    zhanglao: zhanglao,
    neimen: neimen,
    waimen: waimen,
    state: state
  }

  const data1 = await new Show(e).get_associationData(association_data)
  let img = await puppeteer.screenshot('association', {
    ...data1
  })
  return img
}
/**
 * 返回该玩家的装备图片
 * @return image
 */
export async function get_equipment_img(e) {
  let usr_qq = e.user_id
  let player = await data.getData('player', usr_qq)
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let bao = Math.trunc(parseInt(player.暴击率 * 100))
  let equipment = await data.getData('equipment', usr_qq)
  let player_data = {
    user_id: usr_qq,
    nickname: player.名号,
    arms: equipment.武器,
    armor: equipment.护具,
    treasure: equipment.法宝,
    player_atk: player.攻击,
    player_def: player.防御,
    player_bao: bao,
    player_maxHP: player.血量上限,
    player_nowHP: player.当前血量
  }
  const data1 = await new Show(e).get_equipmnetData(player_data)
  let img = await puppeteer.screenshot('equipment', {
    ...data1
  })

  return img
}

/**
 * 返回该玩家的纳戒图片
 * @return image
 */
export async function get_najie_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let najie = await data.getData('najie', usr_qq)
  let lingshi = Math.trunc(najie.灵石)
  let lingshi2 = Math.trunc(najie.灵石上限)
  let player_data = {
    user_id: usr_qq,
    nickname: player.名号,
    najie_lv: najie.等级,
    player_maxHP: player.血量上限,
    player_nowHP: player.当前血量,
    najie_maxlingshi: lingshi2,
    najie_lingshi: lingshi,
    najie_equipment: najie.装备,
    najie_danyao: najie.丹药,
    najie_daoju: najie.道具,
    najie_gongfa: najie.功法,
    najie_caoyao: najie.草药
  }
  const data1 = await new Show(e).get_najieData(player_data)
  let img = await puppeteer.screenshot('najie', {
    ...data1
  })

  return img
}

/**
 * 返回境界列表图片
 * @return image
 */

export async function get_state_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }

  let player = await data.getData('player', usr_qq)
  let level_id = player.level_id
  let level_list = data.level_list

  //循环删除表信息
  for (let i = 1; i <= 60; i++) {
    if (i > level_id - 6 && i < level_id + 6) {
      continue
    }
    level_list = await level_list.filter((item) => item.level_id != i)
  }
  let state_data = {
    user_id: usr_qq,
    level_list: level_list
  }
  const data1 = await new Show(e).get_stateData(state_data)
  let img = await puppeteer.screenshot('state', {
    ...data1
  })
  return img
}

/**
 * 返回境界列表图片
 * @return image
 */

export async function get_statemax_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }

  let player = await data.getData('player', usr_qq)

  let level_id = player.Physique_id

  let levelMax_list = data.levelMax_list

  //循环删除表信息
  for (let i = 1; i <= 60; i++) {
    if (i > level_id - 6 && i < level_id + 6) {
      continue
    }
    levelMax_list = await levelMax_list.filter((item) => item.level_id != i)
  }

  let statemax_data = {
    user_id: usr_qq,
    levelMax_list: levelMax_list
  }
  const data1 = await new Show(e).get_statemaxData(statemax_data)
  let img = await puppeteer.screenshot('statemax', {
    ...data1
  })
  return img
}

/**
 * 返回修仙版本
 * @return image
 */
export async function get_updata_img(e) {
  let updata_data = {}
  const data1 = await new Show(e).get_updataData(updata_data)
  let img = await puppeteer.screenshot('updata', {
    ...data1
  })
  return img
}

/**
 * 返回修仙设置
 * @return image
 */
export async function get_adminset_img(e) {
  const xiuxianconfigData = config.getconfig('xiuxian', 'xiuxian')
  let adminset = {
    //CD:分
    CDassociation: xiuxianconfigData.CD.association,
    CDjoinassociation: xiuxianconfigData.CD.joinassociation,
    CDassociationbattle: xiuxianconfigData.CD.associationbattle,
    CDrob: xiuxianconfigData.CD.rob,
    CDgambling: xiuxianconfigData.CD.gambling,
    CDcouple: xiuxianconfigData.CD.couple,
    CDgarden: xiuxianconfigData.CD.garden,
    CDlevel_up: xiuxianconfigData.CD.level_up,
    CDsecretplace: xiuxianconfigData.CD.secretplace,
    CDtimeplace: xiuxianconfigData.CD.timeplace,
    CDforbiddenarea: xiuxianconfigData.CD.forbiddenarea,
    CDreborn: xiuxianconfigData.CD.reborn,
    CDtransfer: xiuxianconfigData.CD.transfer,
    CDhonbao: xiuxianconfigData.CD.honbao,
    CDboss: xiuxianconfigData.CD.boss,
    //手续费
    percentagecost: xiuxianconfigData.percentage.cost,
    percentageMoneynumber: xiuxianconfigData.percentage.Moneynumber,
    percentagepunishment: xiuxianconfigData.percentage.punishment,
    //出千控制
    sizeMoney: xiuxianconfigData.size.Money,
    //开关
    switchplay: xiuxianconfigData.switch.play,
    switchMoneynumber: xiuxianconfigData.switch.play,
    switchcouple: xiuxianconfigData.switch.couple,
    switchXiuianplay_key: xiuxianconfigData.switch.Xiuianplay_key,
    //倍率
    biguansize: xiuxianconfigData.biguan.size,
    biguantime: xiuxianconfigData.biguan.time,
    biguancycle: xiuxianconfigData.biguan.cycle,
    //
    worksize: xiuxianconfigData.work.size,
    worktime: xiuxianconfigData.work.time,
    workcycle: xiuxianconfigData.work.cycle,
    //
    BossBoss: xiuxianconfigData.Boss.Boss,
    //出金倍率
    SecretPlaceone: xiuxianconfigData.SecretPlace.one,
    SecretPlacetwo: xiuxianconfigData.SecretPlace.two,
    SecretPlacethree: xiuxianconfigData.SecretPlace.three
  }
  const data1 = await new Show(e).get_adminsetData(adminset)
  let img = await puppeteer.screenshot('adminset', {
    ...data1
  })
  return img
}

export async function get_ranking_power_img(e, Data, usr_paiming, thisplayer) {
  let usr_qq = e.user_id
  if (!isNotNull(thisplayer.level_id)) {
    e.reply('请先#同步信息')
    return
  }
  let level = data.level_list.find(
    (item) => item.level_id == thisplayer.level_id
  ).level
  let ranking_power_data = {
    user_id: usr_qq,
    nickname: thisplayer.名号,
    exp: thisplayer.修为,
    level: level,
    usr_paiming: usr_paiming,
    allplayer: Data
  }
  const data1 = await new Show(e).get_ranking_powerData(ranking_power_data)
  let img = await puppeteer.screenshot('ranking_power', {
    ...data1
  })
  return img
}

export async function get_ranking_money_img(
  e,
  Data,
  usr_paiming,
  thisplayer,
  thisnajie
) {
  let usr_qq = e.user_id
  let najie_lingshi = Math.trunc(thisnajie.灵石)
  let lingshi = Math.trunc(thisplayer.灵石 + thisnajie.灵石)
  let ranking_money_data = {
    user_id: usr_qq,
    nickname: thisplayer.名号,
    lingshi: lingshi,
    najie_lingshi: najie_lingshi,
    usr_paiming: usr_paiming,
    allplayer: Data
  }
  const data1 = await new Show(e).get_ranking_moneyData(ranking_money_data)
  let img = await puppeteer.screenshot('ranking_money', {
    ...data1
  })
  return img
}

async function getPlayerAction(usr_qq) {
  let arr = {}
  let action = await redis.get('xiuxian:player:' + usr_qq + ':action')
  action = JSON.parse(action)
  if (action != null) {
    let action_end_time = action.end_time
    let now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      let m = parseInt((action_end_time - now_time) / 1000 / 60)
      let s = parseInt((action_end_time - now_time - m * 60 * 1000) / 1000)
      arr.action = action.action //当期那动作
      arr.time = m + '分' + s + '秒' //剩余时间
      return arr
    }
  }
  arr.action = '空闲'
  return arr
}
/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @returns obj==null/undefined,return false,other return true
 */
function isNotNull(obj) {
  if (obj == undefined || obj == null) return false
  return true
}
