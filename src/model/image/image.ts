import { puppeteer } from '../../../import.js'
import { getConfig } from '../Config.js'
import { Show } from '../show.js'
import { __PATH } from '../base/PATH.js'
import {
  GetPower,
  Strand,
  bigNumberTransform,
  getPlayerAction,
  get_random_talent
} from '../xiuxian.js'
import { data } from '../base/data.js'
import {
  Read_Exchange,
  Read_Forum,
  Read_equipment,
  Read_najie,
  Read_player,
  Read_qinmidu
} from '../action/read.js'
import { player_efficiency } from '../action/addmax.js'
import { Write_Exchange, Write_Forum, Write_qinmidu } from '../action/write.js'
import { isNotNull } from '../utils.js'

/**
 * 返回该玩家the仙宠图片
 * @param e
 * @returns
 */
export async function get_XianChong_img(e) {
  let i
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let najie = await Read_najie(usr_qq)
  let XianChong_have = []
  let XianChong_need = []
  let Kouliang = []
  let XianChong_list = data.xianchon
  let Kouliang_list = data.xianchonkouliang
  for (i = 0; i < XianChong_list.length; i++) {
    if (najie.仙宠.find((item) => item.name == XianChong_list[i].name)) {
      XianChong_have.push(XianChong_list[i])
    } else if (player.仙宠.name == XianChong_list[i].name) {
      XianChong_have.push(XianChong_list[i])
    } else {
      XianChong_need.push(XianChong_list[i])
    }
  }
  for (i = 0; i < Kouliang_list.length; i++) {
    Kouliang.push(Kouliang_list[i])
  }
  let player_data = {
    nickname: player.name,
    XianChong_have,
    XianChong_need,
    Kouliang
  }
  const data1 = await new Show().get_xianchong(player_data)
  return await puppeteer.screenshot('xianchong', {
    ...data1
  })
}

/**
 * 返回该玩家the道具图片
 * @return image
 */

/**
 *
 * @param e
 * @returns
 */
export async function get_daoju_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let najie = await Read_najie(usr_qq)
  let daoju_have = []
  let daoju_need = []
  for (const i of data.daoju_list) {
    if (najie.道具.find((item) => item.name == i.name)) {
      daoju_have.push(i)
    } else {
      daoju_need.push(i)
    }
  }
  let player_data = {
    user_id: usr_qq,
    nickname: player.name,
    daoju_have,
    daoju_need
  }
  const data1 = await new Show().get_daojuData(player_data)
  return await puppeteer.screenshot('daoju', {
    ...data1
  })
}

/**
 * 返回该玩家theweapon图片
 * @return image
 */
export async function get_wuqi_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let najie = await Read_najie(usr_qq)
  let equipment = await Read_equipment(usr_qq)
  let wuqi_have = []
  let wuqi_need = []
  const wuqi_list = [
    'equipment_list',
    'timeequipmen_list',
    'duanzhaowuqi',
    'duanzhaohuju',
    'duanzhaobaowu'
  ]
  let zb = []
  for (const i of wuqi_list) {
    for (const j of data[i]) {
      if (
        najie['装备'].find((item) => item.name == j.name) &&
        !wuqi_have.find((item) => item.name == j.name)
      ) {
        wuqi_have.push(j)
      } else if (
        (equipment['weapon'].name == j.name ||
          equipment['magic_weapon'].name == j.name ||
          equipment['protective_clothing'].name == j.name) &&
        !wuqi_have.find((item) => item.name == j.name)
      ) {
        wuqi_have.push(j)
      } else if (!wuqi_need.find((item) => item.name == j.name)) {
        wuqi_need.push(j)
      }
    }
  }

  let player_data = {
    user_id: usr_qq,
    nickname: player.name,
    wuqi_have,
    wuqi_need
  }
  const data1 = await new Show().get_wuqiData(player_data)
  return await puppeteer.screenshot('wuqi', {
    ...data1
  })
}

/**
 * 返回该玩家the丹药图片
 * @return image
 */
export async function get_danyao_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const player = await Read_player(usr_qq)
  const najie = await Read_najie(usr_qq)
  let danyao_have = []
  let danyao_need = []
  const danyao = ['danyao_list', 'timedanyao_list', 'newdanyao_list']
  for (const i of danyao) {
    for (const j of data[i]) {
      if (
        najie['丹药'].find((item) => item.name == j.name) &&
        !danyao_have.find((item) => item.name == j.name)
      ) {
        danyao_have.push(j)
      } else if (!danyao_need.find((item) => item.name == j.name)) {
        danyao_need.push(j)
      }
    }
  }
  let player_data = {
    user_id: usr_qq,
    nickname: player.name,
    danyao_have,
    danyao_need
  }
  const data1 = await new Show().get_danyaoData(player_data)
  return await puppeteer.screenshot('danyao', {
    ...data1
  })
}

/**
 * 返回该玩家theskill图片
 * @return image
 */
export async function get_gongfa_img(e) {
  let i
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let xuexi_gongfa = player.studytheskill
  let gongfa_have = []
  let gongfa_need = []
  const gongfa = ['gongfa_list', 'timegongfa_list']
  for (const i of gongfa) {
    for (const j of data[i]) {
      if (
        xuexi_gongfa.find((item) => item == j.name) &&
        !gongfa_have.find((item) => item.name == j.name)
      ) {
        gongfa_have.push(j)
      } else if (!gongfa_need.find((item) => item.name == j.name)) {
        gongfa_need.push(j)
      }
    }
  }
  let player_data = {
    user_id: usr_qq,
    nickname: player.name,
    gongfa_have,
    gongfa_need
  }
  const data1 = await new Show().get_gongfaData(player_data)
  return await puppeteer.screenshot('gongfa', {
    ...data1
  })
}

/**
 * 返回该玩家the法体
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
  let this_association
  if (!isNotNull(player.宗门)) {
    this_association = {
      宗门名称: '无',
      职位: '无'
    }
  } else {
    this_association = player.宗门
  }
  //境界名字需要查找境界名
  let levelMax = data.LevelMax_list.find(
    (item) => item.level_id == player.Physique_id
  ).level
  let need_xueqi = data.LevelMax_list.find(
    (item) => item.level_id == player.Physique_id
  ).exp
  let playercopy = {
    user_id: usr_qq,
    nickname: player.name,
    need_xueqi: need_xueqi,
    xueqi: player.血气,
    levelMax: levelMax,
    lingshi: lingshi,
    镇妖塔层数: player.镇妖塔层数,
    神魄段数: player.神魄段数,
    hgd: player.favorability,
    player_maxHP: player.血量上限,
    player_nowHP: player.now_bool,
    learned_gongfa: player.studytheskill,
    association: this_association
  }
  const data1 = await new Show().get_playercopyData(playercopy)
  return await puppeteer.screenshot('playercopy', {
    ...data1
  })
}

/**
 * 返回该玩家the存档图片
 * @return image
 */
export async function get_player_img(e) {
  let magic_weapon评级
  let protective_clothing评级
  let weapon评级
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
  if (player.talent == null || player.talent == undefined) {
    player.talent = await get_random_talent()
  }
  data.setData('player', usr_qq, player)
  await player_efficiency(usr_qq) // 注意这里刷新了Improving_cultivation_efficiency
  if ((await player.linggenshow) != 0) {
    player.talent.type = '无'
    player.talent.name = '未知'
    player.talent.法球倍率 = '0'
    player.Improving_cultivation_efficiency = '0'
  }
  if (!isNotNull(player.level_id)) {
    e.reply('请先#一键同步')
    return
  }
  if (!isNotNull(player.sex)) {
    e.reply('请先#一键同步')
    return
  }
  let nd = '无'
  if (player.hide_talent) nd = player.hide_talent.name
  let zd = ['攻击', '防御', '生命加成', '防御加成', '攻击加成']
  let num = []
  let p = []
  let kxjs = []
  let count = 0
  for (let j of zd) {
    if (player[j] == 0) {
      p[count] = ''
      kxjs[count] = 0
      count++
      continue
    }
    p[count] = Math.floor(Math.log(player[j]) / Math.LN10)
    num[count] = player[j] * 10 ** -p[count]
    kxjs[count] = `${num[count].toFixed(2)} x 10`
    count++
  }
  //境界名字需要查找境界名
  let level = data.Level_list.find(
    (item) => item.level_id == player.level_id
  ).level
  let power =
    (player.攻击 * 0.9 +
      player.防御 * 1.1 +
      player.血量上限 * 0.6 +
      player.暴击率 * player.攻击 * 0.5 +
      player.talent.法球倍率 * player.攻击) /
    10000
  power = Number(power.toFixed(2))
  let power2 = (player.攻击 + player.防御 * 1.1 + player.血量上限 * 0.5) / 10000
  power2 = Number(power2.toFixed(2))
  let level2 = data.LevelMax_list.find(
    (item) => item.level_id == player.Physique_id
  ).level
  let need_exp = data.Level_list.find(
    (item) => item.level_id == player.level_id
  ).exp
  let need_exp2 = data.LevelMax_list.find(
    (item) => item.level_id == player.Physique_id
  ).exp
  let occupation = player.occupation
  let occupation_level
  let occupation_level_name
  let occupation_exp
  let occupation_need_exp
  if (!isNotNull(player.occupation)) {
    occupation = '无'
    occupation_level_name = '-'
    occupation_exp = '-'
    occupation_need_exp = '-'
  } else {
    occupation_level = player.occupation_level
    occupation_level_name = data.occupation_exp_list.find(
      (item) => item.id == occupation_level
    ).name
    occupation_exp = player.occupation_exp
    occupation_need_exp = data.occupation_exp_list.find(
      (item) => item.id == occupation_level
    ).experience
  }
  let this_association
  if (!isNotNull(player.宗门)) {
    this_association = {
      宗门名称: '无',
      职位: '无'
    }
  } else {
    this_association = player.宗门
  }
  let pinji = ['劣', '普', '优', '精', '极', '绝', '顶']
  if (!isNotNull(equipment.weapon.pinji)) {
    weapon评级 = '无'
  } else {
    weapon评级 = pinji[equipment.weapon.pinji]
  }
  if (!isNotNull(equipment.protective_clothing.pinji)) {
    protective_clothing评级 = '无'
  } else {
    protective_clothing评级 = pinji[equipment.protective_clothing.pinji]
  }
  if (!isNotNull(equipment.magic_weapon.pinji)) {
    magic_weapon评级 = '无'
  } else {
    magic_weapon评级 = pinji[equipment.magic_weapon.pinji]
  }
  let rank_lianqi = data.Level_list.find(
    (item) => item.level_id == player.level_id
  ).level
  let expmax_lianqi = data.Level_list.find(
    (item) => item.level_id == player.level_id
  ).exp
  let rank_llianti = data.LevelMax_list.find(
    (item) => item.level_id == player.Physique_id
  ).level
  let expmax_llianti = need_exp2
  let rank_liandan = occupation_level_name
  let expmax_liandan = occupation_need_exp
  let strand_hp = Strand(player.now_bool, player.血量上限)
  let strand_lianqi = Strand(player.now_exp, expmax_lianqi)
  let strand_llianti = Strand(player.血气, expmax_llianti)
  let strand_liandan = Strand(occupation_exp, expmax_liandan)
  let Power = GetPower(player.攻击, player.防御, player.血量上限, player.暴击率)
  let PowerMini = bigNumberTransform(Power)
  let bao = player.暴击率 * 100 + '%'
  equipment.weapon.bao = equipment.weapon.bao * 100 + '%'
  equipment.protective_clothing.bao =
    equipment.protective_clothing.bao * 100 + '%'
  equipment.magic_weapon.bao = equipment.magic_weapon.bao * 100 + '%'
  lingshi = Number(bigNumberTransform(lingshi))
  let hunyin = '未知'
  let A = usr_qq
  let qinmidu
  try {
    qinmidu = await Read_qinmidu()
  } catch {
    //没有建立一个
    await Write_qinmidu([])
    qinmidu = await Read_qinmidu()
  }
  for (let i = 0; i < qinmidu.length; i++) {
    if (qinmidu[i].QQ_A == A || qinmidu[i].QQ_B == A) {
      if (qinmidu[i].婚姻 > 0) {
        if (qinmidu[i].QQ_A == A) {
          let B = await Read_player(qinmidu[i].QQ_B)
          hunyin = B.name
        } else {
          let A = await Read_player(qinmidu[i].QQ_A)
          hunyin = A.name
        }
        break
      }
    }
  }
  let action = player.练气皮肤
  let player_data = {
    neidan: nd,
    pifu: action,
    user_id: usr_qq,
    player, // 玩家数据
    rank_lianqi, // 练气境界
    expmax_lianqi, // 练气需求经验
    rank_llianti, // 炼体境界
    expmax_llianti, // 炼体需求经验
    rank_liandan, // 炼丹境界
    expmax_liandan, // 炼丹需求经验
    equipment, // 装备数据
    talent: player.Improving_cultivation_efficiency * 100, //
    player_action: status, // 当前状态
    this_association, // 宗门信息
    strand_hp,
    strand_lianqi,
    strand_llianti,
    strand_liandan,
    PowerMini, // 玩家战力
    bao,
    nickname: player.name,
    linggen: player.talent, //
    declaration: player.宣言,
    need_exp: need_exp,
    need_exp2: need_exp2,
    exp: player.now_exp,
    exp2: player.血气,
    zdl: power,
    镇妖塔层数: player.镇妖塔层数,
    sh: player.神魄段数,
    mdz: player.魔道值,
    hgd: player.favorability,
    jczdl: power2,
    level: level,
    level2: level2,
    lingshi: lingshi,
    player_maxHP: player.血量上限,
    player_nowHP: player.now_bool,
    player_atk: kxjs[0],
    player_atk2: p[0],
    player_def: kxjs[1],
    player_def2: p[1],
    生命加成: kxjs[2],
    生命加成_t: p[2],
    防御加成: kxjs[3],
    防御加成_t: p[3],
    攻击加成: kxjs[4],
    攻击加成_t: p[4],
    player_bao: player.暴击率,
    player_bao2: player.暴击伤害,
    occupation: occupation,
    occupation_level: occupation_level_name,
    occupation_exp: occupation_exp,
    occupation_need_exp: occupation_need_exp,
    arms: equipment.weapon,
    armor: equipment.protective_clothing,
    treasure: equipment.magic_weapon,
    association: this_association,
    learned_gongfa: player.studytheskill,
    婚姻状况: hunyin,
    weapon评级: weapon评级,
    protective_clothing评级: protective_clothing评级,
    magic_weapon评级: magic_weapon评级
  }
  const data1 = await new Show().get_playerData(player_data)
  return await puppeteer.screenshot('player', {
    ...data1
  })
}

export async function get_supermarket_img(e, thing_class) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let Exchange_list
  try {
    Exchange_list = await Read_Exchange()
  } catch {
    await Write_Exchange([])
    Exchange_list = await Read_Exchange()
  }
  for (let i = 0; i < Exchange_list.length; i++) {
    Exchange_list[i].num = i + 1
  }
  if (thing_class) {
    Exchange_list = Exchange_list.filter(
      (item) => item.name.class == thing_class
    )
  }

  Exchange_list.sort(function (a, b) {
    return b.now_time - a.now_time
  })
  let supermarket_data = {
    user_id: usr_qq,
    Exchange_list: Exchange_list
  }
  const data1 = await new Show().get_supermarketData(supermarket_data)
  let img = await puppeteer.screenshot('supermarket', {
    ...data1
  })
  return img
}

export async function get_forum_img(e, thing_class) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let Forum
  try {
    Forum = await Read_Forum()
  } catch {
    await Write_Forum([])
    Forum = await Read_Forum()
  }
  for (let i = 0; i < Forum.length; i++) {
    Forum[i].num = i + 1
  }
  if (thing_class) {
    Forum = Forum.filter((item) => item.class == thing_class)
  }

  Forum.sort(function (a, b) {
    return b.now_time - a.now_time
  })
  let forum_data = {
    user_id: usr_qq,
    Forum: Forum
  }
  const data1 = await new Show().get_forumData(forum_data)
  let img = await puppeteer.screenshot('forum', {
    ...data1
  })
  return img
}

export async function get_danfang_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }

  let danfang_list = data.danfang_list

  let danfang_data = {
    user_id: usr_qq,
    danfang_list: danfang_list
  }
  const data1 = await new Show().get_danfangData(danfang_data)
  let img = await puppeteer.screenshot('danfang', {
    ...data1
  })
  return img
}

export async function get_tuzhi_img(e, all_level) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }

  let tuzhi_list = data.tuzhi_list

  let tuzhi_data = {
    user_id: usr_qq,
    tuzhi_list: tuzhi_list
  }
  const data1 = await new Show().get_tuzhiData(tuzhi_data)
  let img = await puppeteer.screenshot('tuzhi', {
    ...data1
  })
  return img
}

/**
 * 返回柠檬堂
 * @return image
 */
export async function get_ningmenghome_img(e, thing_type) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let commodities_list = data.commodities_list
  if (thing_type != '') {
    if (
      thing_type == '装备' ||
      thing_type == '丹药' ||
      thing_type == 'skill' ||
      thing_type == '道具' ||
      thing_type == '草药'
    ) {
      commodities_list = commodities_list.filter(
        (item) => item.class == thing_type
      )
    } else if (
      thing_type == 'weapon' ||
      thing_type == 'protective_clothing' ||
      thing_type == 'magic_weapon' ||
      thing_type == 'now_exp' ||
      thing_type == '血量' ||
      thing_type == '血气' ||
      thing_type == '天赋'
    ) {
      commodities_list = commodities_list.filter(
        (item) => item.type == thing_type
      )
    }
  }
  let ningmenghome_data = {
    user_id: usr_qq,
    commodities_list: commodities_list
  }
  const data1 = await new Show().get_ningmenghomeData(ningmenghome_data)
  let img = await puppeteer.screenshot('ningmenghome', {
    ...data1
  })
  return img
}
/**
 * 返回万宝楼
 * @return image
 */
export async function get_valuables_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let valuables_data = {
    user_id: usr_qq
  }
  const data1 = await new Show().get_valuablesData(valuables_data)
  let img = await puppeteer.screenshot('valuables', {
    ...data1
  })
  return img
}

/**
 * 我the宗门
 * @return image
 */
export async function get_association_img(e) {
  let item
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
  //let now_level_id;
  if (!isNotNull(player.level_id)) {
    e.reply('请先#同步信息')
    return
  }
  //有加入宗门
  let ass = data.getAssociation(player.宗门.宗门名称)
  //寻找
  let mainqq = await data.getData('player', ass.宗主)
  //仙宗
  let xian = ass.power
  let weizhi
  if (xian == 0) {
    weizhi = '凡界'
  } else {
    weizhi = '仙界'
  }
  //门槛
  let level = data.Level_list.find(
    (item) => item.level_id === ass.最低加入境界
  ).level
  // 副宗主
  let fuzong = []
  for (item in ass.副宗主) {
    fuzong[item] =
      '道号：' +
      data.getData('player', ass.副宗主[item]).name +
      'QQ：' +
      ass.副宗主[item]
  }
  //长老
  const zhanglao = []
  for (item in ass.长老) {
    zhanglao[item] =
      '道号：' +
      data.getData('player', ass.长老[item]).name +
      'QQ：' +
      ass.长老[item]
  }
  //内门弟子
  const neimen = []
  for (item in ass.内门弟子) {
    neimen[item] =
      '道号：' +
      data.getData('player', ass.内门弟子[item]).name +
      'QQ：' +
      ass.内门弟子[item]
  }
  //外门弟子
  const waimen = []
  for (item in ass.外门弟子) {
    waimen[item] =
      '道号：' +
      data.getData('player', ass.外门弟子[item]).name +
      'QQ：' +
      ass.外门弟子[item]
  }
  let state = '需要维护'
  let now = new Date()
  let nowTime = now.getTime() //获取当前日期the时间戳
  if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
    state = '不需要维护'
  }
  //计算修炼效率
  let xiulian
  let dongTan = await data.bless_list.find((item) => item.name == ass.宗门驻地)
  if (ass.宗门驻地 == 0) {
    xiulian = ass.宗门等级 * 0.05 * 100
  } else {
    try {
      xiulian = ass.宗门等级 * 0.05 * 100 + dongTan.efficiency * 100
    } catch {
      xiulian = ass.宗门等级 * 0.05 * 100 + 0.5
    }
  }
  xiulian = Math.trunc(xiulian)
  if (ass.宗门神兽 == 0) {
    ass.宗门神兽 = '无'
  }
  let association_data = {
    user_id: usr_qq,
    ass: ass,
    mainname: mainqq.name,
    mainqq: ass.宗主,
    xiulian: xiulian,
    weizhi: weizhi,
    level: level,
    mdz: player.魔道值,
    zhanglao: zhanglao,
    fuzong: fuzong,
    neimen: neimen,
    waimen: waimen,
    state: state
  }
  const data1 = await new Show().get_associationData(association_data)
  return await puppeteer.screenshot('association', {
    ...data1
  })
}

/**
 * 返回该玩家the装备图片
 * @return image
 */
export async function get_equipment_img(e) {
  let usr_qq = e.user_id
  let player = await data.getData('player', usr_qq)
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const bao = Math.trunc(player.暴击率 * 100)
  let equipment = await data.getData('equipment', usr_qq)
  let player_data = {
    user_id: usr_qq,
    mdz: player.魔道值,
    nickname: player.name,
    arms: equipment.weapon,
    armor: equipment.protective_clothing,
    treasure: equipment.magic_weapon,
    player_atk: player.攻击,
    player_def: player.防御,
    player_bao: bao,
    player_maxHP: player.血量上限,
    player_nowHP: player.now_bool,
    pifu: Number(player.装备皮肤)
  }
  const data1 = await new Show().get_equipmnetData(player_data)
  return await puppeteer.screenshot('equipment', {
    ...data1
  })
}
/**
 * 返回该玩家the纳戒图片
 * @return image
 */
export async function get_najie_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let najie = await Read_najie(usr_qq)
  const lingshi = Math.trunc(najie.灵石)
  const lingshi2 = Math.trunc(najie.灵石上限)
  let strand_hp = Strand(player.now_bool, player.血量上限)
  let strand_lingshi = Strand(najie.灵石, najie.灵石上限)
  let player_data = {
    user_id: usr_qq,
    player: player,
    najie: najie,
    mdz: player.魔道值,
    nickname: player.name,
    najie_lv: najie.等级,
    player_maxHP: player.血量上限,
    player_nowHP: player.now_bool,
    najie_maxlingshi: lingshi2,
    najie_lingshi: lingshi,
    najie_equipment: najie.装备,
    najie_danyao: najie.丹药,
    najie_daoju: najie.道具,
    najie_gongfa: najie.skill,
    najie_caoyao: najie.草药,
    najie_cailiao: najie.材料,
    strand_hp: strand_hp,
    strand_lingshi: strand_lingshi,
    pifu: player.练气皮肤
  }
  const data1 = await new Show().get_najieData(player_data)
  return await puppeteer.screenshot('najie', {
    ...data1
  })
}

/**
 * 返回境界列表图片
 * @return image
 */
export async function get_state_img(e, all_level) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let Level_id = player.level_id
  let Level_list = data.Level_list
  //循环删除表信息
  if (!all_level) {
    for (let i = 1; i <= 60; i++) {
      if (i > Level_id - 6 && i < Level_id + 6) {
        continue
      }
      Level_list = await Level_list.filter((item) => item.level_id != i)
    }
  }
  let state_data = {
    user_id: usr_qq,
    Level_list: Level_list
  }
  const data1 = await new Show().get_stateData(state_data)
  return await puppeteer.screenshot('state', {
    ...data1
  })
}

export async function get_statezhiye_img(e, all_level) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let Level_id = player.occupation_level
  let Level_list = data.occupation_exp_list
  //循环删除表信息
  if (!all_level) {
    for (let i = 0; i <= 60; i++) {
      if (i > Level_id - 6 && i < Level_id + 6) {
        continue
      }
      Level_list = await Level_list.filter((item) => item.id != i)
    }
  }
  let state_data = {
    user_id: usr_qq,
    Level_list: Level_list
  }
  const data1 = await new Show().get_stateDatazhiye(state_data)
  return await puppeteer.screenshot('statezhiye', {
    ...data1
  })
}

/**
 * 返回境界列表图片
 * @return image
 */
export async function get_statemax_img(e, all_level) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let Level_id = player.Physique_id
  let LevelMax_list = data.LevelMax_list
  //循环删除表信息
  if (!all_level) {
    for (let i = 1; i <= 60; i++) {
      if (i > Level_id - 6 && i < Level_id + 6) {
        continue
      }
      LevelMax_list = await LevelMax_list.filter((item) => item.level_id != i)
    }
  }
  let statemax_data = {
    user_id: usr_qq,
    LevelMax_list: LevelMax_list
  }
  const data1 = await new Show().get_statemaxData(statemax_data)
  return await puppeteer.screenshot('statemax', {
    ...data1
  })
}

export async function get_talent_img(e) {
  let usr_qq = e.user_id
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let player = await data.getData('player', usr_qq)
  let Level_id = player.Physique_id
  let talent_list = data.talent_list
  let talent_data = {
    user_id: usr_qq,
    talent_list: talent_list
  }
  const data1 = await new Show().get_talentData(talent_data)
  return await puppeteer.screenshot('talent', {
    ...data1
  })
}

/**
 * 返回修仙设置
 * @return image
 */
export async function get_adminset_img(e) {
  const cf = getConfig('xiuxian', 'xiuxian')
  let adminset = {
    //CD：分
    CDassociation: cf.CD.association,
    CDjoinassociation: cf.CD.joinassociation,
    CDassociationbattle: cf.CD.associationbattle,
    CDrob: cf.CD.rob,
    CDgambling: cf.CD.gambling,
    CDcouple: cf.CD.couple,
    CDgarden: cf.CD.garden,
    CDlevel_up: cf.CD.level_up,
    CDsecretplace: cf.CD.secretplace,
    CDtimeplace: cf.CD.timeplace,
    CDforbiddenarea: cf.CD.forbiddenarea,
    CDreborn: cf.CD.reborn,
    CDtransfer: cf.CD.transfer,
    CDhonbao: cf.CD.honbao,
    CDboss: cf.CD.boss,
    //手续费
    percentagecost: cf.percentage.cost,
    percentageMoneynumber: cf.percentage.Moneynumber,
    percentagepunishment: cf.percentage.punishment,
    //出千控制
    sizeMoney: cf.size.Money,
    //开关
    switchplay: cf.switch.play,
    switchMoneynumber: cf.switch.play,
    switchcouple: cf.switch.couple,
    switchXiuianplay_key: cf.switch.Xiuianplay_key,
    //倍率
    biguansize: cf.biguan.size,
    biguantime: cf.biguan.time,
    biguancycle: cf.biguan.cycle,
    //
    worksize: cf.work.size,
    worktime: cf.work.time,
    workcycle: cf.work.cycle,

    //出金倍率
    SecretPlaceone: cf.SecretPlace.one,
    SecretPlacetwo: cf.SecretPlace.two,
    SecretPlacethree: cf.SecretPlace.three
  }
  const data1 = await new Show().get_adminsetData(adminset)
  return await puppeteer.screenshot('adminset', {
    ...data1
  })
}

export async function get_ranking_power_img(e, Data, usr_paiming, thisplayer) {
  let usr_qq = e.user_id
  let level = data.Level_list.find(
    (item) => item.level_id == thisplayer.level_id
  ).level
  let ranking_power_data = {
    user_id: usr_qq,
    mdz: thisplayer.魔道值,
    nickname: thisplayer.name,
    exp: thisplayer.now_exp,
    level: level,
    usr_paiming: usr_paiming,
    allplayer: Data
  }
  const data1 = await new Show().get_ranking_powerData(ranking_power_data)
  return await puppeteer.screenshot('ranking_power', {
    ...data1
  })
}

export async function get_ranking_money_img(
  e,
  Data,
  usr_paiming,
  thisplayer,
  thisnajie
) {
  let usr_qq = e.user_id
  const najie_lingshi = Math.trunc(thisnajie.灵石)
  const lingshi = Math.trunc(thisplayer.灵石 + thisnajie.灵石)
  let ranking_money_data = {
    user_id: usr_qq,
    nickname: thisplayer.name,
    lingshi: lingshi,
    najie_lingshi: najie_lingshi,
    usr_paiming: usr_paiming,
    allplayer: Data
  }
  const data1 = await new Show().get_ranking_moneyData(ranking_money_data)
  return await puppeteer.screenshot('ranking_money', {
    ...data1
  })
}
