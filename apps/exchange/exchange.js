import { plugin, name, dsc } from '../../api/api.js'
import data from '../../model/xiuxiandata.js'
import {
  __PATH,
  Go,
  existplayer,
  exist_najie_thing,
  ForwardMsg,
  Read_player,
  isNotNull,
  Add_najie_thing,
  Add_灵石,
  Read_exchange,
  Write_exchange
} from '../../model/xiuxian.js'
import config from '../../model/config.js'
export class exchange extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        {
          reg: '^#冲水堂$',
          fnc: 'supermarket'
        },
        {
          reg: '^#上架.*$',
          fnc: 'onsell'
        },
        {
          reg: '^#下架.*$',
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
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = config.getconfig('parameter', 'namelist')
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    //固定写法
    let usr_qq = e.user_id
    //判断是否为匿名创建存档
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let Ex = await redis.get('xiuxian:player:' + usr_qq + ':exchange')
    if (Ex != 1) {
      e.reply('没有上架物品！')
      return false
    }

    //防并发cd
    let time0 = 2 //分钟cd
    //获取当前时间
    let now_time = new Date().getTime()
    let exchangeCD = await redis.get('xiuxian:player:' + usr_qq + ':exchangeCD')
    exchangeCD = parseInt(exchangeCD)
    let transferTimeout = parseInt(60000 * time0)
    if (now_time < exchangeCD + transferTimeout) {
      let exchangeCDm = Math.trunc(
        (exchangeCD + transferTimeout - now_time) / 60 / 1000
      )
      let exchangeCDs = Math.trunc(
        ((exchangeCD + transferTimeout - now_time) % 60000) / 1000
      )
      e.reply(
        `每${transferTimeout / 1000 / 60}操作一次，` +
          `CD: ${exchangeCDm}分${exchangeCDs}秒`
      )
      //存在CD。直接返回
      return false
    }

    //记录本次执行时间
    await redis.set('xiuxian:player:' + usr_qq + ':exchangeCD', now_time)
    let player = await Read_player(usr_qq)
    let now_level_id
    if (!isNotNull(player.level_id)) {
      e.reply('请先#同步信息')
      return false
    }
    now_level_id = data.level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    if (now_level_id < 9) {
      e.reply('境界过低！')
      return false
    }

    let thingqq = e.msg.replace('#', '')
    thingqq = thingqq.replace('下架', '')
    if (thingqq == '') return false
    let x = 888888888
    let exchange
    try {
      exchange = await Read_exchange()
    } catch {
      //没有表要先建立一个！
      await Write_exchange([])
      exchange = await Read_exchange()
    }
    for (let i = 0; i < exchange.length; i++) {
      //对比编号
      if (exchange[i].qq == thingqq) {
        x = i
        break
      }
    }

    if (x == 888888888) {
      e.reply('找不到该商品编号！')
      return false
    }

    //要查看冷却
    let nowtime = new Date().getTime()
    let end_time = exchange[x].end_time
    let time = (end_time - nowtime) / 60000
    time = Math.trunc(time)

    if (time <= 0) {
      //对比qq是否相等
      if (thingqq != usr_qq) {
        return false
      }

      if (player.灵石 <= 50000) {
        e.reply('下架物品至少上交1w')
        return false
      }

      let thing_name = exchange[x].name.name
      let thing_class = exchange[x].name.class
      let thing_aconut = exchange[x].aconut
      await Add_najie_thing(usr_qq, thing_name, thing_class, thing_aconut)
      exchange = exchange.filter((item) => item.qq != thingqq)
      await Write_exchange(exchange)

      await Add_灵石(usr_qq, -50000)
      await redis.set('xiuxian:player:' + thingqq + ':exchange', 0)
      e.reply(player.名号 + '赔10W保金！并下架' + thingqq + '成功！')
      let addWorldmoney = 50000

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
      Worldmoney = Worldmoney + addWorldmoney
      Worldmoney = Number(Worldmoney)
      await redis.set('Xiuxian:Worldmoney', Worldmoney)
    } else {
      e.reply('物品冷却中...')
    }
    return false
  }

  //上架
  async onsell(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = config.getconfig('parameter', 'namelist')
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    //固定写法
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false

    let Ex = await redis.get('xiuxian:player:' + usr_qq + ':exchange')
    if (Ex == 1) {
      e.reply('已有上架物品')
      return false
    }
    let thing = e.msg.replace('#', '')
    thing = thing.replace('上架', '')
    let code = thing.split('*')
    let thing_name = code[0] //物品
    let thing_value = code[1] //价格
    let thing_acunot = code[2] //数量
    if (thing_acunot > 99) return false
    if (
      thing_acunot < 1 ||
      thing_acunot == null ||
      thing_acunot == undefined ||
      isNaN(thing_acunot)
    ) {
      thing_acunot = 1
    }
    if (thing_value <= 0) return false
    if (!isNaN(parseFloat(thing_value)) && isFinite(thing_value)) {
      console.log('通过')
    } else {
      return false
    }
    if (!isNaN(parseFloat(thing_acunot)) && isFinite(thing_acunot)) {
      console.log('通过')
    } else {
      return false
    }
    //判断列表中是否存在，不存在不能卖,并定位是什么物品
    let z = 0 //默认是丹药
    //查找丹药列表
    let ifexist0 = data.danyao_list.find((item) => item.name == thing_name)
    //查找道具列表
    let ifexist1 = data.daoju_list.find((item) => item.name == thing_name)
    //查找功法列表
    let ifexist2 = data.gongfa_list.find((item) => item.name == thing_name)
    //查找装备列表
    let ifexist3 = data.equipment_list.find((item) => item.name == thing_name)
    //查找药草列表
    let ifexist4 = data.caoyao_list.find((item) => item.name == thing_name)
    //限定
    let ifexist5 = data.timegongfa_list.find((item) => item.name == thing_name)
    let ifexist6 = data.timeequipmen_list.find(
      (item) => item.name == thing_name
    )
    let ifexist7 = data.timedanyao_list.find((item) => item.name == thing_name)
    if (ifexist0) {
      console.log('通过')
    } else if (ifexist1) {
      ifexist0 = ifexist1
      z = 1
    } else if (ifexist2) {
      ifexist0 = ifexist2
      z = 2
    } else if (ifexist3) {
      ifexist0 = ifexist3
      z = 3
    } else if (ifexist4) {
      ifexist0 = ifexist4
      z = 4
    } else if (ifexist5) {
      ifexist0 = ifexist5
      z = 5
    } else if (ifexist6) {
      ifexist0 = ifexist6
      z = 6
    } else if (ifexist7) {
      ifexist0 = ifexist7
      z = 7
    } else {
      e.reply(`这方世界没有[${thing_name}]`)
      return false
    }
    //判断戒指中是否存在
    let thing_quantity = await exist_najie_thing(
      usr_qq,
      thing_name,
      ifexist0.class
    )
    if (!thing_quantity) {
      //没有
      e.reply(`你没有[${thing_name}]这样的${ifexist0.class}`)
      return false
    }
    //判断戒指中的数量
    if (thing_quantity < thing_acunot) {
      //不够
      e.reply(`你目前只有[${thing_name}]*${thing_quantity}`)
      return false
    }
    //修正数值非整数
    thing_value = Math.trunc(thing_value) //价格
    thing_acunot = Math.trunc(thing_acunot) //数量
    if (z >= 5) {
      //是限定武器:价格随意至少10w
      if (thing_value <= 100000 && thing_value > 100000000) {
        //价格过低，价格过高
        e.reply('限定物品错误价格')
        return false
      }
    } else {
      if (thing_value <= ifexist0.出售价 * 0.8) {
        e.reply('价格过低')
        return false
      }
      if (thing_value >= ifexist0.出售价 * 3) {
        e.reply('价格过高')
        return false
      }
    }

    await Add_najie_thing(usr_qq, thing_name, ifexist0.class, -thing_acunot)
    let exchange
    try {
      exchange = await Read_exchange()
    } catch {
      await Write_exchange([])
      exchange = await Read_exchange()
    }
    let now_time = new Date().getTime()
    let whole = thing_value * thing_acunot
    whole = Math.trunc(whole)
    let time = 10 //分钟
    let wupin = {
      qq: usr_qq,
      name: ifexist0,
      price: thing_value,
      aconut: thing_acunot,
      whole: whole,
      now_time: now_time,
      end_time: now_time + 60000 * time
    }
    //
    exchange.push(wupin)
    //写入
    await Write_exchange(exchange)
    e.reply('上架成功！')
    await redis.set('xiuxian:player:' + usr_qq + ':exchange', 1)
    return false
  }

  async supermarket(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = config.getconfig('parameter', 'namelist')
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    let exchange
    try {
      exchange = await Read_exchange()
    } catch {
      //没有表要先建立一个！
      await Write_exchange([])
      exchange = await Read_exchange()
    }

    let nowtime = new Date().getTime()
    let msg = [
      '___[冲水堂]___\n#上架+物品名*价格*数量\n#选购+编号\n#下架+编号\n不填数量，默认为1'
    ]
    for (let i = 0; i < exchange.length; i++) {
      let time = (exchange[i].end_time - nowtime) / 60000
      if (time <= 0) {
        time = 0
      }
      time = Math.trunc(time)
      msg.push(
        '编号:' +
          exchange[i].qq +
          '\n物品:' +
          exchange[i].name.name +
          '\n类型:' +
          exchange[i].name.class +
          '\n价格:' +
          exchange[i].price +
          '\n数量:' +
          exchange[i].aconut +
          '\n总价:' +
          exchange[i].whole +
          '\n冷却:' +
          time +
          '分钟'
      )
    }
    await ForwardMsg(e, msg)
    return false
  }

  async purchase(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    const { whitecrowd, blackid } = config.getconfig('parameter', 'namelist')
    if (whitecrowd.indexOf(e.group_id) == -1) return false
    if (blackid.indexOf(e.user_id) != -1) return false
    let usr_qq = e.user_id
    //全局状态判断
    const T = await Go(e)
    if (!T) return false
    //防并发cd
    let time0 = 2 //分钟cd
    //获取当前时间
    let now_time = new Date().getTime()
    let exchangeCD = await redis.get('xiuxian:player:' + usr_qq + ':exchangeCD')
    exchangeCD = parseInt(exchangeCD)
    let transferTimeout = parseInt(60000 * time0)
    if (now_time < exchangeCD + transferTimeout) {
      let exchangeCDm = Math.trunc(
        (exchangeCD + transferTimeout - now_time) / 60 / 1000
      )
      let exchangeCDs = Math.trunc(
        ((exchangeCD + transferTimeout - now_time) % 60000) / 1000
      )
      e.reply(
        `每${transferTimeout / 1000 / 60}操作一次，` +
          `CD: ${exchangeCDm}分${exchangeCDs}秒`
      )
      //存在CD。直接返回
      return false
    }
    //记录本次执行时间
    await redis.set('xiuxian:player:' + usr_qq + ':exchangeCD', now_time)

    let player = await Read_player(usr_qq)
    let now_level_id
    if (!isNotNull(player.level_id)) {
      e.reply('请先#同步信息')
      return false
    }

    now_level_id = data.level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    if (now_level_id < 9) {
      e.reply('境界过低')
      return false
    }

    let thingqq = e.msg.replace('#', '')
    //拿到物品与数量
    thingqq = thingqq.replace('选购', '')
    if (thingqq == '') {
      return false
    }

    let x = 888888888
    //根据物品的qq主人来购买
    let exchange
    try {
      exchange = await Read_exchange()
    } catch {
      //没有表要先建立一个！
      await Write_exchange([])
      exchange = await Read_exchange()
    }

    for (let i = 0; i < exchange.length; i++) {
      //对比编号
      if (exchange[i].qq == thingqq) {
        x = i
        break
      }
    }
    if (x == 888888888) {
      e.reply('找不到该商品编号！')
      return false
    }

    //要查看冷却
    let nowtime = new Date().getTime()
    let end_time = exchange[x].end_time
    let time = (end_time - nowtime) / 60000
    time = Math.trunc(time)

    if (time <= 0) {
      //根据qq得到物品
      let thing_name = exchange[x].name.name
      let thing_class = exchange[x].name.class
      let thing_whole = exchange[x].whole
      let thing_aconut = exchange[x].aconut
      //查灵石
      if (player.灵石 > thing_whole) {
        //加物品
        await Add_najie_thing(usr_qq, thing_name, thing_class, thing_aconut)
        //扣钱
        await Add_灵石(usr_qq, -thing_whole)

        let addWorldmoney = thing_whole * 0.1
        thing_whole = thing_whole * 0.9

        thing_whole = Math.trunc(thing_whole)
        //加钱
        await Add_灵石(thingqq, thing_whole)
        //删除该位置信息
        exchange = exchange.filter((item) => item.qq != thingqq)
        await Write_exchange(exchange)
        //改状态
        await redis.set('xiuxian:player:' + thingqq + ':exchange', 0)
        e.reply(player.名号 + '选购' + thingqq + '成功！')
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
        Worldmoney = Worldmoney + addWorldmoney
        Worldmoney = Number(Worldmoney)
        await redis.set('Xiuxian:Worldmoney', Worldmoney)
      } else {
        e.reply('醒醒，你没有那么多钱！')
        return false
      }
    } else {
      e.reply('物品冷却中...')
    }
    return false
  }
}
