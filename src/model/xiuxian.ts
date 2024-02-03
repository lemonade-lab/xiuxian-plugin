import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync
} from 'fs'
import { join } from 'path'
import data from './XiuxianData.js'
import { Writeit, Read_it } from './duanzaofu.js'
import { AppName } from '../../config.js'
import { __PATH } from './PATH.js'

/**
 * 检查存档是否存在，存在返回true;
 * @param usr_qq
 * @returns
 */
export async function existplayer(usr_qq) {
  let exist_player
  exist_player = existsSync(`${__PATH.player_path}/${usr_qq}.json`)
  if (exist_player) {
    return true
  }
  return false
}

/**
 *
 * @param amount
 * @returns
 */
export async function convert2integer(amount) {
  let number = 1
  let reg = new RegExp(/^[1-9][0-9]{0,12}$/)
  if (!reg.test(amount)) {
    return number
  } else {
    return parseInt(amount)
  }
}

/**
 *
 * @returns
 */
export async function Read_updata_log() {
  let dir = join(`${__PATH.updata_log_path}`)
  let update_log = readFileSync(dir, 'utf8')
  return update_log
}

/**
 * 读取存档信息，返回成一个JavaScript对象
 * @param usr_qq
 * @returns
 */
export async function Read_player(usr_qq) {
  let dir = join(`${__PATH.player_path}/${usr_qq}.json`)
  let player = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  player = JSON.parse(decodeURIComponent(player))
  return player
}

/**
 *
 * @param e
 * @param power_n
 * @param power_m
 * @param power_Grade
 * @param aconut
 * @returns
 */
export async function LevelTask(e, power_n, power_m, power_Grade, aconut) {
  let usr_qq = e.user_id
  let msg = [segment.at(Number(usr_qq))]
  //用户信息
  let player = await Read_player(usr_qq)
  //当前系数计算
  let power_distortion = await dujie(usr_qq)
  const yaocaolist = ['凝血草', '小吉祥草', '大吉祥草']
  for (const j in yaocaolist) {
    const num = await exist_najie_thing(usr_qq, yaocaolist[j], '草药')
    if (num) {
      msg.push(`[${yaocaolist[j]}]为你提高了雷抗\n`)
      power_distortion = Math.trunc(power_distortion * (1 + 0.2 * j))
      await Add_najie_thing(usr_qq, yaocaolist[j], '草药', -1)
    }
    let variable = Math.random() * (power_m - power_n) + power_n
    //根据雷伤害的次数畸变.最高可达到+1.2
    variable = variable + aconut / 10
    variable = Number(variable)
    //对比系数
    if (power_distortion >= variable) {
      //判断目前是第几雷，第九就是过了
      if (aconut >= power_Grade) {
        player.power_place = 0
        await Write_player(usr_qq, player)
        msg.push(
          '\n' +
            player.名号 +
            '成功度过了第' +
            aconut +
            '道雷劫！可以#登仙，飞升仙界啦！'
        )
        e.reply(msg)
        return 0
      } else {
        //血量计算根据雷来计算！
        let act = variable - power_n
        act = act / (power_m - power_n)
        player.当前血量 = Math.trunc(player.当前血量 - player.当前血量 * act)
        await Write_player(usr_qq, player)
        msg.push(
          '\n本次雷伤：' +
            variable.toFixed(2) +
            '\n本次雷抗：' +
            power_distortion +
            '\n' +
            player.名号 +
            '成功度过了第' +
            aconut +
            '道雷劫！\n下一道雷劫在一分钟后落下！'
        )
        e.reply(msg)
        return 1
      }
    } else {
      //血量情况
      player.当前血量 = 1
      //扣一半修为
      player.修为 = Math.trunc(player.修为 * 0.5)
      player.power_place = 1
      await Write_player(usr_qq, player)
      //未挡住雷杰
      msg.push(
        '\n本次雷伤' +
          variable.toFixed(2) +
          '\n本次雷抗：' +
          power_distortion +
          '\n第' +
          aconut +
          '道雷劫落下了，可惜' +
          player.名号 +
          '未能抵挡，渡劫失败了！'
      )
      e.reply(msg)
      return 0
    }
  }
}

/**
 * 写入存档信息,第二个参数是一个JavaScript对象
 * @param usr_qq
 * @param player
 * @returns
 */
export async function Write_player(usr_qq, player) {
  let dir = join(__PATH.player_path, `${usr_qq}.json`)
  let new_ARR = JSON.stringify(player)
  writeFileSync(dir, new_ARR, 'utf8')
  return
}

//读取装备信息，返回成一个JavaScript对象

/**
 *
 * @param usr_qq
 * @returns
 */
export async function Read_equipment(usr_qq) {
  let dir = join(`${__PATH.equipment_path}/${usr_qq}.json`)
  let equipment = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  equipment = JSON.parse(equipment)
  return equipment
}

//写入装备信息,第二个参数是一个JavaScript对象

/**
 *
 * @param usr_qq
 * @param equipment
 * @returns
 */
export async function Write_equipment(usr_qq, equipment) {
  let player = await Read_player(usr_qq)
  player.攻击 =
    data.Level_list.find((item) => item.level_id == player.level_id).基础攻击 +
    player.攻击加成 +
    data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
      .基础攻击
  player.防御 =
    data.Level_list.find((item) => item.level_id == player.level_id).基础防御 +
    player.防御加成 +
    data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
      .基础防御
  player.血量上限 =
    data.Level_list.find((item) => item.level_id == player.level_id).基础血量 +
    player.生命加成 +
    data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
      .基础血量
  player.暴击率 =
    data.Level_list.find((item) => item.level_id == player.level_id).基础暴击 +
    data.LevelMax_list.find((item) => item.level_id == player.Physique_id)
      .基础暴击
  let type = ['武器', '护具', '法宝']
  for (let i of type) {
    if (
      equipment[i].atk > 10 ||
      equipment[i].def > 10 ||
      equipment[i].HP > 10
    ) {
      player.攻击 += equipment[i].atk
      player.防御 += equipment[i].def
      player.血量上限 += equipment[i].HP
    } else {
      player.攻击 = Math.trunc(player.攻击 * (1 + equipment[i].atk))
      player.防御 = Math.trunc(player.防御 * (1 + equipment[i].def))
      player.血量上限 = Math.trunc(player.血量上限 * (1 + equipment[i].HP))
    }
    player.暴击率 += equipment[i].bao
  }
  player.暴击伤害 = player.暴击率 + 1.5
  if (player.暴击伤害 > 2.5) player.暴击伤害 = 2.5
  if (player.仙宠.type == '暴伤') player.暴击伤害 += player.仙宠.加成
  await Write_player(usr_qq, player)
  await Add_HP(usr_qq, 0)
  let dir = join(__PATH.equipment_path, `${usr_qq}.json`)
  let new_ARR = JSON.stringify(equipment, '', '\t')
  writeFileSync(dir, new_ARR, 'utf8')
  return
}

//读取纳戒信息，返回成一个JavaScript对象

/**
 *
 * @param usr_qq
 * @returns
 */
export async function Read_najie(usr_qq) {
  let dir = join(`${__PATH.najie_path}/${usr_qq}.json`)
  let najie = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  try {
    najie = JSON.parse(najie)
  } catch {
    //转换不了，纳戒错误
    await fixed(usr_qq)
    najie = await Read_najie(usr_qq)
  }
  return najie
}

export async function fixed(usr_qq) {
  copyFileSync(
    `${__PATH.auto_backup}/najie/${usr_qq}.json`,
    `${__PATH.najie_path}/${usr_qq}.json`
  )
  return
}

/**
 * @description: 进度条渲染
 * @param {Number} res 百分比小数
 * @return {*} css样式
 */
function Strand(now, max) {
  let num = ((now / max) * 100).toFixed(0)
  let mini
  if (num > 100) {
    mini = 100
  } else {
    mini = num
  }
  let strand = {
    style: `style=width:${mini}%`,
    num: num
  }
  return strand
}

/**
 * 大数字转换，将大额数字转换为万、千万、亿等
 * @param value 数字值
 */
export function bigNumberTransform(value) {
  const newValue = ['', '', '']
  let fr = 1000
  let num = 3
  let text1 = ''
  let fm = 1
  while (value / fr >= 1) {
    fr *= 10
    num += 1
    // console.log('数字', value / fr, 'num:', num)
  }
  if (num <= 4) {
    // 千
    newValue[0] = parseInt(value / 1000) + ''
    newValue[1] = '千'
  } else if (num <= 8) {
    // 万
    text1 = parseInt(num - 4) / 3 > 1 ? '千万' : '万'
    // tslint:disable-next-line:no-shadowed-variable
    fm = text1 === '万' ? 10000 : 10000000
    if (value % fm === 0) {
      newValue[0] = parseInt(value / fm) + ''
    } else {
      newValue[0] = parseFloat(value / fm).toFixed(2) + ''
    }
    newValue[1] = text1
  } else if (num <= 16) {
    // 亿
    text1 = (num - 8) / 3 > 1 ? '千亿' : '亿'
    text1 = (num - 8) / 4 > 1 ? '万亿' : text1
    text1 = (num - 8) / 7 > 1 ? '千万亿' : text1
    // tslint:disable-next-line:no-shadowed-variable
    fm = 1
    if (text1 === '亿') {
      fm = 100000000
    } else if (text1 === '千亿') {
      fm = 100000000000
    } else if (text1 === '万亿') {
      fm = 1000000000000
    } else if (text1 === '千万亿') {
      fm = 1000000000000000
    }
    if (value % fm === 0) {
      newValue[0] = parseInt(value / fm) + ''
    } else {
      newValue[0] = parseFloat(value / fm).toFixed(2) + ''
    }
    newValue[1] = text1
  }
  if (value < 1000) {
    newValue[0] = value + ''
    newValue[1] = ''
  }
  return newValue.join('')
}

/**
 * 计算战力
 */
export function GetPower(atk, def, hp, bao) {
  let power = (atk + def * 0.8 + hp * 0.6) * (bao + 1)
  power = parseInt(power)
  return power
}
/**
 * 增加减少纳戒内物品
 * @param usr_qq 操作存档的qq号
 * @param thing_name  仙宠名称
 * @param n  操作的数量,取+增加,取 -减少
 * @param thing_level  仙宠等级
 * @returns 无
 */
export async function Add_仙宠(usr_qq, thing_name, n, thing_level = null) {
  let x = Number(n)
  if (x == 0) {
    return
  }
  let najie = await Read_najie(usr_qq)
  let trr = najie.仙宠.find(
    (item) => item.name == thing_name && item.等级 == thing_level
  )
  let name = thing_name
  if (x > 0 && !isNotNull(trr)) {
    //无中生有
    let newthing = data.xianchon.find((item) => item.name == name)
    if (!isNotNull(newthing)) {
      console.log('没有这个东西')
      return
    }
    if (thing_level != null) {
      newthing.等级 = thing_level
    }
    najie.仙宠.push(newthing)
    najie.仙宠.find(
      (item) => item.name == name && item.等级 == newthing.等级
    ).数量 = x
    let xianchon = najie.仙宠.find(
      (item) => item.name == name && item.等级 == newthing.等级
    )
    najie.仙宠.find(
      (item) => item.name == name && item.等级 == newthing.等级
    ).加成 = xianchon.等级 * xianchon.每级增加
    najie.仙宠.find(
      (item) => item.name == name && item.等级 == newthing.等级
    ).islockd = 0
    await Write_najie(usr_qq, najie)
    return
  }
  najie.仙宠.find((item) => item.name == name && item.等级 == trr.等级).数量 +=
    x
  if (
    najie.仙宠.find((item) => item.name == name && item.等级 == trr.等级).数量 <
    1
  ) {
    //假如用完了,需要删掉数组中的元素,用.filter()把!=该元素的过滤出来
    najie.仙宠 = najie.仙宠.filter(
      (item) => item.name != thing_name || item.等级 != trr.等级
    )
  }
  await Write_najie(usr_qq, najie)
  return
}

//图开关
export async function setu(e) {
  e.reply(
    `玩命加载图片中,请稍后...   ` +
      '\n(一分钟后还没有出图片,大概率被夹了,这个功能谨慎使用,机器人容易寄)'
  )
  let url
  //setu接口地址
  url = 'https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0'
  let msg = []
  let res
  //
  try {
    let response = await fetch(url)
    res = await response.json()
  } catch (error) {
    console.log('Request Failed', error)
  }
  if (res !== '{}') {
    console.log('res不为空')
  } else {
    console.log('res为空')
  }
  let link = res.data[0].urls.original //获取图链
  link = link.replace('pixiv.cat', 'pixiv.re') //链接改为国内可访问的域名
  let pid = res.data[0].pid //获取图片ID
  let uid = res.data[0].uid //获取画师ID
  let title = res.data[0].title //获取图片名称
  let author = res.data[0].author //获取画师名称
  let px = res.data[0].width + '*' + res.data[0].height //获取图片宽高
  msg.push(
    'User: ' +
      author +
      '\nUid: ' +
      uid +
      '\nTitle: ' +
      title +
      '\nPid: ' +
      pid +
      '\nPx: ' +
      px +
      '\nLink: ' +
      link
  )
  await sleep(1000)
  //最后回复消息
  e.reply(segment.image(link))
  //
  await ForwardMsg(e, msg)
  //返回true 阻挡消息不再往下
  return true
}

//改变数据格式
export async function datachange(data) {
  if (data / 1000000000000 > 1) {
    return Math.floor((data * 100) / 1000000000000) / 100 + '万亿'
  } else if (data / 100000000 > 1) {
    return Math.floor((data * 100) / 100000000) / 100 + '亿'
  } else if (data / 10000 > 1) {
    return Math.floor((data * 100) / 10000) / 100 + '万'
  } else {
    return data
  }
}
//写入纳戒信息,第二个参数是一个JavaScript对象
export async function Write_najie(usr_qq, najie) {
  let dir = join(__PATH.najie_path, `${usr_qq}.json`)
  let new_ARR = JSON.stringify(najie)
  writeFileSync(dir, new_ARR, 'utf8')
  return
}

//修为数量和灵石数量正增加,负减少
//使用时记得加await
export async function Add_灵石(usr_qq, 灵石数量 = 0) {
  let player = await Read_player(usr_qq)
  player.灵石 += Math.trunc(灵石数量)
  await Write_player(usr_qq, player)
  return
}

export async function Add_修为(usr_qq, 修为数量 = 0) {
  let player = await Read_player(usr_qq)
  player.修为 += Math.trunc(修为数量)
  await Write_player(usr_qq, player)
  return
}
export async function Add_魔道值(usr_qq, 魔道值 = 0) {
  let player = await Read_player(usr_qq)
  player.魔道值 += Math.trunc(魔道值)
  await Write_player(usr_qq, player)
  return
}
export async function Add_血气(usr_qq, 血气 = 0) {
  let player = await Read_player(usr_qq)
  player.血气 += Math.trunc(血气)
  await Write_player(usr_qq, player)
  return
}
export async function Add_HP(usr_qq, blood = 0) {
  let player = await Read_player(usr_qq)
  player.当前血量 += Math.trunc(blood)
  if (player.当前血量 > player.血量上限) {
    player.当前血量 = player.血量上限
  }
  if (player.当前血量 < 0) {
    player.当前血量 = 0
  }
  await Write_player(usr_qq, player)
  return
}
/**
 *
 * @param {*} usr_qq 用户qq
 * @param {*} exp 经验值
 * @returns
 */
export async function Add_职业经验(usr_qq, exp = 0) {
  let player = await Read_player(usr_qq)
  if (exp == 0) {
    return
  }
  exp = player.occupation_exp + exp
  let level = player.occupation_level
  while (true) {
    let need_exp = data.occupation_exp_list.find(
      (item) => item.id == level
    ).experience
    if (need_exp > exp) {
      break
    } else {
      exp -= need_exp
      level++
    }
  }
  player.occupation_exp = exp
  player.occupation_level = level
  await Write_player(usr_qq, player)
  return
}

export async function Add_najie_灵石(usr_qq, lingshi) {
  let najie = await Read_najie(usr_qq)
  najie.灵石 += Math.trunc(lingshi)
  await Write_najie(usr_qq, najie)
  return
}

export async function Add_player_学习功法(usr_qq, gongfa_name) {
  let player = await Read_player(usr_qq)
  player.学习的功法.push(gongfa_name)
  data.setData('player', usr_qq, player)
  await player_efficiency(usr_qq)
  return
}

export async function Reduse_player_学习功法(usr_qq, gongfa_name) {
  let player = await Read_player(usr_qq)
  Array.prototype.remove = function (v) {
    for (let i = 0, j = 0; i < this.length; i++) {
      if (this[i] != v) {
        this[j++] = this[i]
      }
    }
    this.length -= 1
  }
  player.学习的功法.remove(gongfa_name)
  data.setData('player', usr_qq, player)
  await player_efficiency(usr_qq)
  return
}

//---------------------------------------------分界线------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//修炼效率综合
export async function player_efficiency(usr_qq) {
  //这里有问题
  let player = await data.getData('player', usr_qq) //修仙个人信息
  let ass
  let Assoc_efficiency //宗门效率加成
  let linggen_efficiency //灵根效率加成
  let gongfa_efficiency = 0 //功法效率加成
  let xianchong_efficiency = 0 // 仙宠效率加成
  if (!isNotNull(player.宗门)) {
    //是否存在宗门信息
    Assoc_efficiency = 0 //不存在，宗门效率为0
  } else {
    ass = await data.getAssociation(player.宗门.宗门名称) //修仙对应宗门信息
    if (ass.宗门驻地 == 0) {
      Assoc_efficiency = ass.宗门等级 * 0.05
    } else {
      let dongTan = await data.bless_list.find(
        (item) => item.name == ass.宗门驻地
      )
      try {
        Assoc_efficiency = ass.宗门等级 * 0.05 + dongTan.efficiency
      } catch {
        Assoc_efficiency = ass.宗门等级 * 0.05 + 0.5
      }
    }
  }
  linggen_efficiency = player.灵根.eff //灵根修炼速率
  label1: for (let i in player.学习的功法) {
    //存在功法，遍历功法加成
    let gongfa = ['gongfa_list', 'timegongfa_list']
    //这里是查看了功法表
    for (let j of gongfa) {
      let ifexist = data[j].find((item) => item.name == player.学习的功法[i])
      if (ifexist) {
        gongfa_efficiency += ifexist.修炼加成
        continue label1
      }
    }
    player.学习的功法.splice(i, 1)
  }
  if (player.仙宠.type == '修炼') {
    // 是否存在修炼仙宠
    xianchong_efficiency = player.仙宠.加成 // 存在修炼仙宠，仙宠效率为仙宠效率加成
  }
  let dy = await Read_danyao(usr_qq)
  let bgdan = dy.biguanxl
  if (parseInt(player.修炼效率提升) != parseInt(player.修炼效率提升)) {
    player.修炼效率提升 = 0
  }

  player.修炼效率提升 =
    linggen_efficiency +
    Assoc_efficiency +
    gongfa_efficiency +
    xianchong_efficiency +
    bgdan //修炼效率综合
  data.setData('player', usr_qq, player)
  return
}
/**
 *
 * @param {*} usr_qq 玩家qq
 * @param {*} thing_name 物品名
 * @param {*} thing_class 物品类别
 * @param {*} thing_pinji 可选参数，装备品阶，数字0-6等
 * @returns 物品数量或者false
 */

//修改纳戒物品锁定状态
export async function re_najie_thing(
  usr_qq,
  thing_name,
  thing_class,
  thing_pinji,
  lock
) {
  let najie = await Read_najie(usr_qq)
  if (thing_class == '装备' && (thing_pinji || thing_pinji == 0)) {
    for (let i of najie['装备']) {
      if (i.name == thing_name && i.pinji == thing_pinji) i.islockd = lock
    }
  } else {
    for (let i of najie[thing_class]) {
      if (i.name == thing_name) i.islockd = lock
    }
  }
  await Write_najie(usr_qq, najie)
  return true
}

//检查纳戒内物品是否存在
//判断物品
//要用await
export async function exist_najie_thing(
  usr_qq,
  thing_name,
  thing_class,
  thing_pinji = 0
) {
  let najie = await Read_najie(usr_qq)
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
      '功法',
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
/**
 *
 * @param {*} usr_qq 用户qq
 * @param {*} thing_name 物品名
 * @param {*} thing_class 物品类别
 * @param {*} thing_pinji 品级 数字0-6
 * @returns
 */

/**
 * 增加减少纳戒内物品
 * @param usr_qq 操作存档的qq号
 * @param name  物品名称
 * @param thing_class  物品类别
 * @param x  操作的数量,取+增加,取 -减少
 * @param pinji 品级 数字0-6
 * @returns 无
 */
export async function Add_najie_thing(usr_qq, name, thing_class, x, pinji = 0) {
  if (x == 0) return
  let najie = await Read_najie(usr_qq)
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
            await Write_najie(usr_qq, najie)
            return
          }
        }
      } else {
        if (!name.pinji) name.pinji = pinji
        name.数量 = x
        name.islockd = 0
        najie[thing_class].push(name)
        await Write_najie(usr_qq, najie)
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
    await Write_najie(usr_qq, najie)
    return
  } else if (thing_class == '仙宠') {
    if (x > 0) {
      if (typeof name != 'object') {
        let thing = data.xianchon.find((item) => item.name == name)
        if (thing) {
          thing = JSON.parse(JSON.stringify(thing))
          thing.数量 = x
          thing.islockd = 0
          najie[thing_class].push(thing)
          await Write_najie(usr_qq, najie)
          return
        }
      } else {
        name.数量 = x
        name.islockd = 0
        najie[thing_class].push(name)
        await Write_najie(usr_qq, najie)
        return
      }
    }
    if (typeof name != 'object') {
      najie[thing_class].find((item) => item.name == name).数量 += x
    } else {
      najie[thing_class].find((item) => item.name == name.name).数量 += x
    }
    najie.仙宠 = najie.仙宠.filter((item) => item.数量 > 0)
    await Write_najie(usr_qq, najie)
    return
  }
  let exist = await exist_najie_thing(usr_qq, name, thing_class)
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
        await Write_najie(usr_qq, najie)
        return
      }
    }
  }
  najie[thing_class].find((item) => item.name == name).数量 += x
  najie[thing_class] = najie[thing_class].filter((item) => item.数量 > 0)
  await Write_najie(usr_qq, najie)
  return
}

//替换装备
export async function instead_equipment(usr_qq, equipment_data) {
  //装备name
  await Add_najie_thing(
    usr_qq,
    equipment_data,
    '装备',
    -1,
    equipment_data.pinji
  )
  let equipment = await Read_equipment(usr_qq)
  if (equipment_data.type == '武器') {
    //把读取装备，把武器放回戒指
    await Add_najie_thing(
      usr_qq,
      equipment.武器,
      '装备',
      1,
      equipment.武器.pinji
    )
    //根据名字找武器
    equipment.武器 = equipment_data
    //武器写入装备
    await Write_equipment(usr_qq, equipment)
    return
  }
  if (equipment_data.type == '护具') {
    await Add_najie_thing(
      usr_qq,
      equipment.护具,
      '装备',
      1,
      equipment.护具.pinji
    )
    equipment.护具 = equipment_data
    await Write_equipment(usr_qq, equipment)
    return
  }
  if (equipment_data.type == '法宝') {
    await Add_najie_thing(
      usr_qq,
      equipment.法宝,
      '装备',
      1,
      equipment.法宝.pinji
    )
    equipment.法宝 = equipment_data
    await Write_equipment(usr_qq, equipment)
    return
  }
  return
}
export async function dujie(user_qq) {
  let usr_qq = user_qq
  let player = await Read_player(usr_qq)
  //根据当前血量才算
  //计算系数
  let new_blood = player.当前血量
  let new_defense = player.防御
  let new_attack = player.攻击
  //渡劫期基础血量为1600000。防御800000，攻击800000
  new_blood = new_blood / 100000
  new_defense = new_defense / 100000
  new_attack = new_attack / 100000
  //取值比例4.6.2
  new_blood = (new_blood * 4) / 10
  new_defense = (new_defense * 6) / 10
  new_attack = (new_attack * 2) / 10
  //基础厚度
  let N = new_blood + new_defense
  //你的系数
  let x = N * new_attack
  //系数只取到后两位
  //灵根加成
  if (player.灵根.type == '真灵根') {
    x = x * (1 + 0.5)
  } else if (player.灵根.type == '天灵根') {
    x = x * (1 + 0.75)
  } else {
    x = x * (1 + 1)
  }
  x = x.toFixed(2)
  return x
}
//发送转发消息
//输入data一个数组,元素是字符串,每一个元素都是一条消息.
export async function ForwardMsg(e, data) {
  let msgList = []
  for (let i of data) {
    msgList.push({
      message: i,
      nickname: Bot.nickname,
      user_id: Bot.uin
    })
  }
  if (msgList.length == 1) {
    await e.reply(msgList[0].message)
  } else {
    await e.reply(await Bot.makeForwardMsg(msgList))
  }
  return
}

//对象数组排序
export function sortBy(field) {
  //从大到小,b和a反一下就是从小到大
  return function (b, a) {
    return a[field] - b[field]
  }
}

//获取总修为
export async function Get_xiuwei(usr_qq) {
  let player = await Read_player(usr_qq)
  let sum_exp = 0
  let now_level_id
  if (!isNotNull(player.level_id)) {
    return
  }
  now_level_id = data.Level_list.find(
    (item) => item.level_id == player.level_id
  ).level_id
  if (now_level_id < 65) {
    for (let i = 1; i < now_level_id; i++) {
      sum_exp = sum_exp + data.Level_list.find((temp) => temp.level_id == i).exp
    }
  } else {
    sum_exp = -999999999
  } //说明玩家境界有错误
  sum_exp += player.修为
  return sum_exp
}

//获取随机灵根
export async function get_random_talent() {
  let talent
  if (get_random_res(体质概率)) {
    talent = data.talent_list.filter((item) => item.type == '体质')
  } else if (get_random_res(伪灵根概率 / (1 - 体质概率))) {
    talent = data.talent_list.filter((item) => item.type == '伪灵根')
  } else if (get_random_res(真灵根概率 / (1 - 伪灵根概率 - 体质概率))) {
    talent = data.talent_list.filter((item) => item.type == '真灵根')
  } else if (
    get_random_res(天灵根概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率))
  ) {
    talent = data.talent_list.filter((item) => item.type == '天灵根')
  } else if (
    get_random_res(
      圣体概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率 - 天灵根概率)
    )
  ) {
    talent = data.talent_list.filter((item) => item.type == '圣体')
  } else {
    talent = data.talent_list.filter((item) => item.type == '变异灵根')
  }
  let newtalent = get_random_fromARR(talent)
  return newtalent
}

/**
 * 输入概率随机返回布尔类型数据
 * @param P 概率
 * @returns 随机返回 false or true
 */
export function get_random_res(P) {
  if (P > 1) {
    P = 1
  }
  if (P < 0) {
    P = 0
  }
  let rand = Math.random()
  if (rand < P) {
    return true
  }
  return false
}

/**
 * 输入数组随机返回其中一个
 * @param ARR 输入的数组
 * @returns 随机返回一个元素
 */
export function get_random_fromARR(ARR) {
  //let L = ARR.length;
  let randindex = Math.trunc(Math.random() * ARR.length)
  return ARR[randindex]
}

//sleep
export async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

// 时间转换
export function timestampToTime(timestamp) {
  //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let date = new Date(timestamp)
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  let D = date.getDate() + ' '
  let h = date.getHours() + ':'
  let m = date.getMinutes() + ':'
  let s = date.getSeconds()
  return Y + M + D + h + m + s
}

//根据时间戳获取年月日时分秒
export async function shijianc(time) {
  let dateobj = {}
  let date = new Date(time)
  dateobj.Y = date.getFullYear()
  dateobj.M = date.getMonth() + 1
  dateobj.D = date.getDate()
  dateobj.h = date.getHours()
  dateobj.m = date.getMinutes()
  dateobj.s = date.getSeconds()
  return dateobj
}

//获取上次签到时间
export async function getLastsign(usr_qq) {
  //查询redis中的人物动作
  let time = await redis.get('xiuxian@1.4.0:' + usr_qq + ':lastsign_time')
  if (time != null) {
    let data = await shijianc(parseInt(time))
    return data
  }
  return false
}
//获取当前人物状态
export async function getPlayerAction(usr_qq) {
  //查询redis中的人物动作
  let arr = {}
  let action = await redis.get('xiuxian@1.4.0:' + usr_qq + ':action')
  action = JSON.parse(action)
  //动作不为空闲
  if (action != null) {
    //人物有动作查询动作结束时间
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

//锁定
export async function dataverification(e) {
  if (!e.isGroup) {
    //禁私聊
    return 1
  }
  let usr_qq = e.user_id
  if (usr_qq == 80000000) {
    //非匿名
    return 1
  }
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) {
    //无存档
    return 1 //假
  }
  //真
  return 0
}

/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @returns
 */
export function isNotNull(obj) {
  if (obj == undefined || obj == null) return false
  return true
}

export function isNotBlank(value) {
  if (value ?? '' !== '') {
    return true
  } else {
    return false
  }
}

export async function Read_qinmidu() {
  let dir = join(`${__PATH.qinmidu}/qinmidu.json`)
  let qinmidu = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  qinmidu = JSON.parse(qinmidu)
  return qinmidu
}

export async function Write_qinmidu(qinmidu) {
  let dir = join(__PATH.qinmidu, `qinmidu.json`)
  let new_ARR = JSON.stringify(qinmidu)
  writeFileSync(dir, new_ARR, 'utf8')
  return
}
export async function fstadd_qinmidu(A, B) {
  let qinmidu
  try {
    qinmidu = await Read_qinmidu()
  } catch {
    //没有表要先建立一个！
    await Write_qinmidu([])
    qinmidu = await Read_qinmidu()
  }
  let player = {
    QQ_A: A,
    QQ_B: B,
    亲密度: 0,
    婚姻: 0
  }
  qinmidu.push(player)
  await Write_qinmidu(qinmidu)
  return
}

export async function add_qinmidu(A, B, qinmi) {
  let qinmidu
  try {
    qinmidu = await Read_qinmidu()
  } catch {
    //没有表要先建立一个！
    await Write_qinmidu([])
    qinmidu = await Read_qinmidu()
  }
  let i
  for (i = 0; i < qinmidu.length; i++) {
    if (
      (qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) ||
      (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)
    ) {
      break
    }
  }
  if (i == qinmidu.length) {
    await fstadd_qinmidu(A, B)
    qinmidu = await Read_qinmidu()
  }
  qinmidu[i].亲密度 += qinmi
  await Write_qinmidu(qinmidu)
  return
}

export async function find_qinmidu(A, B) {
  let qinmidu
  try {
    qinmidu = await Read_qinmidu()
  } catch {
    //没有建立一个
    await Write_qinmidu([])
    qinmidu = await Read_qinmidu()
  }
  let i
  let QQ = []
  for (i = 0; i < qinmidu.length; i++) {
    if (qinmidu[i].QQ_A == A || qinmidu[i].QQ_A == B) {
      if (qinmidu[i].婚姻 != 0) {
        QQ.push = qinmidu[i].QQ_B
        break
      }
    } else if (qinmidu[i].QQ_B == A || qinmidu[i].QQ_B == B) {
      if (qinmidu[i].婚姻 != 0) {
        QQ.push = qinmidu[i].QQ_A
        break
      }
    }
  }
  for (i = 0; i < qinmidu.length; i++) {
    if (
      (qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) ||
      (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)
    ) {
      break
    }
  }
  if (i == qinmidu.length) {
    return false
  } else if (QQ.length != 0) {
    return 0
  } else {
    return qinmidu[i].亲密度
  }
}
//查询A的婚姻，如果有婚姻则返回对方qq，若无则返回false
export async function exist_hunyin(A) {
  let qinmidu
  try {
    qinmidu = await Read_qinmidu()
  } catch {
    //没有建立一个
    await Write_qinmidu([])
    qinmidu = await Read_qinmidu()
  }
  let i = 0
  let flag = 0
  for (i = 0; i < qinmidu.length; i++) {
    if (qinmidu[i].QQ_A == A) {
      //已婚则将A/B的另一半存到QQ数组中
      if (qinmidu[i].婚姻 != 0) {
        flag = qinmidu[i].QQ_B
        break
      }
    } else if (qinmidu[i].QQ_B == A) {
      if (qinmidu[i].婚姻 != 0) {
        flag = qinmidu[i].QQ_A
        break
      }
    }
  }
  //A存在已婚则返回对方qq
  if (flag != 0) {
    //console.log(flag);
    return flag
  } else {
    return false
  }
}

export async function Write_shitu(shitu) {
  let dir = join(__PATH.shitu, `shitu.json`)
  let new_ARR = JSON.stringify(shitu)
  writeFileSync(dir, new_ARR, 'utf8')
  return
}
export async function Read_shitu() {
  let dir = join(`${__PATH.shitu}/shitu.json`)
  let shitu = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  shitu = JSON.parse(shitu)
  return shitu
}

export async function fstadd_shitu(A) {
  let shitu
  try {
    shitu = await Read_shitu()
  } catch {
    //没有表要先建立一个！
    await Write_shitu([])
    shitu = await Read_shitu()
  }
  let player = {
    师傅: A,
    收徒: 0,
    未出师徒弟: 0,
    任务阶段: 0,
    renwu1: 0,
    renwu2: 0,
    renwu3: 0,
    师徒BOOS剩余血量: 100000000,
    已出师徒弟: []
  }
  shitu.push(player)
  await Write_shitu(shitu)
  return
}

export async function add_shitu(A, num) {
  let shitu
  try {
    shitu = await Read_shitu()
  } catch {
    //没有表要先建立一个！
    await Write_shitu([])
    shitu = await Read_shitu()
  }
  let i
  for (i = 0; i < shitu.length; i++) {
    if (shitu[i].A == A) {
      break
    }
  }
  if (i == shitu.length) {
    await fstadd_shitu(A)
    shitu = await Read_shitu()
  }
  shitu[i].收徒 += num
  await Write_shitu(shitu)
  return
}

export async function find_shitu(A) {
  let shitu
  try {
    shitu = await Read_shitu()
  } catch {
    //没有建立一个
    await Write_shitu([])
    shitu = await Read_shitu()
  }
  let i
  let QQ = []
  for (i = 0; i < shitu.length; i++) {
    if (shitu[i].师傅 == A) {
      break
    }
  }
  if (i == shitu.length) {
    return false
  } else if (QQ.length != 0) {
    return 0
  } else {
    return shitu[i].师徒
  }
}

export async function find_tudi(A) {
  let shitu
  shitu = await Read_shitu()
  let i
  let QQ = []
  for (i = 0; i < shitu.length; i++) {
    if (shitu[i].未出师徒弟 == A) {
      break
    }
  }
  if (i == shitu.length) {
    return false
  } else if (QQ.length != 0) {
    return 0
  } else {
    return shitu[i].师徒
  }
}
export async function Read_danyao(usr_qq) {
  let dir = join(`${__PATH.danyao_path}/${usr_qq}.json`)
  let danyao = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  danyao = JSON.parse(danyao)
  return danyao
}

export async function Write_danyao(usr_qq, danyao) {
  let dir = join(__PATH.danyao_path, `${usr_qq}.json`)
  let new_ARR = JSON.stringify(danyao)
  writeFileSync(dir, new_ARR, 'utf8')
  return
}

export async function Read_temp() {
  let dir = join(`${__PATH.temp_path}/temp.json`)
  let temp = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  temp = JSON.parse(temp)
  return temp
}

export async function Write_temp(temp) {
  let dir = join(__PATH.temp_path, `temp.json`)
  let new_ARR = JSON.stringify(temp)
  writeFileSync(dir, new_ARR, 'utf8')
  return
}
/**
 * 常用查询合集
 */
export async function Go(e) {
  let usr_qq = e.user_id
  //不开放私聊
  if (!e.isGroup) {
    return 0
  }
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) {
    return 0
  }
  //获取游戏状态
  let game_action = await redis.get('xiuxian@1.4.0:' + usr_qq + ':game_action')
  //防止继续其他娱乐行为
  if (game_action == 0) {
    e.reply('修仙：游戏进行中...')
    return 0
  }
  //查询redis中的人物动作
  let action = await redis.get('xiuxian@1.4.0:' + usr_qq + ':action')
  action = JSON.parse(action)
  if (action != null) {
    //人物有动作查询动作结束时间
    let action_end_time = action.end_time
    let now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      let m = parseInt((action_end_time - now_time) / 1000 / 60)
      let s = parseInt((action_end_time - now_time - m * 60 * 1000) / 1000)
      e.reply('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒')
      return 0
    }
  }
  return true
}

export async function Write_shop(shop) {
  let dir = join(__PATH.shop, `shop.json`)
  let new_ARR = JSON.stringify(shop)
  writeFileSync(dir, new_ARR, 'utf8')
  return
}

export async function Read_shop() {
  let dir = join(`${__PATH.shop}/shop.json`)
  let shop = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  shop = JSON.parse(shop)
  return shop
}
//判断是否还有物品
export async function existshop(didian) {
  let shop = await Read_shop()
  let i
  let thing = []
  for (i = 0; i < shop.length; i++) {
    if (shop[i].name == didian) {
      break
    }
  }
  for (let j = 0; j < shop[i].one.length; j++) {
    if (shop[i].one[j].数量 > 0) {
      thing.push(shop[i].one[j])
    }
  }
  if (thing.length > 0) {
    return thing
  } else {
    return false
  }
}
export async function zd_battle(AA_player, BB_player) {
  let A_player = JSON.parse(JSON.stringify(BB_player))
  let B_player = JSON.parse(JSON.stringify(AA_player))
  let cnt = 0 //回合数
  let cnt2
  let A_xue = 0 //最后要扣多少血
  let B_xue = 0
  let t
  let msg = []
  let jineng1 = data.jineng1
  let jineng2 = data.jineng2
  //隐藏灵根
  let wuxing = ['金', '木', '土', '水', '火']
  let type = ['武器', '护具', '法宝']
  if (A_player.隐藏灵根 && A_player.id) {
    let buff = 1
    let wx = []
    let equ = await Read_equipment(A_player.id)
    for (let i of wuxing) if (A_player.隐藏灵根.name.includes(i)) wx.push(i)
    for (let i of type) {
      if (equ[i].id > 0 && equ[i].id < 6) buff += kezhi(equ[i].id, wx)
    }
    A_player.攻击 = Math.trunc(A_player.攻击 * buff)
    A_player.防御 = Math.trunc(A_player.防御 * buff)
    A_player.当前血量 = Math.trunc(A_player.当前血量 * buff)
    msg.push(
      `${A_player.名号}与装备产生了共鸣,自身全属性提高${Math.trunc(
        (buff - 1) * 100
      )}%`
    )
  }
  if (B_player.隐藏灵根 && B_player.id) {
    let wx = []
    let buff = 1
    let equ = await Read_equipment(B_player.id)
    for (let i of wuxing) if (B_player.隐藏灵根.name.includes(i)) wx.push(i)
    for (let i of type) {
      if (equ[i].id > 0 && equ[i].id < 6) buff += kezhi(equ[i].id, wx)
    }
    B_player.攻击 = Math.trunc(B_player.攻击 * buff)
    B_player.防御 = Math.trunc(B_player.防御 * buff)
    B_player.当前血量 = Math.trunc(B_player.当前血量 * buff)
    msg.push(
      `${B_player.名号}与装备产生了共鸣,自身全属性提高${Math.trunc(
        (buff - 1) * 100
      )}%`
    )
  }
  if (B_player.魔道值 > 999) {
    let buff = Math.trunc(B_player.魔道值 / 1000) / 100 + 1
    if (buff > 1.3) buff = 1.3
    if (B_player.灵根.name == '九重魔功') buff += 0.2
    msg.push(
      '魔道值为' +
        B_player.名号 +
        '提供了' +
        Math.trunc((buff - 1) * 100) +
        '%的增伤'
    )
  } else if (
    B_player.魔道值 < 1 &&
    (B_player.灵根.type == '转生' || B_player.level_id > 41)
  ) {
    let buff = B_player.神石 * 0.0015
    if (buff > 0.3) buff = 0.3
    if (B_player.灵根.name == '九转轮回体') buff += 0.2
    msg.push(
      '神石为' + B_player.名号 + '提供了' + Math.trunc(buff * 100) + '%的减伤'
    )
  }
  if (A_player.魔道值 > 999) {
    let buff = Math.trunc(A_player.魔道值 / 1000) / 100 + 1
    if (buff > 1.3) buff = 1.3
    if (A_player.灵根.name == '九重魔功') buff += 0.2
    msg.push(
      '魔道值为' +
        A_player.名号 +
        '提供了' +
        Math.trunc((buff - 1) * 100) +
        '%的增伤'
    )
  } else if (
    A_player.魔道值 < 1 &&
    (A_player.灵根.type == '转生' || A_player.level_id > 41)
  ) {
    let buff = A_player.神石 * 0.0015
    if (buff > 0.3) buff = 0.3
    if (A_player.灵根.name == '九转轮回体') buff += 0.2
    msg.push(
      '神石为' + A_player.名号 + '提供了' + Math.trunc(buff * 100) + '%的减伤'
    )
  }
  while (A_player.当前血量 > 0 && B_player.当前血量 > 0) {
    cnt2 = Math.trunc(cnt / 2)
    let Random = Math.random()
    let random = Math.random()
    let buff = 1
    t = A_player
    A_player = B_player
    B_player = t
    let baoji = baojishanghai(A_player.暴击率)
    //仙宠
    if (isNotNull(A_player.仙宠)) {
      if (A_player.仙宠.type == '暴伤') baoji += A_player.仙宠.加成
      else if (A_player.仙宠.type == '战斗') {
        let ran = Math.random()
        if (ran < 0.35) {
          A_player.攻击 += Math.trunc(A_player.攻击 * A_player.仙宠.加成)
          A_player.防御 += Math.trunc(A_player.防御 * A_player.仙宠.加成)
          msg.push(
            '仙宠【' +
              A_player.仙宠.name +
              '】辅佐了[' +
              A_player.名号 +
              ']，使其伤害增加了[' +
              Math.trunc(A_player.仙宠.加成 * 100) +
              '%]'
          )
        }
      }
    }
    //武器
    if (isNotNull(A_player.id)) {
      let equipment = await Read_equipment(A_player.id)
      let ran = Math.random()
      if (equipment.武器.name == '紫云剑' && ran > 0.7) {
        A_player.攻击 *= 3
        msg.push(`${A_player.名号}触发了紫云剑被动,攻击力提高了200%`)
      } else if (equipment.武器.name == '炼血竹枪' && ran > 0.75) {
        A_player.攻击 *= 2
        A_player.当前血量 = Math.trunc(A_player.当前血量 * 1.2)
        msg.push(
          `${A_player.名号}触发了炼血竹枪被动,攻击力提高了100%,血量回复了20%`
        )
      } else if (equipment.武器.name == '少阴玉剑' && ran > 0.85) {
        A_player.当前血量 = Math.trunc(A_player.当前血量 * 1.4)
        msg.push(`${A_player.名号}触发了少阴玉剑被动,血量回复了40%`)
      }
    }
    let 伤害 = Harm(A_player.攻击 * 0.85, B_player.防御)
    let 法球伤害 = Math.trunc(A_player.攻击 * A_player.法球倍率)
    伤害 = Math.trunc(baoji * 伤害 + 法球伤害 + A_player.防御 * 0.1)
    //技能
    let count = 0 //限制次数
    for (let i = 0; i < jineng1.length; i++) {
      if (
        (jineng1[i].class == '常驻' &&
          (cnt2 == jineng1[i].cnt || jineng1[i].cnt == -1) &&
          Random < jineng1[i].pr) ||
        (A_player.学习的功法 &&
          jineng1[i].class == '功法' &&
          A_player.学习的功法.indexOf(jineng1[i].name) > -1 &&
          (cnt2 == jineng1[i].cnt || jineng1[i].cnt == -1) &&
          Random < jineng1[i].pr) ||
        (A_player.灵根 &&
          jineng1[i].class == '灵根' &&
          A_player.灵根.name == jineng1[i].name &&
          (cnt2 == jineng1[i].cnt || jineng1[i].cnt == -1) &&
          Random < jineng1[i].pr)
      ) {
        if (jineng1[i].msg2 == '') {
          msg.push(A_player.名号 + jineng1[i].msg1)
        } else {
          msg.push(
            A_player.名号 + jineng1[i].msg1 + B_player.名号 + jineng1[i].msg2
          )
        }
        伤害 = 伤害 * jineng1[i].beilv + jineng1[i].other
        count++
      }
      if (count == 3) break
    }
    for (let i = 0; i < jineng2.length; i++) {
      if (
        (B_player.学习的功法 &&
          jineng2[i].class == '功法' &&
          B_player.学习的功法.indexOf(jineng2[i].name) > -1 &&
          (cnt2 == jineng2[i].cnt || jineng2[i].cnt == -1) &&
          random < jineng2[i].pr) ||
        (B_player.灵根 &&
          jineng2[i].class == '灵根' &&
          B_player.灵根.name == jineng2[i].name &&
          (cnt2 == jineng2[i].cnt || jineng2[i].cnt == -1) &&
          random < jineng2[i].pr)
      ) {
        if (jineng2[i].msg2 == '') {
          msg.push(B_player.名号 + jineng2[i].msg1)
        } else {
          msg.push(
            B_player.名号 + jineng2[i].msg1 + A_player.名号 + jineng2[i].msg2
          )
        }
        伤害 = 伤害 * jineng2[i].beilv + jineng2[i].other
      }
    }
    if (A_player.魔道值 > 999) {
      buff += Math.trunc(A_player.魔道值 / 1000) / 100
      if (buff > 1.3) buff = 1.3
      if (A_player.灵根.name == '九重魔功') buff += 0.2
    }
    if (
      B_player.魔道值 < 1 &&
      (B_player.灵根.type == '转生' || B_player.level_id > 41)
    ) {
      let buff2 = B_player.神石 * 0.0015
      if (buff2 > 0.3) buff2 = 0.3
      if (B_player.灵根.name == '九转轮回体') buff2 += 0.2
      buff -= buff2
    }
    伤害 = Math.trunc(伤害 * buff)
    B_player.当前血量 -= 伤害
    if (B_player.当前血量 < 0) {
      B_player.当前血量 = 0
    }
    if (cnt % 2 == 0) {
      A_player.防御 = AA_player.防御
      A_player.攻击 = AA_player.攻击
    } else {
      A_player.攻击 = BB_player.攻击
      A_player.防御 = BB_player.防御
    }
    msg.push(`第${cnt2 + 1}回合：
  ${A_player.名号}攻击了${B_player.名号}，${ifbaoji(baoji)}造成伤害${伤害}，${
      B_player.名号
    }剩余血量${B_player.当前血量}`)
    cnt++
  }
  if (cnt % 2 == 0) {
    t = A_player
    A_player = B_player
    B_player = t
  }
  if (A_player.当前血量 <= 0) {
    AA_player.当前血量 = 0
    msg.push(`${BB_player.名号}击败了${AA_player.名号}`)
    B_xue = B_player.当前血量 - BB_player.当前血量
    A_xue = -AA_player.当前血量
  } else if (B_player.当前血量 <= 0) {
    BB_player.当前血量 = 0
    msg.push(`${AA_player.名号}击败了${BB_player.名号}`)
    B_xue = -BB_player.当前血量
    A_xue = A_player.当前血量 - AA_player.当前血量
  }
  let Data_nattle = { msg: msg, A_xue: A_xue, B_xue: B_xue }
  return Data_nattle
}

export function baojishanghai(baojilv) {
  if (baojilv > 1) {
    baojilv = 1
  } //暴击率最高为100%,即1
  let rand = Math.random()
  let bl = 1
  if (rand < baojilv) {
    bl = baojilv + 1.5 //这个是暴击伤害倍率//满暴击时暴伤2为50%
  }
  return bl
}
//攻击攻击防御计算伤害
export function Harm(atk, def) {
  let x
  let s = atk / def
  let rand = Math.trunc(Math.random() * 11) / 100 + 0.95 //保留±5%的伤害波动
  if (s < 1) {
    x = 0.1
  } else if (s > 2.5) {
    x = 1
  } else {
    x = 0.6 * s - 0.5
  }
  x = Math.trunc(x * atk * rand)
  return x
}
//判断克制关系
export function kezhi(equ, wx) {
  let wuxing = ['金', '木', '土', '水', '火', '金']
  let equ_wx = wuxing[equ - 1]
  //相同
  for (let j of wx) {
    if (j == equ_wx) return 0.04
  }
  //不同
  for (let j of wx)
    for (let i = 0; i < wuxing.length - 1; i++) {
      if (wuxing[i] == equ_wx && wuxing[i + 1] == j) return -0.02
    }
  return 0
}
//通过暴击伤害返回输出用的文本
export function ifbaoji(baoji) {
  if (baoji == 1) {
    return ''
  } else {
    return '触发暴击，'
  }
}
//写入交易表
export async function Write_Exchange(wupin) {
  let dir = join(__PATH.Exchange, `Exchange.json`)
  let new_ARR = JSON.stringify(wupin)
  writeFileSync(dir, new_ARR, 'utf8')
  return
}

//写入交易表
export async function Write_Forum(wupin) {
  let dir = join(__PATH.Exchange, `Forum.json`)
  let new_ARR = JSON.stringify(wupin)
  writeFileSync(dir, new_ARR, 'utf8')
  return
}

//读交易表
export async function Read_Exchange() {
  let dir = join(`${__PATH.Exchange}/Exchange.json`)
  let Exchange = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  Exchange = JSON.parse(Exchange)
  return Exchange
}

//读交易表
export async function Read_Forum() {
  let dir = join(`${__PATH.Exchange}/Forum.json`)
  let Forum = readFileSync(dir, 'utf8')
  //将字符串数据转变成数组格式
  Forum = JSON.parse(Forum)
  return Forum
}

export async function openAU() {
  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'

  const random = Math.floor(Math.random() * data.xingge[0].one.length)
  const thing_data = data.xingge[0].one[random]
  const thing_value = Math.floor(thing_data.出售价)
  const thing_amount = 1
  const now_time = new Date().getTime()
  const groupList = await redis.sMembers(redisGlKey)

  const wupin = {
    thing: thing_data,
    start_price: thing_value,
    last_price: thing_value,
    amount: thing_amount,
    last_offer_price: now_time,
    last_offer_player: 0,
    groupList
  }
  await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(wupin))
  return wupin
}

export async function jindi(e, weizhi, addres) {
  let adr = addres
  let msg = ['***' + adr + '***']
  for (let i = 0; i < weizhi.length; i++) {
    msg.push(
      weizhi[i].name +
        '\n' +
        '等级：' +
        weizhi[i].Grade +
        '\n' +
        '极品：' +
        weizhi[i].Best[0] +
        '\n' +
        '灵石：' +
        weizhi[i].Price +
        '灵石' +
        '\n' +
        '修为：' +
        weizhi[i].experience +
        '修为'
    )
  }
  await ForwardMsg(e, msg)
}

export async function Goweizhi(e, weizhi, addres) {
  let adr = addres
  let msg = ['***' + adr + '***']
  for (let i = 0; i < weizhi.length; i++) {
    msg.push(
      weizhi[i].name +
        '\n' +
        '等级：' +
        weizhi[i].Grade +
        '\n' +
        '极品：' +
        weizhi[i].Best[0] +
        '\n' +
        '灵石：' +
        weizhi[i].Price +
        '灵石'
    )
  }
  await ForwardMsg(e, msg)
}

/**
 * 增加player文件某属性的值（在原本的基础上增加）
 * @param user_qq
 * @param num 属性的value
 * @param type 修改的属性
 * @returns {Promise<void>}
 */
export async function setFileValue(user_qq, num, type) {
  let user_data = data.getData('player', user_qq)
  let current_num = user_data[type] //当前灵石数量
  let new_num = current_num + num
  if (type == '当前血量' && new_num > user_data.血量上限) {
    new_num = user_data.血量上限 //治疗血量需要判读上限
  }
  user_data[type] = new_num
  await data.setData('player', user_qq, user_data)
  return
}

export async function Synchronization_ASS(e) {
  if (!e.isMaster) {
    return
  }
  e.reply('宗门开始同步')
  let assList = []
  let files = readdirSync(
    './plugins/' + AppName + '/resources/data/association'
  ).filter((file) => file.endsWith('.json'))
  for (let file of files) {
    file = file.replace('.json', '')
    assList.push(file)
  }
  for (let ass_name of assList) {
    let ass = await data.getAssociation(ass_name)
    let player = data.getData('player', ass.宗主)
    let now_level_id = data.Level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    //补
    if (!isNotNull(ass.power)) {
      ass.power = 0
    }
    if (now_level_id < 42) {
      ass.power = 0 // 凡界
    } else {
      ass.power = 1 //  仙界
    }
    if (ass.power == 1) {
      if (ass.大阵血量 == 114514) {
        ass.大阵血量 = 1145140
      }
      let level = ass.最低加入境界
      if (level < 42) {
        ass.最低加入境界 = 42
      }
    }
    if (ass.power == 0 && ass.最低加入境界 > 41) {
      ass.最低加入境界 = 41
    }
    if (!isNotNull(ass.宗门驻地)) {
      ass.宗门驻地 = 0
    }
    if (!isNotNull(ass.宗门建设等级)) {
      ass.宗门建设等级 = 0
    }
    if (!isNotNull(ass.宗门神兽)) {
      ass.宗门神兽 = 0
    }
    if (!isNotNull(ass.副宗主)) {
      ass.副宗主 = []
    }
    await data.setAssociation(ass_name, ass)
  }

  e.reply('宗门同步结束')
  return
}

export async function synchronization(e) {
  if (!e.isMaster) {
    return
  }
  e.reply('存档开始同步')
  let playerList = []
  let files = readdirSync(
    './plugins/' + AppName + '/resources/data/xiuxian_player'
  ).filter((file) => file.endsWith('.json'))
  for (let file of files) {
    file = file.replace('.json', '')
    playerList.push(file)
  }
  for (let player_id of playerList) {
    let usr_qq = player_id
    let player = await data.getData('player', usr_qq)
    let najie = await Read_najie(usr_qq)
    let equipment = await Read_equipment(usr_qq)
    let ziduan = [
      '镇妖塔层数',
      '神魄段数',
      '魔道值',
      '师徒任务阶段',
      '师徒积分',
      'favorability',
      '血气',
      'lunhuiBH',
      'lunhui',
      '攻击加成',
      '防御加成',
      '生命加成',
      '幸运',
      '练气皮肤',
      '装备皮肤',
      'islucky',
      'sex',
      'addluckyNo',
      '神石'
    ]
    let ziduan2 = [
      'Physique_id',
      'linggenshow',
      'power_place',
      'occupation_level',
      '血量上限',
      '当前血量',
      '攻击',
      '防御'
    ]
    let ziduan3 = ['linggen', 'occupation', '仙宠']
    let ziduan4 = ['材料', '草药', '仙宠', '仙宠口粮']
    for (let k of ziduan) {
      if (!isNotNull(player[k])) {
        player[k] = 0
      }
    }
    for (let k of ziduan2) {
      if (!isNotNull(player[k])) {
        player[k] = 1
      }
    }
    for (let k of ziduan3) {
      if (!isNotNull(player[k])) {
        player[k] = []
      }
    }
    for (let k of ziduan4) {
      if (!isNotNull(najie[k])) {
        najie[k] = []
      }
    }
    if (!isNotNull(player.breakthrough)) {
      player.breakthrough = false
    }
    if (!isNotNull(player.id)) {
      player.id = usr_qq
    }
    if (!isNotNull(player.轮回点) || player.轮回点 > 10) {
      player.轮回点 = 10 - player.lunhui
    }
    try {
      await Read_danyao(usr_qq)
    } catch {
      const arr = {
        biguan: 0, //闭关状态
        biguanxl: 0, //增加效率
        xingyun: 0,
        lianti: 0,
        ped: 0,
        modao: 0,
        beiyong1: 0, //ped
        beiyong2: 0,
        beiyong3: 0,
        beiyong4: 0,
        beiyong5: 0
      }
      await Write_danyao(usr_qq, arr)
    }

    let suoding = [
      '装备',
      '丹药',
      '道具',
      '功法',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ]
    for (let j of suoding) {
      najie[j].forEach((item) => {
        if (!isNotNull(item.islockd)) {
          item.islockd = 0
        }
      })
    }
    //仙宠调整
    if (player.仙宠.id > 2930 && player.仙宠.id < 2936) {
      player.仙宠.初始加成 = 0.002
      player.仙宠.每级增加 = 0.002
      player.仙宠.加成 = player.仙宠.每级增加 * player.仙宠.等级
      player.幸运 = player.addluckyNo + player.仙宠.加成
    } else player.幸运 = player.addluckyNo
    for (let j of najie.仙宠) {
      if (j.id > 2930 && player.仙宠.id < 2936) {
        j.初始加成 = 0.002
        j.每级增加 = 0.002
      }
    }
    //装备调整
    let wuqi = ['雾切之回光', '护摩之杖', '磐岩结绿', '三圣器·朗基努斯之枪']
    let wuqi2 = ['紫云剑', '炼血竹枪', '少阴玉剑', '纯阴金枪']
    for (let j of najie.装备) {
      for (let k in wuqi) {
        if (j.name == wuqi[k]) {
          j.name = wuqi2[k]
        }
        if (equipment.武器.name == wuqi[k]) equipment.武器.name = wuqi2[k]
        if (equipment.法宝.name == wuqi[k]) equipment.法宝.name = wuqi2[k]
      }
    }
    //口粮调整
    for (let j of najie.仙宠口粮) {
      j.class = '仙宠口粮'
    }
    let linggeng = data.talent_list.find(
      (item) => item.name == player.灵根.name
    )
    if (linggeng) player.灵根 = linggeng

    //隐藏灵根
    if (player.隐藏灵根)
      player.隐藏灵根 = data.yincang.find(
        (item) => item.name == player.隐藏灵根.name
      )
    //重新根据id去重置仙门
    let now_level_id = await data.Level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    if (now_level_id < 42) {
      player.power_place = 1
    }
    await Write_najie(usr_qq, najie)
    await Write_player(usr_qq, player)
    await Write_equipment(usr_qq, equipment)
  }
  e.reply('存档同步结束')

  return
}

/**
 *
 * @param {*} thing_name 物品名
 * @returns
 */
//遍历物品
export async function foundthing(thing_name) {
  let thing = [
    'equipment_list',
    'danyao_list',
    'daoju_list',
    'gongfa_list',
    'caoyao_list',
    'timegongfa_list',
    'timeequipmen_list',
    'timedanyao_list',
    'newdanyao_list',
    'xianchon',
    'xianchonkouliang',
    'duanzhaocailiao'
  ]
  for (let i of thing) {
    for (let j of data[i]) {
      if (j.name == thing_name) return j
    }
  }
  let A
  try {
    A = await Read_it()
  } catch {
    await Writeit([])
    A = await Read_it()
  }
  for (let j of A) {
    if (j.name == thing_name) return j
  }
  thing_name = thing_name.replace(/[0-9]+/g, '')
  thing = ['duanzhaowuqi', 'duanzhaohuju', 'duanzhaobaowu', 'zalei']
  for (let i of thing) {
    for (let j of data[i]) {
      if (j.name == thing_name) return j
    }
  }
  return false
}
