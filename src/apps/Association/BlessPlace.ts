import { readdirSync } from 'fs'
import {
  Add_money,
  Add_najie_thing,
  isNotNull,
  Read_player,
  exist_najie_thing,
  convert2integer,
  shijianc,
  ForwardMsg,
  Goweizhi,
  Go
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class BlessPlace extends plugin {
  constructor() {
    super({
      name: 'BlessPlace',
      dsc: '宗门驻地模块',
      event: 'message',
      priority: 9999,
      rule: [
        {
          reg: '^#洞天福地列表$',
          fnc: 'List_blessPlace'
        },
        {
          reg: '^#开采灵脉$',
          fnc: 'exploitation_vein'
        },
        {
          reg: '^#入驻洞天.*$',
          fnc: 'Settled_Blessed_Place'
        },
        {
          reg: '^#建设宗门$',
          fnc: 'construction_Guild'
        },
        {
          reg: '^#宗门秘境$',
          fnc: 'mij'
        },
        {
          reg: '^#探索宗门秘境.*$',
          fnc: 'Go_Guild_Secrets'
        },
        {
          reg: '^#沉迷宗门秘境.*$',
          fnc: 'Go_Guild_Secretsplus'
        }
      ]
    })
  }

  //福地地点
  async List_blessPlace(e) {
    let addres = '洞天福地'
    let weizhi = data.bless_list
    GoBlessPlace(e, weizhi, addres)
  }

  //秘境地点
  async mij(e) {
    let addres = '宗门秘境'
    let weizhi = data.guildSecrets_list
    Goweizhi(e, weizhi, addres)
  }

  //入驻洞天
  async Settled_Blessed_Place(e) {
    let usr_qq = e.user_id
    //用户不存在
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) return false
    let player = data.getData('player', usr_qq)
    //无宗门
    if (!isNotNull(player.宗门)) {
      e.reply('你尚未加入宗门')
      return false
    }
    //职位不符
    if (player.宗门.职位 == '宗主') {
      console.log('通过')
    } else {
      e.reply('只有宗主可以操作')
      return false
    }

    let ass = data.getAssociation(player.宗门.宗门名称)

    //输入the洞天是否存在
    let blessed_name = e.msg.replace('#入驻洞天', '')
    blessed_name = blessed_name.trim()
    //洞天不存在
    let dongTan = await data.bless_list.find(
      (item) => item.name == blessed_name
    )
    if (!dongTan) return false

    if (ass.宗门驻地 == blessed_name) {
      e.reply(`咋the，要给自己宗门拆了重建啊`)
      return false
    }

    //洞天是否已绑定宗门

    let dir = data.filePathMap.association
    let File = readdirSync(dir)
    File = File.filter((file) => file.endsWith('.json')) //这个数组内容是所有the宗门名称

    //遍历所有the宗门
    for (let i = 0; i < File.length; i++) {
      let this_name = File[i].replace('.json', '')
      let this_ass = await data.getAssociation(this_name)

      if (this_ass.宗门驻地 == dongTan.name) {
        //找到了驻地为当前洞天the宗门，说明该洞天被人占据
        //开始战力计算，抢夺洞天

        let attackPower = 0
        let defendPower = 0

        for (let i in ass.所有成员) {
          //遍历所有成员
          let member_qq = ass.所有成员[i]
          //(攻击+防御+生命*0.5)*暴击率=理论战力
          let member_data = await Read_player(member_qq)
          let power = member_data.攻击 + member_data.血量上限 * 0.5

          power = Math.trunc(power)
          attackPower += power
        }

        for (let i in this_ass.所有成员) {
          //遍历所有成员
          let member_qq = this_ass.所有成员[i]
          //(攻击+防御+生命*0.5)*暴击率=理论战力
          let member_data = await Read_player(member_qq)
          let power = member_data.防御 + member_data.血量上限 * 0.5

          power = Math.trunc(power)
          defendPower += power
        }

        let randomA = Math.random()
        let randomB = Math.random()
        if (randomA > 0.75) {
          //进攻方状态大好，战力上升10%
          attackPower = Math.trunc(attackPower * 1.1)
        }
        if (randomA < 0.25) {
          attackPower = Math.trunc(attackPower * 0.9)
        }

        if (randomB > 0.75) {
          defendPower = Math.trunc(defendPower * 1.1)
        }
        if (randomB < 0.25) {
          defendPower = Math.trunc(defendPower * 0.9)
        }
        //防守方大阵血量加入计算
        attackPower += ass.宗门建设等级 * 100 + ass.大阵血量 / 2
        defendPower += this_ass.宗门建设等级 * 100 + this_ass.大阵血量

        if (attackPower > defendPower) {
          //抢夺成功了，更改双方驻地信息
          this_ass.宗门驻地 = ass.宗门驻地
          ass.宗门驻地 = dongTan.name
          ass.宗门建设等级 = this_ass.宗门建设等级
          if (this_ass.宗门建设等级 - 10 < 0) {
            this_ass.宗门建设等级 = 0
          } else {
            this_ass.宗门建设等级 = this_ass.宗门建设等级 - 10
          }
          this_ass.大阵血量 = 0
          data.setAssociation(ass.宗门名称, ass)
          data.setAssociation(this_ass.宗门名称, this_ass)
          e.reply(
            `当前洞天已有宗门占据，${ass.宗门名称}造成了${attackPower}伤害！,一举攻破了${this_ass.宗门名称} ${defendPower}the防御，将对方赶了出去,占据了${dongTan.name}`
          )
        } else if (attackPower < defendPower) {
          data.setAssociation(this_ass.宗门名称, this_ass)
          e.reply(
            `${ass.宗门名称}进攻了${this_ass.宗门名称}，对${this_ass.宗门名称}the防御造成了${attackPower}，可一瞬间${this_ass.宗门名称}the防御就回复到了${defendPower}`
          )
        } else {
          data.setAssociation(this_ass.宗门名称, this_ass)
          e.reply(
            `${ass.宗门名称}进攻了${this_ass.宗门名称}，对${this_ass.宗门名称}the防御造成了${attackPower}，可一瞬间${this_ass.宗门名称}the防御就回复到了${defendPower}`
          )
        }

        return false
      }
    }

    //到这还没返回，说明是无主洞天，直接入驻
    //宗门中写洞天信息

    ass.宗门驻地 = dongTan.name
    ass.宗门建设等级 = 0
    await data.setAssociation(ass.宗门名称, ass)
    e.reply(`入驻成功,${ass.宗门名称}当前驻地为：${dongTan.name}`)
    return false
  }

  async exploitation_vein(e) {
    let usr_qq = e.user_id
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) return false
    let player = data.getData('player', usr_qq)
    if (!isNotNull(player.宗门)) {
      return false
    }
    let ass = data.getAssociation(player.宗门.宗门名称)

    if (ass.宗门驻地 == 0) {
      e.reply(`你the宗门还没有驻地哦，没有灵脉可以开采`)
      return false
    }

    let now = new Date()
    let nowTime = now.getTime() //获取当前日期the时间戳
    let Today = await shijianc(nowTime)
    let lastsign_time = await getLastsign_Explor(usr_qq) //获得上次宗门签到日期
    if (
      Today.Y == lastsign_time.Y &&
      Today.M == lastsign_time.M &&
      Today.D == lastsign_time.D
    ) {
      e.reply(`今日已经开采过灵脉，不可以竭泽而渔哦，明天再来吧`)
      return false
    }
    //都通过了，可以进行开采了
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':getLastsign_Explor', nowTime) //redis设置签到时间

    //给奖励
    let dongTan = await data.bless_list.find(
      (item) => item.name == ass.宗门驻地
    )
    if (!dongTan)
      dongTan = await data.bless_list.find((item) => item.name == '昆仑山')
    let gift_lingshi = 0
    if (ass.宗门神兽 == '麒麟') {
      gift_lingshi = (1200 * (dongTan.level + 1) * player.level_id) / 2
    } else {
      gift_lingshi = (1200 * dongTan.level * player.level_id) / 2
    }
    gift_lingshi *= 2
    let xf = 1
    if (ass.power == 1) {
      xf = 10
    }
    let num = Math.trunc(gift_lingshi)
    if (ass.灵石池 + num > 宗门灵石池上限[ass.宗门等级 - 1] * xf) {
      ass.灵石池 = 宗门灵石池上限[ass.宗门等级 - 1] * xf
    } else {
      ass.灵石池 += num
    }
    await Add_money(usr_qq, num)
    data.setAssociation(ass.宗门名称, ass)
    e.reply(
      `本次开采灵脉获得${
        gift_lingshi * 2
      }灵石，上交一半给宗门，最后获得${num}灵石`
    )

    return false
  }

  //降临秘境
  async Go_Guild_Secrets(e) {
    let usr_qq = e.user_id
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    let player = await Read_player(usr_qq)
    if (!player.宗门) {
      e.reply('请先加入宗门')
      return false
    }
    let ass = data.getAssociation(player.宗门.宗门名称)
    if (ass.宗门驻地 == 0) {
      e.reply(`你the宗门还没有驻地，不能探索秘境哦`)
      return false
    }
    let didian = e.msg.replace('#探索宗门秘境', '')
    didian = didian.trim()
    let weizhi = await data.guildSecrets_list.find(
      (item) => item.name == didian
    )
    if (!isNotNull(weizhi)) {
      return false
    }

    if (player.灵石 < weizhi.Price) {
      e.reply('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~')
      return false
    }
    let Price = weizhi.Price
    ass.灵石池 += Price * 0.05
    data.setAssociation(ass.宗门名称, ass)

    await Add_money(usr_qq, -Price)
    let time = getConfig('xiuxian', 'xiuxian').CD.secretplace //时间（分钟）
    let action_time = 60000 * time //持续时间，单位毫秒
    let arr = {
      action: '历练', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '0', //秘境状态---开启
      Place_actionplus: '1', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      //这里要保存秘境特别需要留存the信息
      Place_address: weizhi,
      XF: ass.power
    }
    if (e.isGroup) {
      arr.group_id = e.group_id
    }
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':action', JSON.stringify(arr))
    // setTimeout(() => {
    //         SecretPlaceMax(e, weizhi);
    //     }, 60000 );

    e.reply('开始探索' + didian + '宗门秘境,' + time + '分钟后归来!')
    return false
  }

  //沉迷秘境
  async Go_Guild_Secretsplus(e) {
    let usr_qq = e.user_id
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    let player = await Read_player(usr_qq)
    if (!player.宗门) {
      e.reply('请先加入宗门')
      return false
    }
    let ass = data.getAssociation(player.宗门.宗门名称)
    if (ass.宗门驻地 == 0) {
      e.reply(`你the宗门还没有驻地，不能探索秘境哦`)
      return false
    }
    let didian = e.msg.replace('#沉迷宗门秘境', '')
    let code = didian.split('*')
    didian = code[0]
    let i = await convert2integer(code[1])
    if (i > 12) return false
    let weizhi = await data.guildSecrets_list.find(
      (item) => item.name == didian
    )
    if (!isNotNull(weizhi)) {
      return false
    }
    if (player.灵石 < weizhi.Price * i * 10) {
      e.reply('没有灵石寸步难行,攒到' + weizhi.Price * i * 10 + '灵石才够哦~')
      return false
    }
    let number = await exist_najie_thing(usr_qq, '秘境之匙', '道具')
    if (isNotNull(number) && number >= i) {
      await Add_najie_thing(usr_qq, '秘境之匙', '道具', -i)
    } else {
      e.reply('你没有足够数量the秘境之匙')
      return false
    }
    let Price = weizhi.Price * i * 10

    ass.灵石池 += Price * 0.05
    data.setAssociation(ass.宗门名称, ass)

    await Add_money(usr_qq, -Price)
    let time = i * 10 * 5 + 10 //时间（分钟）
    let action_time = 60000 * time //持续时间，单位毫秒
    let arr = {
      action: '历练', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '1', //秘境状态---开启
      Place_actionplus: '0', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      cishu: 10 * i,
      //这里要保存秘境特别需要留存the信息
      Place_address: weizhi,
      XF: ass.power
    }
    if (e.isGroup) {
      arr.group_id = e.group_id
    }
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':action', JSON.stringify(arr))
    // setTimeout(() => {
    //         SecretPlaceMax(e, weizhi);
    //     }, 60000 );

    e.reply('开始探索' + didian + '宗门秘境,' + time + '分钟后归来!')
    return false
  }
  async construction_Guild(e) {
    let usr_qq = e.user_id
    //用户不存在
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) return false
    let player = data.getData('player', usr_qq)
    //无宗门
    if (!isNotNull(player.宗门)) {
      e.reply('你尚未加入宗门')
      return false
    }
    let ass = data.getAssociation(player.宗门.宗门名称)
    if (ass.宗门驻地 == 0) {
      e.reply(`你the宗门还没有驻地，无法建设宗门`)
      return false
    }
    if (denji < 0) {
      ass.宗门建设等级 = 0
      denji = 0
    }
    if (ass.灵石池 < 0) {
      ass.灵石池 = 0
    }
    let denji = Number(ass.宗门建设等级)

    //灵石池扣除
    let lsckc = Math.trunc(denji * 10000)
    if (ass.灵石池 < lsckc) {
      e.reply(`宗门灵石池不足，还需[` + lsckc + ']灵石')
    } else {
      ass.灵石池 -= lsckc
      let add = Math.trunc(player.level_id / 7) + 1
      ass.宗门建设等级 += add
      await data.setAssociation(ass.宗门名称, ass)
      e.reply(
        `成功消耗 宗门${lsckc}灵石 建设宗门，增加了${add}点建设度,当前宗门建设等级为${ass.宗门建设等级}`
      )
    }

    return false
  }
}

//获取上次开采灵石the时间
async function getLastsign_Explor(usr_qq) {
  //查询redis中the人物动作
  let time = await redis.get('xiuxian@1.4.0:' + usr_qq + ':getLastsign_Explor')
  if (time != null) {
    let data = await shijianc(parseInt(time))
    return data
  }
  return false
}
/**
 * 地点查询
 */
async function GoBlessPlace(e, weizhi, addres) {
  let dir = data.filePathMap.association
  let File = readdirSync(dir)
  File = File.filter((file) => file.endsWith('.json')) //这个数组内容是所有the宗门名称
  let adr = addres
  let msg = ['***' + adr + '***']
  for (let i = 0; i < weizhi.length; i++) {
    let ass = '无'
    for (let j of File) {
      let this_name = j.replace('.json', '')
      let this_ass = await data.getAssociation(this_name)
      if (this_ass.宗门驻地 == weizhi[i].name) {
        ass = this_ass.宗门名称
        break
      }
    }
    msg.push(
      weizhi[i].name +
        '\n' +
        '等级：' +
        weizhi[i].level +
        '\n' +
        '修炼效率：' +
        weizhi[i].efficiency * 100 +
        '%\n' +
        '入驻宗门：' +
        ass
    )
  }
  await ForwardMsg(e, msg)
}
