import { plugin, name, dsc } from '../../api/api.js'
import data from '../../model/xiuxiandata.js'
import config from '../../model/config.js'
import fs from 'fs'
import {
  Read_player,
  existplayer,
  exist_najie_thing,
  Add_灵石,
  Add_najie_thing,
  __PATH,
  Go
} from '../../model/xiuxian.js'
export class moneyoperation extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        {
          reg: '^(孝敬前辈|资助后辈|赠送灵石).*$',
          fnc: 'Give_lingshi'
        },
        {
          reg: '^#发红包.*$',
          fnc: 'Give_honbao'
        },
        {
          reg: '^#抢红包$',
          fnc: 'uer_honbao'
        },
        {
          reg: '^#发福利.*$',
          fnc: 'Allfuli'
        },
        {
          reg: '^#发补偿.*$',
          fnc: 'Fuli'
        },
        {
          reg: '^#扣除.*$',
          fnc: 'Deduction'
        },
        {
          reg: '^#打开钱包$',
          fnc: 'openwallet'
        },
        {
          reg: '#交税.*$',
          fnc: 'MoneyWord'
        }
      ]
    })
  }

  async MoneyWord(e) {
    if (!e.isGroup || e.user_id == 80000000) return false

    //这是自己的
    let usr_qq = e.user_id
    //自己没存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) {
      return false
    }
    //全局状态判断
    const T = await Go(e)
    if (!T) {
      return false
    }
    //获取发送灵石数量
    let lingshi = e.msg.replace('#', '')
    lingshi = lingshi.replace('交税', '')
    lingshi = Number(lingshi)
    if (!isNaN(parseFloat(lingshi)) && isFinite(lingshi)) {
      console.log('通过')
    } else {
      return false
    }
    if (lingshi <= 0) {
      return false
    }
    lingshi = Math.trunc(lingshi)
    let player = await Read_player(usr_qq)
    if (player.灵石 <= lingshi) {
      e.reply('醒醒，你没有那么多')
      return false
    }
    await Add_灵石(usr_qq, -lingshi)
    let Worldmoney = await redis.get('Xiuxian:Worldmoney')
    Worldmoney = Number(Worldmoney)
    Worldmoney = Worldmoney + lingshi
    Worldmoney = Number(Worldmoney)
    await redis.set('Xiuxian:Worldmoney', Worldmoney)
    e.reply('成功交税' + lingshi)
    return false
  }

  async Deduction(e) {
    if (!e.isGroup || e.user_id == 80000000) return false

    if (!e.isMaster) return false

    //对方
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) {
      return false
    }

    let atItem = e.message.filter((item) => item.type === 'at') //获取at信息
    let B_qq = atItem[0].qq //对方qq
    //对方没存档
    let ifexistplay = await existplayer(B_qq)
    if (!ifexistplay) {
      e.reply(`此人尚未踏入仙途`)
      return false
    }

    //获取发送灵石数量
    let lingshi = e.msg.replace('#', '')
    lingshi = lingshi.replace('扣除', '')
    //校验输入灵石数
    if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) >= 1000) {
      lingshi = parseInt(lingshi)
    } else {
      return false
    }
    await Add_灵石(B_qq, -lingshi)
    e.reply('已强行扣除灵石' + lingshi)

    let Worldmoney = await redis.get('Xiuxian:Worldmoney')
    Worldmoney = Number(Worldmoney)
    Worldmoney = Worldmoney + lingshi
    Worldmoney = Number(Worldmoney)
    await redis.set('Xiuxian:Worldmoney', Worldmoney)

    return false
  }

  async Give_lingshi(e) {
    if (!e.isGroup || e.user_id == 80000000) return false

    //这是自己的
    let A_qq = e.user_id
    //自己没存档
    let ifexistplay = await existplayer(A_qq)
    if (!ifexistplay) {
      return false
    }
    //全局状态判断
    const T = await Go(e)
    if (!T) {
      return false
    }

    //对方
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) {
      return false
    }
    let atItem = e.message.filter((item) => item.type === 'at') //获取at信息
    let B_qq = atItem[0].qq //对方qq
    //对方没存档
    ifexistplay = await existplayer(B_qq)
    if (!ifexistplay) {
      e.reply(`此人尚未踏入仙途`)
      return false
    }

    //获取发送灵石数量
    let lingshi = e.msg.replace('#', '')
    lingshi = lingshi.replace('孝敬前辈', '')
    lingshi = lingshi.replace('资助后辈', '')
    lingshi = lingshi.replace('赠送灵石', '')

    //校验输入灵石数
    if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) >= 1000) {
      lingshi = parseInt(lingshi)
    } else {
      e.reply(`这么点灵石你也好拿得出手吗?起码要1000灵石,已为您修改`)
      lingshi = 1000
    }

    //没有输入正确数字或＜1000;
    //检验A有没有那么多灵石
    let A_player = await data.getData('player', A_qq)
    let B_player = await data.getData('player', B_qq)

    let cost = config.getconfig('xiuxian', 'xiuxian').percentage.cost
    let lastlingshi = lingshi + Math.trunc(lingshi * cost)

    if (A_player.灵石 < lastlingshi) {
      e.reply([segment.at(A_qq), `你身上似乎没有${lastlingshi}灵石`])
      return false
    }

    let now = new Date()
    let nowTime = now.getTime() //获取当前时间戳
    let lastgetbung_time = await redis.get(
      'xiuxian:player:' + A_qq + ':last_getbung_time'
    )
    lastgetbung_time = parseInt(lastgetbung_time)
    let transferTimeout = parseInt(
      config.getconfig('xiuxian', 'xiuxian').CD.transfer * 60000
    )
    if (nowTime < lastgetbung_time + transferTimeout) {
      let waittime_m = Math.trunc(
        (lastgetbung_time + transferTimeout - nowTime) / 60 / 1000
      )
      let waittime_s = Math.trunc(
        ((lastgetbung_time + transferTimeout - nowTime) % 60000) / 1000
      )
      e.reply(
        `每${transferTimeout / 1000 / 60}分钟赠送灵石一次，正在CD中，` +
          `剩余cd: ${waittime_m}分${waittime_s}秒`
      )
      return false
    }

    //交易
    await Add_灵石(A_qq, -lastlingshi)
    await Add_灵石(B_qq, lingshi)

    let Worldmoney = await redis.get('Xiuxian:Worldmoney')
    Worldmoney = Number(Worldmoney)

    Worldmoney = Worldmoney + lingshi * cost
    Worldmoney = Number(Worldmoney)
    await redis.set('Xiuxian:Worldmoney', Worldmoney)

    e.reply([
      segment.at(A_qq),
      segment.at(B_qq),
      `${B_player.名号} 获得了由 ${A_player.名号}赠送的${lingshi}灵石`
    ])
    //记录本次获得赠送灵石的时间戳
    await redis.set('xiuxian:player:' + A_qq + ':last_getbung_time', nowTime)
    return false
  }

  //发红包
  async Give_honbao(e) {
    if (!e.isGroup || e.user_id == 80000000) return false

    //这是自己的
    let usr_qq = e.user_id
    //自己没存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) {
      return false
    }
    //全局状态判断
    const T = await Go(e)
    if (!T) {
      return false
    }
    //获取发送灵石数量
    let lingshi = e.msg.replace('#', '')
    lingshi = lingshi.replace('发红包', '')
    let code = lingshi.split('*')
    lingshi = code[0]
    let acount = code[1]
    if (!isNaN(parseFloat(lingshi)) && isFinite(lingshi)) {
      console.log('通过')
    } else {
      return false
    }
    if (!isNaN(parseFloat(acount)) && isFinite(acount)) {
      //是数字
    } else {
      return false
    }
    lingshi = Number(lingshi)
    acount = Number(acount)
    lingshi = Math.trunc(lingshi)
    acount = Math.trunc(acount)
    if (lingshi <= 0 || acount <= 0) {
      return false
    }
    let player = await data.getData('player', usr_qq)
    //对比自己的灵石，看看够不够！
    if (player.灵石 <= parseInt(lingshi * acount)) {
      e.reply(`红包数要比自身灵石数小噢`)
      return false
    }
    let getlingshi = 0
    //循环取整
    for (let i = 1; i <= 100; i++) {
      //校验输入灵石数
      if (
        parseInt(lingshi) == parseInt(lingshi) &&
        parseInt(lingshi) == i * 10000
      ) {
        //按万算，最高送一百万一个红包的灵石
        //符合调节就进来
        getlingshi = parseInt(lingshi)
        break
      }
    }
    //取完之后查看灵石是否为零
    if (lingshi != getlingshi) {
      //不符合的，返回，并提示玩家
      e.reply(`一个红包最低为一万灵石噢，且是万的倍数，最高可发一百万一个`)
      return false
    }
    //发送的灵石要当到数据库里。大家都能取
    await redis.set('xiuxian:player:' + usr_qq + ':honbao', getlingshi)
    await redis.set('xiuxian:player:' + usr_qq + ':honbaoacount', acount)
    //然后扣灵石
    await Add_灵石(usr_qq, -getlingshi * acount)
    e.reply(
      '【全服公告】' +
        player.名号 +
        '发了' +
        acount +
        '个' +
        getlingshi +
        '灵石的红包！'
    )
    return false
  }

  //抢红包
  async uer_honbao(e) {
    if (!e.isGroup || e.user_id == 80000000) return false

    let usr_qq = e.user_id

    //自己没存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) {
      return false
    }

    let player = await data.getData('player', usr_qq)

    //抢红包要有一分钟的CD
    let now_time = new Date().getTime()
    let lastgetbung_time = await redis.get(
      'xiuxian:player:' + usr_qq + ':last_getbung_time'
    )
    lastgetbung_time = parseInt(lastgetbung_time)
    let transferTimeout = parseInt(
      config.getconfig('xiuxian', 'xiuxian').CD.honbao * 60000
    )
    if (now_time < lastgetbung_time + transferTimeout) {
      let waittime_m = Math.trunc(
        (lastgetbung_time + transferTimeout - now_time) / 60 / 1000
      )
      let waittime_s = Math.trunc(
        ((lastgetbung_time + transferTimeout - now_time) % 60000) / 1000
      )
      e.reply(
        `每${transferTimeout / 1000 / 60}分钟抢一次，正在CD中，` +
          `剩余cd: ${waittime_m}分${waittime_s}秒`
      )
      return false
    }

    //要艾特对方，表示抢对方红包
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) {
      return false
    }

    let atItem = e.message.filter((item) => item.type === 'at')
    let honbao_qq = atItem[0].qq
    //有无存档
    let ifexistplay_honbao = await existplayer(honbao_qq)
    if (!ifexistplay_honbao) {
      return false
    }
    //这里有错
    let acount = await redis.get(
      'xiuxian:player:' + honbao_qq + ':honbaoacount'
    )
    acount = Number(acount)
    //根据个数判断
    if (acount <= 0) {
      e.reply('他的红包被光啦！')
      return false
    }
    //看看一个有多少灵石
    let lingshi = await redis.get('xiuxian:player:' + honbao_qq + ':honbao')
    let addlingshi = Math.trunc(lingshi)
    //减少个数
    acount--
    await redis.set('xiuxian:player:' + honbao_qq + ':honbaoacount', acount)
    //拿出来的要给玩家
    await Add_灵石(usr_qq, addlingshi)
    //给个提示
    e.reply(
      '【全服公告】' + player.名号 + '抢到一个' + addlingshi + '灵石的红包！'
    )
    //记录时间
    await redis.set('xiuxian:player:' + usr_qq + ':last_getbung_time', now_time)
    return false
  }

  //发福利
  async Allfuli(e) {
    if (!e.isGroup || e.user_id == 80000000) return false

    if (!e.isMaster) return false

    //获取发送灵石数量
    let lingshi = e.msg.replace('#', '')
    lingshi = lingshi.replace('发', '')
    lingshi = lingshi.replace('福利', '')

    let pattern = new RegExp('[0-9]+')
    let str = lingshi

    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return false
    }

    //校验输入灵石数
    if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) > 0) {
      lingshi = parseInt(lingshi)
    } else {
      lingshi = 100 //没有输入正确数字或不是正数
    }

    let File = fs.readdirSync(__PATH.player_path)
    File = File.filter((file) => file.endsWith('.json'))
    let File_length = File.length

    //金库
    let Worldmoney = await redis.get('Xiuxian:Worldmoney')
    if (
      Worldmoney == null ||
      Worldmoney == undefined ||
      Worldmoney <= 0 ||
      isNaN(Worldmoney)
    ) {
      Worldmoney = 1
    }
    Worldmoney = Number(Worldmoney)

    if (Worldmoney <= lingshi * File_length) {
      e.reply(
        '共有' +
          File_length +
          '名玩家，需要消耗' +
          lingshi * File_length +
          ',你的世界财富不足！'
      )
      return false
    }

    Worldmoney = Worldmoney - lingshi * File_length
    if (
      Worldmoney == null ||
      Worldmoney == undefined ||
      Worldmoney <= 0 ||
      isNaN(Worldmoney)
    ) {
      Worldmoney = 1
    }
    Worldmoney = Number(Worldmoney)
    Math.trunc(Worldmoney)
    await redis.set('Xiuxian:Worldmoney', Worldmoney)

    for (let i = 0; i < File_length; i++) {
      let this_qq = File[i].replace('.json', '')
      await Add_灵石(this_qq, lingshi)
    }

    e.reply(`福利发放成功,目前共有${File_length}个玩家,每人增加${lingshi}灵石`)
    return false
  }

  //发补偿
  async Fuli(e) {
    if (!e.isGroup || e.user_id == 80000000) return false

    if (!e.isMaster) return false
    //获取发送灵石数量
    let lingshi = e.msg.replace('#', '')
    lingshi = lingshi.replace('发', '')
    lingshi = lingshi.replace('补偿', '')

    let pattern = new RegExp('[0-9]+')
    let str = lingshi

    if (!pattern.test(str)) {
      e.reply(`错误福利`)
      return false
    }

    //校验输入灵石数
    if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) > 0) {
      lingshi = parseInt(lingshi)
    } else {
      lingshi = 100 //没有输入正确数字或不是正数
    }

    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) {
      return false
    }
    let atItem = e.message.filter((item) => item.type === 'at')
    let this_qq = atItem[0].qq
    //有无存档
    let ifexistplay = await existplayer(this_qq)
    if (!ifexistplay) {
      e.reply(`此人尚未踏入仙途`)
      return false
    }

    let Worldmoney = await redis.get('Xiuxian:Worldmoney')
    if (
      Worldmoney == null ||
      Worldmoney == undefined ||
      Worldmoney <= 0 ||
      isNaN(Worldmoney)
    ) {
      Worldmoney = 1
    }
    Worldmoney = Number(Worldmoney)

    if (Worldmoney <= lingshi) {
      e.reply('世界财富不足！')
      return false
    }

    Worldmoney = Worldmoney - lingshi
    if (
      Worldmoney == null ||
      Worldmoney == undefined ||
      Worldmoney <= 0 ||
      isNaN(Worldmoney)
    ) {
      Worldmoney = 1
    }
    Worldmoney = Number(Worldmoney)
    await redis.set('Xiuxian:Worldmoney', Worldmoney)

    let player = await data.getData('player', this_qq)
    await Add_灵石(this_qq, lingshi)
    e.reply(`【全服公告】 ${player.名号} 获得${lingshi}灵石的补偿`)
    return false
  }

  async openwallet(e) {
    if (!e.isGroup || e.user_id == 80000000) return false

    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) {
      return false
    }
    let player = await data.getData('player', usr_qq)
    let thing_name = '水脚脚的钱包'

    //x是纳戒内有的数量
    let acount = await exist_najie_thing(usr_qq, thing_name, '装备')

    //没有
    if (!acount) {
      e.reply(`你没有[${thing_name}]这样的装备`)
      return false
    }

    //扣掉装备
    await Add_najie_thing(usr_qq, thing_name, '装备', -1)

    //获得随机
    let x = 0.4
    let random1 = Math.random()
    let y = 0.3
    let random2 = Math.random()
    let z = 0.2
    let random3 = Math.random()
    let p = 0.1
    let random4 = Math.random()
    let m = ''
    let lingshi = 0
    //查找秘境
    if (random1 < x) {
      if (random2 < y) {
        if (random3 < z) {
          if (random4 < p) {
            lingshi = 1000000
            m =
              player.名号 +
              '打开了[' +
              thing_name +
              ']你很开心的得到了' +
              lingshi +
              '颗灵石！'
          } else {
            lingshi = 100000
            m =
              player.名号 +
              '打开了[' +
              thing_name +
              ']你很开心的得到了' +
              lingshi +
              '颗灵石！'
          }
        } else {
          lingshi = 10000
          m =
            player.名号 +
            '打开了[' +
            thing_name +
            ']你很开心的得到了' +
            lingshi +
            '颗灵石！'
        }
      } else {
        lingshi = 1000
        m =
          player.名号 +
          '打开了[' +
          thing_name +
          ']你很开心的得到了' +
          lingshi +
          '颗灵石！'
      }
    } else {
      lingshi = 100
      m =
        player.名号 +
        '打开了[' +
        thing_name +
        ']你很开心的得到了' +
        lingshi +
        '颗灵石！'
    }
    await Add_灵石(usr_qq, lingshi)
    e.reply(m)
    return false
  }
}
