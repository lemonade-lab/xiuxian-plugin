import { readdirSync } from 'fs'
import {
  Read_player,
  existplayer,
  exist_najie_thing,
  foundthing,
  Read_najie,
  Go,
  Add_money,
  Add_najie_thing,
  convert2integer,
  __PATH,
  Add_now_exp,
  Add_血气,
  getConfig,
  data
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class MoneyOperation extends plugin {
  constructor() {
    super({
      name: 'MoneyOperation',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#赠送.*$',
          fnc: 'Give'
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
          reg: '^#发.*$',
          fnc: 'wup'
        },
        {
          reg: '^#全体发.*$',
          fnc: 'wup_all'
        },
        {
          reg: '^#打开钱包$',
          fnc: 'openwallet'
        },
        {
          reg: '#交税[1-9]d*',
          fnc: 'MoneyWord'
        }
      ]
    })
  }

  async wup(e) {
    if (!e.isMaster) return false
    //对方
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) return false
    let atItem = e.message.filter((item) => item.type === 'at') //获取at信息
    let B_qq = atItem[0].qq //对方qq
    //检查存档
    let ifexistplay = await existplayer(B_qq)
    if (!ifexistplay) {
      e.reply('对方无存档')
      return false
    }
    //获取发送灵石数量
    let thing_name = e.msg.replace('#发', '')
    let code = thing_name.split('*')
    thing_name = code[0]
    let thing_amount = code[1] //数量
    let thing_piji
    thing_amount = Number(thing_amount)
    if (isNaN(thing_amount)) {
      thing_amount = 1
    }
    if (thing_name == '灵石') {
      await Add_money(B_qq, thing_amount)
    } else if (thing_name == 'now_exp') {
      await Add_now_exp(B_qq, thing_amount)
    } else if (thing_name == '血气') {
      await Add_血气(B_qq, thing_amount)
    } else {
      let thing_exist = await foundthing(thing_name)
      if (!thing_exist) {
        e.reply(`这方世界没有[${thing_name}]`)
        return false
      }
      let pj = {
        劣: 0,
        普: 1,
        优: 2,
        精: 3,
        极: 4,
        绝: 5,
        顶: 6
      }
      thing_piji = pj[code[1]]
      if (thing_exist.class == '装备') {
        if (thing_piji) {
          thing_amount = code[2]
        } else {
          thing_piji = 0
        }
      }
      thing_amount = Number(thing_amount)
      if (isNaN(thing_amount)) {
        thing_amount = 1
      }
      await Add_najie_thing(
        B_qq,
        thing_name,
        thing_exist.class,
        thing_amount,
        thing_piji
      )
    }
    e.reply(`发放成功,增加${thing_name} x ${thing_amount}`)
    return false
  }

  async wup_all(e) {
    if (!e.isMaster) return false
    //所有玩家
    let File = readdirSync(__PATH.player_path)
    File = File.filter((file) => file.endsWith('.json'))
    let File_length = File.length
    //获取发送灵石数量
    let thing_name = e.msg.replace('#全体发', '')
    let code = thing_name.split('*')
    thing_name = code[0]
    let thing_amount = code[1] //数量
    let thing_piji
    thing_amount = Number(thing_amount)
    if (isNaN(thing_amount)) {
      thing_amount = 1
    }
    if (thing_name == '灵石') {
      for (let i = 0; i < File_length; i++) {
        let this_qq = File[i].replace('.json', '')
        await Add_money(this_qq, thing_amount)
      }
    } else if (thing_name == 'now_exp') {
      for (let i = 0; i < File_length; i++) {
        let this_qq = File[i].replace('.json', '')
        await Add_now_exp(this_qq, thing_amount)
      }
    } else if (thing_name == '血气') {
      for (let i = 0; i < File_length; i++) {
        let this_qq = File[i].replace('.json', '')
        await Add_血气(this_qq, thing_amount)
      }
    } else {
      let thing_exist = await foundthing(thing_name)
      if (!thing_exist) {
        e.reply(`这方世界没有[${thing_name}]`)
        return false
      }
      let pj = {
        劣: 0,
        普: 1,
        优: 2,
        精: 3,
        极: 4,
        绝: 5,
        顶: 6
      }
      thing_piji = pj[code[1]]
      if (thing_exist.class == '装备') {
        if (thing_piji) {
          thing_amount = code[2]
        } else {
          thing_piji = 0
        }
      }
      thing_amount = Number(thing_amount)
      if (isNaN(thing_amount)) {
        thing_amount = 1
      }
      for (let i = 0; i < File_length; i++) {
        let this_qq = File[i].replace('.json', '')
        await Add_najie_thing(
          this_qq,
          thing_name,
          thing_exist.class,
          thing_amount,
          thing_piji
        )
      }
    }
    e.reply(
      `发放成功,目前共有${File_length}个玩家,每人增加${thing_name} x ${thing_amount}`
    )
    return false
  }

  async MoneyWord(e) {
    //这是自己the
    let usr_qq = e.user_id
    //自己没存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    //获取发送灵石数量
    let lingshi = e.msg.replace('#', '')
    lingshi = lingshi.replace('交税', '')
    lingshi = await convert2integer(lingshi)
    let player = await Read_player(usr_qq)
    if (player.灵石 <= lingshi) {
      e.reply('醒醒，你没有那么多')
      return false
    }
    await Add_money(usr_qq, -lingshi)
    e.reply('成功交税' + lingshi)
    return false
  }

  async Give(e) {
    //这是自己the
    let A_qq = e.user_id
    //自己没存档
    let ifexistplay = await existplayer(A_qq)
    if (!ifexistplay) return false
    //对方
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) return false
    let atItem = e.message.filter((item) => item.type === 'at') //获取at信息
    let B_qq = atItem[0].qq //对方qq
    //对方没存档
    ifexistplay = await existplayer(B_qq)
    if (!ifexistplay) {
      e.reply(`此人尚未踏入仙途`)
      return false
    }
    let A_player = await data.getData('player', A_qq)
    let B_player = await data.getData('player', B_qq)
    //获取发送灵石数量
    let msg = e.msg.replace('#赠送', '')
    const cf = getConfig('xiuxian', 'xiuxian')
    if (msg.startsWith('灵石')) {
      let lingshi = msg.replace('灵石*', '')
      //校验输入灵石数
      lingshi = await convert2integer(lingshi)
      //没有输入正确数字或＜1000;
      //检验A有没有那么多灵石
      const cost = cf.percentage.cost
      let lastlingshi = lingshi + Math.trunc(lingshi * cost)
      if (A_player.灵石 < lastlingshi) {
        e.reply([segment.at(A_qq), `你身上似乎没有${lastlingshi}灵石`])
        return false
      }
      let now = new Date()
      let nowTime = now.getTime() //获取当前时间戳
      let lastgetbung_time = await redis.get(
        'xiuxian@1.4.0:' + A_qq + ':last_getbung_time'
      )
      lastgetbung_time = parseInt(lastgetbung_time)
      let transferTimeout = parseInt(cf.CD.transfer * 60000)
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
      await Add_money(A_qq, -lastlingshi)
      await Add_money(B_qq, lingshi)
      e.reply([
        segment.at(A_qq),
        segment.at(B_qq),
        `${B_player.name} 获得了由 ${A_player.name}赠送the${lingshi}灵石`
      ])
      //记录本次获得赠送灵石the时间戳
      await redis.set('xiuxian@1.4.0:' + A_qq + ':last_getbung_time', nowTime)
      return false
    } else {
      let code = msg.split('*')
      let thing_name = code[0]
      code[0] = parseInt(code[0])
      let quantity = code[1]
      let thing_piji
      let najie = await Read_najie(A_qq)
      if (code[0]) {
        if (code[0] > 1000) {
          try {
            thing_name = najie.仙宠[code[0] - 1001].name
          } catch {
            e.reply('仙宠代号输入有误!')
            return false
          }
        } else if (code[0] > 100) {
          try {
            thing_name = najie.装备[code[0] - 101].name
            code[1] = najie.装备[code[0] - 101].pinji
          } catch {
            e.reply('装备代号输入有误!')
            return false
          }
        }
      }
      let thing_exist = await foundthing(thing_name)
      if (!thing_exist) {
        e.reply(`这方世界没有[${thing_name}]`)
        return false
      }
      let pj = {
        劣: 0,
        普: 1,
        优: 2,
        精: 3,
        极: 4,
        绝: 5,
        顶: 6
      }
      let equ
      thing_piji = pj[code[1]]
      if (thing_exist.class == '装备') {
        if (thing_piji) {
          quantity = code[2]
          equ = najie.装备.find(
            (item) => item.name == thing_name && item.pinji == thing_piji
          )
        } else {
          equ = najie.装备.find((item) => item.name == thing_name)
          for (let i of najie.装备) {
            //遍历列表有没有比那把强the
            if (i.name == thing_name && i.pinji < equ.pinji) {
              equ = i
            }
          }
          thing_piji = equ.pinji
        }
      } else if (thing_exist.class == '仙宠') {
        equ = najie.仙宠.find((item) => item.name == thing_name)
      }
      quantity = await convert2integer(quantity)
      let x = await exist_najie_thing(
        A_qq,
        thing_name,
        thing_exist.class,
        thing_piji
      )
      if (x < quantity || !x) {
        e.reply(`你还没有这么多[${thing_name}]`)
        return false
      }
      await Add_najie_thing(
        A_qq,
        thing_name,
        thing_exist.class,
        -quantity,
        thing_piji
      )
      if (thing_exist.class == '装备' || thing_exist.class == '仙宠') {
        await Add_najie_thing(
          B_qq,
          equ,
          thing_exist.class,
          quantity,
          thing_piji
        )
      } else {
        await Add_najie_thing(
          B_qq,
          thing_name,
          thing_exist.class,
          quantity,
          thing_piji
        )
      }
      e.reply([
        segment.at(A_qq),
        segment.at(B_qq),
        `${B_player.name} 获得了由 ${A_player.name}赠送the[${thing_name}]×${quantity}`
      ])
    }
  }

  //发红包
  async Give_honbao(e) {
    //这是自己the
    let usr_qq = e.user_id
    //自己没存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    //获取发送灵石数量
    let lingshi = e.msg.replace('#', '')
    lingshi = lingshi.replace('发红包', '')
    let flag = await Go(e)
    if (!flag) {
      return false
    }
    let code = lingshi.split('*')
    lingshi = code[0]
    let acount = code[1]
    lingshi = await convert2integer(lingshi)
    acount = await convert2integer(acount)
    let player = await data.getData('player', usr_qq)
    //对比自己the灵石，看看够不够！
    if (player.灵石 <= lingshi * acount) {
      e.reply(`红包数要比自身灵石数小噢`)
      return false
    }
    lingshi = Math.trunc(lingshi / 10000) * 10000
    //发送the灵石要当到数据库里。大家都能取
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':honbao', lingshi)
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':honbaoacount', acount)
    //然后扣灵石
    await Add_money(usr_qq, -lingshi * acount)
    e.reply(
      '【全服公告】' +
        player.name +
        '发了' +
        acount +
        '个' +
        lingshi +
        '灵石the红包！'
    )
    return false
  }

  //抢红包
  async uer_honbao(e) {
    let usr_qq = e.user_id
    //自己没存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let player = await data.getData('player', usr_qq)
    //抢红包要有一分钟theCD
    let now_time = new Date().getTime()
    let lastgetbung_time = await redis.get(
      'xiuxian@1.4.0:' + usr_qq + ':last_getbung_time'
    )
    lastgetbung_time = parseInt(lastgetbung_time)
    const cf = getConfig('xiuxian', 'xiuxian')
    let transferTimeout = parseInt(cf.CD.honbao * 60000)
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
    if (!isat) return false
    let atItem = e.message.filter((item) => item.type === 'at')
    let honbao_qq = atItem[0].qq
    //有无存档
    let ifexistplay_honbao = await existplayer(honbao_qq)
    if (!ifexistplay_honbao) {
      return false
    }
    //这里有错
    let acount = await redis.get('xiuxian@1.4.0:' + honbao_qq + ':honbaoacount')
    acount = Number(acount)
    //根据个数判断
    if (acount <= 0) {
      e.reply('他the红包被光啦！')
      return false
    }
    //看看一个有多少灵石
    const lingshi = await redis.get('xiuxian@1.4.0:' + honbao_qq + ':honbao')
    const addlingshi = Math.trunc(lingshi)
    //减少个数
    acount--
    await redis.set('xiuxian@1.4.0:' + honbao_qq + ':honbaoacount', acount)
    //拿出来the要给玩家
    await Add_money(usr_qq, addlingshi)
    //给个提示
    e.reply(
      '【全服公告】' + player.name + '抢到一个' + addlingshi + '灵石the红包！'
    )
    //记录时间
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':last_getbung_time', now_time)
    return false
  }

  async openwallet(e) {
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let player = await data.getData('player', usr_qq)
    let thing_name = '水脚脚the钱包'
    //x是纳戒内有the数量
    let acount = await exist_najie_thing(usr_qq, thing_name, '装备')
    //没有
    if (!acount) {
      e.reply(`你没有[${thing_name}]这样the装备`)
      return false
    }
    //扣掉装备
    await Add_najie_thing(usr_qq, thing_name, '装备', -1)
    //获得随机
    const x = 0.4
    let random1 = Math.random()
    const y = 0.3
    let random2 = Math.random()
    const z = 0.2
    let random3 = Math.random()
    const p = 0.1
    let random4 = Math.random()
    let m = ''
    let lingshi = 0
    //查找秘境
    if (random1 < x) {
      if (random2 < y) {
        if (random3 < z) {
          if (random4 < p) {
            lingshi = 2000000
            m =
              player.name +
              '打开了[' +
              thing_name +
              ']金光一现！' +
              lingshi +
              '颗灵石！'
          } else {
            lingshi = 1000000
            m =
              player.name +
              '打开了[' +
              thing_name +
              ']金光一现!' +
              lingshi +
              '颗灵石！'
          }
        } else {
          lingshi = 400000
          m =
            player.name +
            '打开了[' +
            thing_name +
            ']你很开心the得到了' +
            lingshi +
            '颗灵石！'
        }
      } else {
        lingshi = 180000
        m =
          player.name +
          '打开了[' +
          thing_name +
          ']你很开心the得到了' +
          lingshi +
          '颗灵石！'
      }
    } else {
      lingshi = 100000
      m =
        player.name +
        '打开了[' +
        thing_name +
        ']你很开心the得到了' +
        lingshi +
        '颗灵石！'
    }
    await Add_money(usr_qq, lingshi)
    e.reply(m)
    return false
  }
}
