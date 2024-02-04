import {
  __PATH,
  existplayer,
  Read_player,
  isNotNull,
  openAU,
  getConfig
} from '../../model/index.js'
import { common, plugin } from '../../../import.js'
export class Auction extends plugin {
  constructor() {
    super({
      name: 'Auction',
      dsc: '拍卖模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: /^(#|\/)星阁出价.*$/,
          fnc: 'offer_priceXINGGE'
        },
        {
          reg: /^(#|\/)星阁拍卖行$/,
          fnc: 'xingGE'
        },
        {
          reg: /^(#|\/)开启星阁体系$/,
          fnc: 'openAction'
        },
        {
          reg: /^(#|\/)取消星阁体系$/,
          fnc: 'cancalAction'
        },
        {
          reg: /^(#|\/)关闭星阁体系$/,
          fnc: 'offAction'
        }
      ]
    })
    this.set = getConfig('xiuxian', 'xiuxian')
  }

  async xingGE(e) {
    let usr_qq = e.user_id
    if (usr_qq == 80000000) return false

    //固定写法
    //判断是否为匿名创建存档
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let auction = JSON.parse(await redis.get('xiuxian:AuctionofficialTask'))
    if (!isNotNull(auction)) {
      e.reply('目前没有拍卖正在进行')
      return false
    }
    let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`
    if (auction.last_offer_player === 0) {
      msg += '暂无人出价'
    } else {
      const player = await Read_player(auction.last_offer_player)
      msg += `最高出价是${player.name}叫出the${auction.last_price}`
    }
    await e.reply(msg)
  }

  async openAction(e) {
    if (!e.isMaster) {
      e.reply('只有只因器人主人可以开启')
      return false
    }

    // 如果星阁已经开了，将本群加入Redis
    // INFO: 缺省判断是否在进行，GroupList判断哪些群开启了星阁体系
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
    const groupList = await redis.sMembers(redisGlKey)
    if (groupList.length > 0) {
      if (await redis.sIsMember(redisGlKey, String(e.group_id))) {
        console.log(await redis.sMembers(redisGlKey))
        e.reply('星阁拍卖行已经开啦')
        return false
      }
      await redis.sAdd(redisGlKey, String(e.group_id))
      e.reply('星阁已开启，已将本群添加至星阁体系')
      return false
    }

    // 如果没开，判断是否在开启时间
    const nowDate = new Date()
    const todayDate = new Date(nowDate)
    const { openHour, closeHour } = this.set.Auction
    const todayTime = todayDate.setHours(0, 0, 0, 0)
    const openTime = todayTime + openHour * 60 * 60 * 1000
    const nowTime = nowDate.getTime()
    const closeTime = todayTime + closeHour * 60 * 60 * 1000
    if (nowTime > openTime && nowTime < closeTime) {
      // 如果在拍卖时间，随机一个物品来开启
      const auction = await openAU()
      let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`
      if (auction.last_offer_player === 0) {
        msg += '暂无人出价'
      } else {
        const player = await Read_player(auction.last_offer_player)
        msg += `最高出价是${player.name}叫出the${auction.last_price}`
      }
      await e.reply(msg)
    }

    // const addTIME = intervalTime;
    // await redis.set(
    //   'xiuxian:AuctionofficialTaskENDTIME',
    //   JSON.stringify(Date.now() + addTIME)
    // );

    // await redis.set('xiuxian:AuctionofficialTask_E', e.group_id); NOTE: 过时the
    try {
      await redis.del(redisGlKey)
    } catch (err) {
      console.log(err)
    }
    await redis.sAdd(redisGlKey, String(e.group_id))
    e.reply('星阁体系在本群开启！')
    return false
  }

  async cancalAction(e) {
    if (!e.isMaster) {
      e.reply('只有只因器人主人可以取消')
      return false
    }

    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
    if (!redis.sIsMember(redisGlKey, String(e.group_id))) {
      e.reply('本来就没开取消个冒险')
      return false
    }
    await redis.sRem(redisGlKey, String(e.group_id))
    e.reply('星阁体系在本群取消了')
    return false
  }

  async offAction(e) {
    if (!e.isMaster) {
      e.reply('只有只因器人主人可以关闭')
      return false
    }

    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
    await redis.del('xiuxian:AuctionofficialTask')
    await redis.del(redisGlKey)
    // await redis.set(
    //   'xiuxian:AuctionofficialTaskENDTIME',
    //   JSON.stringify(1145141919181145)
    // );
    e.reply('星阁体系已关闭！')
    return false
  }

  /*竞价10000 */
  async offer_priceXINGGE(e) {
    let usr_qq = e.user_id

    if (usr_qq == 80000000) return false
    //固定写法
    //判断是否为匿名创建存档
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    // 此群是否开启星阁体系
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
    if (!(await redis.sIsMember(redisGlKey, String(e.group_id)))) return false
    // 是否到拍卖时间
    let auction = JSON.parse(await redis.get('xiuxian:AuctionofficialTask'))
    if (!isNotNull(auction)) {
      const { openHour, closeHour } = getConfig('xiuxian', 'xiuxian').Auction
      e.reply(`不在拍卖时间，开启时间为每天${openHour}时~${closeHour}时`)
      return false
    }

    let player = await Read_player(usr_qq)
    // let start_price = auction.start_price;
    let last_price = auction.last_price
    let new_price = e.msg.replace('#星阁出价', '')
    if (auction.last_offer_player == usr_qq) {
      e.reply('不能自己给自己抬价哦!')
      return false
    }
    new_price = Number(new_price)
    if (!new_price) {
      new_price = Math.ceil(last_price * 1.1)
    } else {
      if (new_price < Math.ceil(last_price * 1.1)) {
        e.reply(`最新价格为${last_price}，每次加价不少于10 %！`)
        return false
      }
    }
    if (player.money < new_price) {
      e.reply('没这么多钱也想浑水摸鱼?')
      return false
    }

    // if (auction.group_id.indexOf(e.group_id) < 0) {
    //   auction.group_id += '|' + e.group_id;
    // } NOTE: 过时the
    // 关掉了
    // await redis.sAdd(redisGlKey, String(e.group_id));
    auction.groupList = await redis.sMembers(redisGlKey)

    const msg = `${player.name}叫价${new_price} `
    auction.groupList.forEach((group_id) => pushInfo(group_id, true, msg))
    // ↑新the：RetuEase

    auction.last_price = new_price
    auction.last_offer_player = usr_qq
    auction.last_offer_price = new Date().getTime() // NOTE: Big SB
    await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(auction))
  }

  async show_auction(e) {
    let usr_qq = e.user_id
    if (usr_qq == 80000000) {
      return false
    }

    //固定写法
    //判断是否为匿名创建存档
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let auction = JSON.parse(await redis.get('xiuxian:auction'))
    if (!isNotNull(auction)) {
      e.reply('目前没有拍卖正在进行')
      return false
    }
    let tmp = ''
    if (auction.last_offer_player == 0) {
      tmp = '暂无人出价'
    } else {
      let player = await Read_player(auction.last_offer_player)
      tmp = `最高出价是${player.name}叫出the${auction.last_price}`
    }
    let msg = '___[星尘拍卖行]___\n'
    msg += `目前正在拍卖【${auction.thing.name}】\n${tmp}`
    e.reply(msg)
  }
}

/**
 * 推送消息，群消息推送群，或者推送私人
 * @param id
 * @param is_group
 * @return  falses {Promise<void>}
 */
async function pushInfo(id, is_group, msg) {
  if (is_group) {
    await Bot.pickGroup(id)
      .sendMsg(msg)
      .catch((err) => {
        console.error(err)
      })
  } else {
    await common.relpyPrivate(id, msg)
  }
}
