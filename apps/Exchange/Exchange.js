import { plugin, verc } from '../../api/api.js'
import {
  existplayer,
  exist_najie_thing,
  Read_player,
  Read_najie,
  foundthing,
  __PATH,
  convert2integer,
  Add_najie_thing,
  Add_灵石,
  Go,
  get_supermarket_img,
  Write_Exchange,
  Read_Exchange
} from '../../model/xiuxian.js'
export class Exchange extends plugin {
  constructor() {
    super({
      name: 'Exchange',
      dsc: '交易模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#冲水堂(装备|丹药|功法|道具|草药|仙宠|材料)?$',
          fnc: 'show_supermarket'
        },
        {
          reg: '^#上架.*$',
          fnc: 'onsell'
        },
        {
          reg: '^#下架[1-9]d*',
          fnc: 'Offsell'
        },
        {
          reg: '^#选购.*$',
          fnc: 'purchase'
        }
      ]
    })
  }
  async Offsell(e) {
    if (!verc({ e })) return false
    //固定写法
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    //防并发cd
    var time0 = 0.5 //分钟cd
    //获取当前时间
    let now_time = new Date().getTime()
    let ExchangeCD = await redis.get('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD')
    ExchangeCD = parseInt(ExchangeCD)
    let transferTimeout = parseInt(60000 * time0)
    if (now_time < ExchangeCD + transferTimeout) {
      let ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000)
      let ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000)
      e.reply(
        `每${transferTimeout / 1000 / 60}分钟操作一次，` + `CD: ${ExchangeCDm}分${ExchangeCDs}秒`
      )
      //存在CD。直接返回
      return false
    }
    let Exchange
    //记录本次执行时间
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD', now_time)
    let player = await Read_player(usr_qq)
    let x = parseInt(e.msg.replace('#下架', '')) - 1
    try {
      Exchange = await Read_Exchange()
    } catch {
      //没有表要先建立一个！
      await Write_Exchange([])
      Exchange = await Read_Exchange()
    }
    if (x >= Exchange.length) {
      e.reply(`没有编号为${x + 1}的物品`)
      return false
    }
    let thingqq = Exchange[x].qq
    //对比qq是否相等
    if (thingqq != usr_qq) {
      e.reply('不能下架别人上架的物品')
      return false
    }
    let thing_name = Exchange[x].name.name
    let thing_class = Exchange[x].name.class
    let thing_amount = Exchange[x].aconut
    if (thing_class == '装备' || thing_class == '仙宠') {
      await Add_najie_thing(usr_qq, Exchange[x].name, thing_class, thing_amount, Exchange[x].pinji2)
    } else {
      await Add_najie_thing(usr_qq, thing_name, thing_class, thing_amount)
    }
    Exchange.splice(x, 1)
    await Write_Exchange(Exchange)
    await redis.set('xiuxian@1.3.0:' + thingqq + ':Exchange', 0)
    e.reply(player.名号 + '下架' + thing_name + '成功！')
    return false
  }

  //上架
  async onsell(e) {
    if (!verc({ e })) return false
    //固定写法
    let usr_qq = e.user_id
    //判断是否为匿名创建存档
    if (usr_qq == 80000000) return false
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let najie = await Read_najie(usr_qq)
    let thing = e.msg.replace('#', '')
    thing = thing.replace('上架', '')
    let code = thing.split('*')
    let thing_name = code[0] //物品
    code[0] = parseInt(code[0])
    let thing_value = code[1] //价格
    let thing_amount = code[2] //数量
    let thing_piji //品级
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
        } catch {
          e.reply('装备代号输入有误!')
          return false
        }
      }
    }
    //判断列表中是否存在，不存在不能卖,并定位是什么物品
    let thing_exist = await foundthing(thing_name)
    if (!thing_exist) {
      e.reply(`这方世界没有[${thing_name}]`)
      return false
    }
    //确定数量和品级
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
        thing_value = code[2]
        thing_amount = code[3]
        equ = najie.装备.find((item) => item.name == thing_name && item.pinji == thing_piji)
      } else {
        let najie = await Read_najie(usr_qq)
        equ = najie.装备.find((item) => item.name == thing_name)
        for (var i of najie.装备) {
          //遍历列表有没有比那把强的
          if (i.name == thing_name && i.pinji < equ.pinji) {
            equ = i
          }
        }
        thing_piji = equ.pinji
      }
    } else if (thing_exist.class == '仙宠') {
      equ = najie.仙宠.find((item) => item.name == thing_name)
    }
    thing_value = await convert2integer(thing_value)
    thing_amount = await convert2integer(thing_amount)
    let x = await exist_najie_thing(usr_qq, thing_name, thing_exist.class, thing_piji)
    //判断戒指中是否存在
    if (!x || x < thing_amount) {
      e.reply(`你没有那么多[${thing_name}]`)
      return false
    }
    let Exchange
    try {
      Exchange = await Read_Exchange()
    } catch {
      await Write_Exchange([])
      Exchange = await Read_Exchange()
    }
    let now_time = new Date().getTime()
    let whole = Math.trunc(thing_value * thing_amount)
    let off = Math.trunc(whole * 0.03)
    if (off < 100000) off = 100000
    let player = await Read_player(usr_qq)
    if (player.灵石 < off) {
      e.reply('就这点灵石还想上架')
      return false
    }
    await Add_灵石(usr_qq, -off)
    let wupin
    if (thing_exist.class == '装备' || thing_exist.class == '仙宠') {
      let pinji2 = ['劣', '普', '优', '精', '极', '绝', '顶']
      pj = pinji2[thing_piji]
      wupin = {
        qq: usr_qq,
        name: equ,
        price: thing_value,
        pinji2: thing_piji,
        pinji: pj,
        aconut: thing_amount,
        whole: whole,
        now_time: now_time
      }
      await Add_najie_thing(usr_qq, equ.name, thing_exist.class, -thing_amount, thing_piji)
    } else {
      wupin = {
        qq: usr_qq,
        name: thing_exist,
        price: thing_value,
        aconut: thing_amount,
        whole: whole,
        now_time: now_time
      }
      await Add_najie_thing(usr_qq, thing_name, thing_exist.class, -thing_amount)
    }
    //
    Exchange.push(wupin)
    //写入
    await Write_Exchange(Exchange)
    e.reply('上架成功！')
    return false
  }

  async show_supermarket(e) {
    if (!verc({ e })) return false
    let thing_class = e.msg.replace('#冲水堂', '')
    let img = await get_supermarket_img(e, thing_class)
    e.reply(img)
    return false
  }

  async purchase(e) {
    if (!verc({ e })) return false
    let usr_qq = e.user_id
    //全局状态判断
    let flag = await Go(e)
    if (!flag) return false
    //防并发cd
    var time0 = 0.5 //分钟cd
    //获取当前时间
    let now_time = new Date().getTime()
    let ExchangeCD = await redis.get('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD')
    ExchangeCD = parseInt(ExchangeCD)
    let transferTimeout = parseInt(60000 * time0)
    if (now_time < ExchangeCD + transferTimeout) {
      let ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000)
      let ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000)
      e.reply(
        `每${transferTimeout / 1000 / 60}分钟操作一次，` + `CD: ${ExchangeCDm}分${ExchangeCDs}秒`
      )
      //存在CD。直接返回
      return false
    }
    //记录本次执行时间
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':ExchangeCD', now_time)
    let player = await Read_player(usr_qq)
    let Exchange
    try {
      Exchange = await Read_Exchange()
    } catch {
      //没有表要先建立一个！
      await Write_Exchange([])
      Exchange = await Read_Exchange()
    }
    let t = e.msg.replace('#选购', '').split('*')
    let x = (await convert2integer(t[0])) - 1
    if (x >= Exchange.length) {
      return false
    }
    let thingqq = Exchange[x].qq
    if (thingqq == usr_qq) {
      e.reply('自己买自己的东西？我看你是闲得蛋疼！')
      return false
    }
    //根据qq得到物品
    let thing_name = Exchange[x].name.name
    let thing_class = Exchange[x].name.class
    let thing_amount = Exchange[x].aconut
    let thing_price = Exchange[x].price
    let n = await convert2integer(t[1])
    if (!t[1]) {
      n = thing_amount
    }
    if (n > thing_amount) {
      e.reply(`冲水堂没有这么多【${thing_name}】!`)
      return false
    }
    let money = n * thing_price
    //查灵石
    if (player.灵石 > money) {
      //加物品
      if (thing_class == '装备' || thing_class == '仙宠') {
        await Add_najie_thing(usr_qq, Exchange[x].name, thing_class, n, Exchange[x].pinji2)
      } else {
        await Add_najie_thing(usr_qq, thing_name, thing_class, n)
      }
      //扣钱
      await Add_灵石(usr_qq, -money)
      //加钱
      await Add_灵石(thingqq, money)
      Exchange[x].aconut = Exchange[x].aconut - n
      Exchange[x].whole = Exchange[x].whole - money
      //删除该位置信息
      Exchange = Exchange.filter((item) => item.aconut > 0)
      await Write_Exchange(Exchange)
      e.reply(`${player.名号}在冲水堂购买了${n}个【${thing_name}】！`)
    } else {
      e.reply('醒醒，你没有那么多钱！')
      return false
    }
    return false
  }
}
