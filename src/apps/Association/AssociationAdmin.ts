import {
  timestampToTime,
  shijianc,
  player_efficiency,
  convert2integer,
  setFileValue,
  data,
  宗门人数上限,
  getConfig,
  Maximum_number_of_secondary_masters,
  Upper_limit_of_inner_disciples,
  Maximum_number_of_elders,
  isNotNull
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class AssociationAdmin extends plugin {
  constructor() {
    super({
      name: 'AssociationAdmin',
      dsc: '宗门模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: /^(#|\/)开宗立派$/,
          fnc: 'Create_association'
        },
        {
          reg: /^(#|\/)(升级宗门|宗门升级)$/,
          fnc: 'lvup_association'
        },
        {
          reg: /^任命.*/,
          fnc: 'Set_appointment'
        },
        {
          reg: /^(#|\/)(宗门维护|维护宗门)$/,
          fnc: 'Maintenance'
        },
        {
          reg: /^(#|\/)查看护宗大阵$/,
          fnc: 'huz'
        },
        {
          reg: /^(#|\/)维护护宗大阵.*$/,
          fnc: 'weihu'
        },
        {
          reg: /^(#|\/)设置门槛.*$/,
          fnc: 'jiaru'
        },
        /*{
          reg: /^(#|\/)逐出师门.*$/,
          fnc: 'Deleteuser',
        },*/
        {
          reg: /^(#|\/)逐出.*$/,
          fnc: 'Deleteusermax'
        }
      ]
    })
  }

  //判断是否满足创建宗门条件
  async Create_association(e) {
    let user_id = e.user_id
    let ifexistplay = data.existData('player', user_id)
    if (!ifexistplay) return false
    let player = data.getData('player', user_id)
    let now_level_id
    now_level_id = data.Level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id

    if (now_level_id < 22) {
      e.reply('now_exp达到化神再来吧')
      return false
    }
    if (isNotNull(player.宗门)) {
      e.reply('已经有宗门了')
      return false
    }
    if (player.money < 10000) {
      e.reply('开宗立派是需要本钱the,攒到一万money再来吧')
      return false
    }

    /** 设置上下文 */
    this.setContext('Get_association_name')
    /** 回复 */
    await e.reply(
      '请发送宗门the名字,一旦设立,无法再改,请慎重取名,(宗门名字最多6个中文字符)',
      false,
      { at: true }
    )

    return false
  }

  /** 获取宗门名称 */
  async Get_association_name(e) {
    let user_id = e.user_id
    let new_msg = this.e.message
    if (new_msg[0].type != 'text') {
      this.setContext('Get_association_name')
      await this.reply('请发送文本,请重新输入:')
      return false
    }
    let association_name = new_msg[0].text
    if (association_name.length > 6) {
      this.setContext('Get_association_name')
      await this.reply('宗门名字最多只能设置6个字符,请重新输入:')
      return false
    }
    let reg = /[^\u4e00-\u9fa5]/g //汉字检验正则
    let res = reg.test(association_name)
    //res为true表示存在汉字以外the字符
    if (res) {
      this.setContext('Get_association_name')
      await this.reply('宗门名字只能使用中文,请重新输入:')
      return false
    }
    let ifexistass = data.existData('association', association_name)
    if (ifexistass) {
      this.setContext('Get_association_name')
      await this.reply('该宗门已经存在,请重新输入:')
      return false
    }

    //await this.reply('功能还在开发中,敬请期待');
    let now = new Date()
    let nowTime = now.getTime() //获取当前时间戳
    let date = timestampToTime(nowTime)
    let player = data.getData('player', user_id)
    player.宗门 = {
      宗门名称: association_name,
      职位: '宗主',
      time: [date, nowTime]
    }
    data.setData('player', user_id, player)
    await new_Association(association_name, user_id, e)
    await setFileValue(user_id, -10000, 'money')
    await this.reply('宗门创建成功')
    /** 结束上下文 */
    this.finish('Get_association_name')
    //return association_name;
  }

  //护宗大阵
  async huz(e) {
    let user_id = e.user_id
    let ifexistplay = data.existData('player', user_id)
    if (!ifexistplay) return false
    let player = data.getData('player', user_id)
    if (!isNotNull(player.宗门)) {
      e.reply('你尚未加入宗门')
      return false
    }
    let ass = data.getAssociation(player.宗门.宗门名称)
    e.reply(`护宗大阵血量:${ass.大阵血量}`)
    return false
  }
  async weihu(e) {
    let user_id = e.user_id
    let ifexistplay = data.existData('player', user_id)
    if (!ifexistplay) return false
    let player = data.getData('player', user_id)
    if (
      player.宗门.职位 == '宗主' ||
      player.宗门.职位 == '副宗主' ||
      player.宗门.职位 == '长老'
    ) {
    } else {
      e.reply('只有宗主、副宗主或长老可以操作')
      return false
    }

    if (!isNotNull(player.宗门)) {
      e.reply('你尚未加入宗门')
      return false
    }
    //获取money数量
    let reg = new RegExp(/#维护护宗大阵/)
    let lingshi = e.msg.replace(reg, '')
    //校验输入money数
    lingshi = await convert2integer(lingshi)
    let ass = data.getAssociation(player.宗门.宗门名称)
    if (ass.money池 < lingshi) {
      e.reply(`宗门money池只有${ass.money池}money,数量不足`)
      return false
    }
    let xian = 5
    if (ass.power == 1) {
      xian = 2
    }
    ass.大阵血量 += lingshi * xian
    ass.money池 -= lingshi
    await data.setAssociation(ass.宗门名称, ass)
    e.reply(
      `维护成功,宗门还有${ass.money池}money,护宗大阵增加了${lingshi * xian}血量`
    )
  }

  //升级宗门
  async lvup_association(e) {
    let user_id = e.user_id
    let ifexistplay = data.existData('player', user_id)
    if (!ifexistplay) return false
    let player = data.getData('player', user_id)
    if (!isNotNull(player.宗门)) {
      e.reply('你尚未加入宗门')
      return false
    }
    if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
      e.reply('只有宗主、副宗主可以操作')
      return false
    }
    let ass = data.getAssociation(player.宗门.宗门名称)
    if (ass.宗门等级 == 宗门人数上限.length) {
      e.reply('已经是最高等级宗门')
      return false
    }
    let xian = 1
    if (ass.power == 1) {
      xian = 10
    }
    if (ass.money池 < ass.宗门等级 * 300000 * xian) {
      e.reply(
        `本宗门目前money池中仅有${ass.money池}money,当前宗门升级需要${
          ass.宗门等级 * 300000 * xian
        }money,数量不足`
      )
      return false
    }

    ass.money池 -= ass.宗门等级 * 300000 * xian
    ass.宗门等级 += 1
    data.setData('player', user_id, player)
    data.setAssociation(ass.宗门名称, ass)
    await player_efficiency(user_id)
    e.reply(
      '宗门升级成功' +
        `当前宗门等级为${ass.宗门等级},宗门人数上限提高到:${
          宗门人数上限[ass.宗门等级 - 1]
        }`
    )
    return false
  }

  //任命职位
  async Set_appointment(e) {
    let user_id = e.user_id
    let isat = e.message.some((item) => item.type === 'at')
    //没有at信息直接返回,不执行
    if (!isat) return false
    let ifexistplay = data.existData('player', user_id)
    if (!ifexistplay) return false
    let player = await data.getData('player', user_id)
    if (!isNotNull(player.宗门)) {
      e.reply('你尚未加入宗门')
      return false
    }
    if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
      e.reply('只有宗主、副宗主可以操作')
      return false
    }

    let atItem = e.message.filter((item) => item.type === 'at') //获取at信息
    let member_qq = atItem[0].qq
    if (user_id == member_qq) {
      e.reply('???')
      return false
    } //at宗主自己,这不扯犊子呢

    let ass = await data.getAssociation(player.宗门.宗门名称)
    let isinass = ass.所有成员.some((item) => item == member_qq) //这个命名可太糟糕了
    if (!isinass) {
      e.reply('只能设置宗门内弟子the职位')
      return false
    }
    let member = data.getData('player', member_qq) //获取这个Bthe存档
    let now_apmt = member.宗门.职位 //这个B现在the职位
    if (player.宗门.职位 == '副宗主' && now_apmt == '宗主') {
      e.reply('你想造反吗！？')
      return false
    }
    if (
      player.宗门.职位 == '副宗主' &&
      (now_apmt == '副宗主' || now_apmt == '长老')
    ) {
      e.reply(`宗门${now_apmt}任免请上报宗主！`)
      return false
    }
    let full_apmt = ass.所有成员.length

    let name = '宗主'

    if (/宗主/.test(e.msg)) {
      e.reply(`此人已经是本宗门the${name}`)
      return false
    }
    if (/长老/.test(e.msg)) {
      name = '长老'
      full_apmt = Maximum_number_of_elders[ass.宗门等级 - 1]
    }
    if (/副宗主/.test(e.msg)) {
      name = '副宗主'
      full_apmt = Maximum_number_of_secondary_masters[ass.宗门等级 - 1]
    } else if (/内门弟子/.test(e.msg)) {
      name = '内门弟子'
      full_apmt = Upper_limit_of_inner_disciples[ass.宗门等级 - 1]
    }
    //
    if (ass[name].length >= full_apmt) {
      e.reply(`本宗门the${name}人数已经达到上限`)
      return false
    }
    member.宗门.职位 = name //成员存档里改职位
    ass[now_apmt] = ass[now_apmt].filter((item) => item != member_qq) //原来the职位表删掉这个B
    ass[name].push(member_qq) //新the职位表加入这个B
    data.setData('player', member_qq, member) //记录到存档
    data.setAssociation(ass.宗门名称, ass) //记录到宗门
    e.reply([
      segment.at(member_qq),
      `${ass.宗门名称} ${player.宗门.职位} 已经成功将${member.name}任命为${name}!`
    ])
    return false
  }

  //宗门维护
  async Maintenance(e) {
    let user_id = e.user_id
    let ifexistplay = data.existData('player', user_id)
    if (!ifexistplay) return false
    let player = await data.getData('player', user_id)
    if (!isNotNull(player.宗门)) {
      return false
    }
    if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
      e.reply('只有宗主、副宗主可以操作')
      return false
    }
    let ass = await data.getAssociation(player.宗门.宗门名称)
    let now = new Date()
    let nowTime = now.getTime() //获取当前日期the时间戳
    let time = getConfig('xiuxian', 'xiuxian').CD.association
    let nextmt_time = await shijianc(ass.维护时间 + 60000 * time) //获得下次宗门维护日期,7天后
    if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
      e.reply(
        `当前无需维护,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`
      )
      return false
    }
    if (ass.money池 < ass.宗门等级 * 50000) {
      e.reply(
        `目前宗门维护需要${ass.宗门等级 * 50000}money,本宗门money池储量不足`
      )
      return false
    }
    ass.money池 -= ass.宗门等级 * 50000
    ass.维护时间 = nowTime
    await data.setAssociation(ass.宗门名称, ass) //记录到宗门
    nextmt_time = await shijianc(ass.维护时间 + 60000 * time)
    e.reply(
      `宗门维护成功,下次维护时间:${nextmt_time.Y}年${nextmt_time.M}月${nextmt_time.D}日${nextmt_time.h}时${nextmt_time.m}分${nextmt_time.s}秒`
    )
    return false
  }

  //设置最低加入境界
  async jiaru(e) {
    let user_id = e.user_id
    let player = await data.getData('player', user_id)
    if (!isNotNull(player.宗门)) return false
    if (
      player.宗门.职位 == '宗主' ||
      player.宗门.职位 == '副宗主' ||
      player.宗门.职位 == '长老'
    ) {
    } else {
      e.reply('只有宗主、副宗主或长老可以操作')
      return false
    }
    let jiar = e.msg.replace('#设置门槛', '')
    jiar = jiar.trim()
    if (!data.Level_list.some((item) => item.level == jiar)) return false
    let jr_level_id = data.Level_list.find(
      (item) => item.level == jiar
    ).level_id
    let ass = data.getAssociation(player.宗门.宗门名称)
    if (ass.power == 0 && jr_level_id > 41) {
      jr_level_id = 41
      e.reply('不知哪位大能立下誓言：凡界无仙！')
    }
    if (ass.power == 1 && jr_level_id < 42) {
      jr_level_id = 42
      e.reply('仅仙人可加入仙宗')
    }
    ass.最低加入境界 = jr_level_id
    e.reply('已成功设置宗门门槛，当前门槛:' + jiar)
    data.setAssociation(ass.宗门名称, ass)
    return false
  }

  async Deleteusermax(e) {
    let user_id = e.user_id
    let ifexistplay = data.existData('player', user_id)
    if (!ifexistplay) return false
    let player = await data.getData('player', user_id)
    if (!isNotNull(player.宗门)) {
      return false
    }

    let menpai = e.msg.replace(/^(#|\/)/, '')

    menpai = menpai.replace('逐出', '')

    let member_qq = menpai

    if (user_id == member_qq) {
      e.reply('???')
      return false
    }

    let ifexistplayB = data.existData('player', member_qq)
    if (!ifexistplayB) {
      e.reply('此人未踏入仙途！')
      return false
    }
    let playerB = await data.getData('player', member_qq)
    if (!isNotNull(playerB.宗门)) {
      e.reply('对方尚未加入宗门')
      return false
    }
    let ass = data.getAssociation(player.宗门.宗门名称)
    let bss = data.getAssociation(playerB.宗门.宗门名称)
    if (ass.宗门名称 != bss.宗门名称) return false
    if (player.宗门.职位 == '宗主') {
      if (user_id == member_qq) {
        e.reply('？？？') //踢自己？
        return false
      }
      bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(
        (item) => item != member_qq
      )
      bss['所有成员'] = bss['所有成员'].filter((item) => item != member_qq)
      data.setAssociation(bss.宗门名称, bss)
      delete playerB.宗门
      data.setData('player', member_qq, playerB)
      player_efficiency(member_qq)
      e.reply('已踢出！')
      return false
    }
    if (player.宗门.职位 == '副宗主') {
      if (playerB.宗门.职位 == '宗主') {
        e.reply('你没权限')
        return false
      }
      if (playerB.宗门.职位 == '长老' || playerB.宗门.职位 == '副宗主') {
        e.reply(`宗门${playerB.宗门.职位}任免请上报宗主！`)
        return false
      }
      bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(
        (item) => item != member_qq
      )
      bss['所有成员'] = bss['所有成员'].filter((item) => item != member_qq)
      data.setAssociation(bss.宗门名称, bss)
      delete playerB.宗门
      data.setData('player', member_qq, playerB)
      player_efficiency(member_qq)
      e.reply('已踢出！')
      return false
    }
    if (player.宗门.职位 == '长老') {
      if (playerB.宗门.职位 == '宗主' || playerB.宗门.职位 == '副宗主') {
        e.reply('造反啦？')
        return false
      }
      if (playerB.宗门.职位 == '长老') {
        e.reply(`宗门${playerB.宗门.职位}任免请上报宗主！`)
        return false
      }
      bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(
        (item) => item != member_qq
      )
      bss['所有成员'] = bss['所有成员'].filter((item) => item != member_qq)
      await data.setAssociation(bss.宗门名称, bss)
      await delete playerB.宗门
      await data.setData('player', member_qq, playerB)
      await player_efficiency(member_qq)
      e.reply('已踢出！')
      return false
    }
    playerB.favorability = 0
    await data.setData('player', member_qq, playerB)
  }

  async Deleteuser(e) {
    let user_id = e.user_id
    let ifexistplay = data.existData('player', user_id)
    if (!ifexistplay) return false
    let player = await data.getData('player', user_id)
    if (!isNotNull(player.宗门)) return false
    let atItem = e.message.filter((item) => item.type === 'at') //获取at信息
    if (!atItem) {
      return false
    } //没有at信息直接返回,不执行
    let member_qq = atItem[0].qq
    if (user_id == member_qq) {
      e.reply('???')
      return false
    }

    let ifexistplayB = data.existData('player', member_qq)
    if (!ifexistplayB) {
      e.reply('此人未踏入仙途！')
      return false
    }
    let playerB = await data.getData('player', member_qq)
    if (!isNotNull(playerB.宗门)) {
      e.reply('对方尚未加入宗门')
      return false
    }
    let ass = data.getAssociation(player.宗门.宗门名称)
    let bss = data.getAssociation(playerB.宗门.宗门名称)
    if (ass.宗门名称 != bss.宗门名称) {
      return false
    }
    if (player.宗门.职位 == '宗主') {
      if (user_id == member_qq) {
        e.reply('？？？') // 自己踢自己？？
        return false
      }
      bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(
        (item) => item != member_qq
      )
      bss['所有成员'] = bss['所有成员'].filter((item) => item != member_qq)
      data.setAssociation(bss.宗门名称, bss)
      delete playerB.宗门
      data.setData('player', member_qq, playerB)
      player_efficiency(member_qq)
      e.reply('已踢出！')
      return false
    }
    if (player.宗门.职位 == '副宗主') {
      if (playerB.宗门.职位 == '宗主') {
        e.reply('造反啦？')
        return false
      }
      if (playerB.宗门.职位 == '长老' || playerB.宗门.职位 == '副宗主') {
        e.reply(`宗门${playerB.宗门.职位}任免请上报宗主！`)
        return false
      }
      bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(
        (item) => item != member_qq
      )
      bss['所有成员'] = bss['所有成员'].filter((item) => item != member_qq)
      await data.setAssociation(bss.宗门名称, bss)
      await delete playerB.宗门
      await data.setData('player', member_qq, playerB)
      await player_efficiency(member_qq)
      e.reply('已踢出！')
      return false
    }
    if (player.宗门.职位 == '长老') {
      if (playerB.宗门.职位 == '宗主' || playerB.宗门.职位 == '副宗主') {
        e.reply('造反啦？')
        return false
      }
      if (playerB.宗门.职位 == '长老') {
        e.reply(`宗门${playerB.宗门.职位}任免请上报宗主！`)
        return false
      }
      bss[playerB.宗门.职位] = bss[playerB.宗门.职位].filter(
        (item) => item != member_qq
      )
      bss['所有成员'] = bss['所有成员'].filter((item) => item != member_qq)
      await data.setAssociation(bss.宗门名称, bss)
      await delete playerB.宗门
      await data.setData('player', member_qq, playerB)
      await player_efficiency(member_qq)
      e.reply('已踢出！')
      return false
    }
    playerB.favorability = 0
    await data.setData('player', member_qq, playerB)
  }
}

/**
 * 创立新the宗门
 * @param name 宗门名称
 * @param holder_qq 宗主qq号
 */
async function new_Association(name, holder_qq, e) {
  let user_id = e.user_id
  let player = data.getData('player', user_id)
  let now_level_id = data.Level_list.find(
    (item) => item.level_id == player.level_id
  ).level_id
  let x
  let xian
  let dj
  if (now_level_id > 41) {
    x = 1
    xian = 10
    dj = 42
  } else {
    x = 0
    xian = 1
    dj = 1
  }
  let now = new Date()
  let nowTime = now.getTime() //获取当前时间戳
  let date = timestampToTime(nowTime)
  let Association = {
    宗门名称: name,
    宗门等级: 1,
    创立时间: [date, nowTime],
    money池: 0,
    宗门驻地: 0,
    宗门建设等级: 0,
    宗门神兽: 0,
    宗主: holder_qq,
    副宗主: [],
    长老: [],
    内门弟子: [],
    外门弟子: [],
    所有成员: [holder_qq],
    药园: {
      药园等级: 1,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: holder_qq
        }
      ]
    },
    维护时间: nowTime,
    大阵血量: 114514 * xian,
    最低加入境界: dj,
    power: x
  }
  data.setAssociation(name, Association)
  return
}
