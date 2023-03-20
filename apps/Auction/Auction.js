import plugin from '../../../../lib/plugins/plugin.js';
import data from '../../model/XiuxianData.js';
import common from '../../../../lib/common/common.js';
import config from '../../model/Config.js';
import Show from '../../model/show.js';
import puppeteer from '../../../../lib/puppeteer/puppeteer.js';
import {__PATH,existplayer,Read_player,isNotNull} from '../Xiuxian/xiuxian.js';

// const intervalTime = 7 * 24 * 60 * 60 * 1000;

/**
 * 全局变量
 */
let allaction = false; //全局状态判断
/**
 * 拍卖系统
 */
export class Auction extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: 'Auction',
      /** 功能描述 */
      dsc: '拍卖模块',
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 600,
      rule: [
        {
          reg: '^#星阁出价.*$',
          fnc: 'offer_priceXINGGE',
        },
        {
          reg: '^#星阁拍卖行$',
          fnc: 'xingGE',
        },
        {
          reg: '^#开启星阁体系$',
          fnc: 'openAction',
        },
        {
          reg: '^#取消星阁体系$',
          fnc: 'cancalAction',
        },
        {
          reg: '^#关闭星阁体系$',
          fnc: 'offAction',
        },
      ],
    });
    this.set = config.getConfig('xiuxian', 'xiuxian');
  }

  async xingGE(e) {
    if (!e.isGroup) {
      return;
    }
    //固定写法
    let usr_qq = e.user_id;
    //判断是否为匿名创建存档
    if (usr_qq == 80000000) {
      return;
    }
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let auction = await redis.get('xiuxian:AuctionofficialTask');
    if (!isNotNull(auction)) {
      e.reply('目前没有拍卖正在进行');
      return;
    }
    auction = JSON.parse(auction);

    let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
    if (auction.last_offer_player === 0) {
      msg += '暂无人出价';
    } else {
      const player = await Read_player(auction.last_offer_player);
      msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
    }
    await e.reply(msg);
  }

  async openAction(e) {
    if (!e.isMaster) {
      return e.reply('只有只因器人主人可以开启');
    }

    // 如果星阁已经开了，将本群加入Redis
    // INFO: 缺省判断是否在进行，GroupList判断哪些群开启了星阁体系
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    const groupList = await redis.sMembers(redisGlKey);
    if (groupList.length > 0) {
      if (await redis.sIsMember(redisGlKey, String(e.group_id))) {
        console.log(await redis.sMembers(redisGlKey));
        return e.reply('星阁拍卖行已经开啦');
      }
      await redis.sAdd(redisGlKey, String(e.group_id));
      return e.reply('星阁已开启，已将本群添加至星阁体系');
    }

    // 如果没开，判断是否在开启时间
    const nowDate = new Date();
    const todayDate = new Date(nowDate);
    const { openHour, closeHour } = this.set.Auction;
    const todayTime = todayDate.setHours(0, 0, 0, 0);
    const openTime = todayTime + openHour * 60 * 60 * 1000;
    const nowTime = nowDate.getTime();
    const closeTime = todayTime + closeHour * 60 * 60 * 1000;
    if (nowTime > openTime && nowTime < closeTime) {
      // 如果在拍卖时间，随机一个物品来开启
      const auction = await openAU();
      let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
      if (auction.last_offer_player === 0) {
        msg += '暂无人出价';
      } else {
        const player = await Read_player(auction.last_offer_player);
        msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
      }
      await e.reply(msg);
    }

    // const addTIME = intervalTime;
    // await redis.set(
    //   'xiuxian:AuctionofficialTaskENDTIME',
    //   JSON.stringify(Date.now() + addTIME)
    // );

    // await redis.set('xiuxian:AuctionofficialTask_E', e.group_id); NOTE: 过时的
    try {
      await redis.del(redisGlKey);
    } catch (_) {}
    await redis.sAdd(redisGlKey, String(e.group_id));
    return e.reply('星阁体系在本群开启！');
  }

  async cancalAction(e) {
    if (!e.isMaster) {
      return e.reply('只有只因器人主人可以取消');
    }

    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    if (!redis.sIsMember(redisGlKey, String(e.group_id))) {
      return e.reply('本来就没开取消个冒险');
    }
    await redis.sRem(redisGlKey, String(e.group_id));

    return e.reply('星阁体系在本群取消了');
  }

  async offAction(e) {
    if (!e.isMaster) {
      return e.reply('只有只因器人主人可以关闭');
    }

    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    await redis.del('xiuxian:AuctionofficialTask');
    await redis.del(redisGlKey);
    // await redis.set(
    //   'xiuxian:AuctionofficialTaskENDTIME',
    //   JSON.stringify(1145141919181145)
    // );
    return e.reply('星阁体系已关闭！');
  }

  /*竞价10000 */
  async offer_priceXINGGE(e) {
    if (!e.isGroup) {
      return;
    }
    //固定写法
    let usr_qq = e.user_id;
    //判断是否为匿名创建存档
    if (usr_qq == 80000000) {
      return;
    }
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    // 此群是否开启星阁体系
    const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
    if (!(await redis.sIsMember(redisGlKey, String(e.group_id)))) return;
    // 是否到拍卖时间
    let auction = await redis.get('xiuxian:AuctionofficialTask');
    if (!isNotNull(auction)) {
      const { openHour, closeHour } = config.getConfig(
        'xiuxian',
        'xiuxian'
      ).Auction;
      e.reply(`不在拍卖时间，开启时间为每天${openHour}时~${closeHour}时`);
      return;
    }

    let player = await Read_player(usr_qq);
    auction = JSON.parse(auction);
    // let start_price = auction.start_price;
    let last_price = auction.last_price;
    let new_price = e.msg.replace('#星阁出价', '');
    new_price=Number(new_price);
    if (!new_price) {
      new_price = parseInt(Math.ceil(last_price * 1.1));
    } else {
      if (new_price < Math.ceil(last_price * 1.1)) {
        e.reply(`最新价格为${last_price}，每次加价不少于10 %！`);
        return;
      }
    }
    if (player.灵石 < new_price) {
      e.reply('没这么多钱也想浑水摸鱼?');
      return;
    }

    // if (auction.group_id.indexOf(e.group_id) < 0) {
    //   auction.group_id += '|' + e.group_id;
    // } NOTE: 过时的
    // 关掉了
    // await redis.sAdd(redisGlKey, String(e.group_id));
    auction.groupList = await redis.sMembers(redisGlKey);

    const msg = `${player.名号}叫价${new_price} `;
    auction.groupList.forEach(group_id => pushInfo(group_id, true, msg));
    // ↑新的：RetuEase

    auction.last_price = new_price;
    auction.last_offer_player = usr_qq;
    auction.last_offer_price = new Date().getTime(); // NOTE: Big SB
    await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(auction));
  }

  async show_auction(e) {
    if (!e.isGroup) {
      return;
    }
    //固定写法
    let usr_qq = e.user_id;
    //判断是否为匿名创建存档
    if (usr_qq == 80000000) {
      return;
    }
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let auction = await redis.get('xiuxian:auction');
    if (!isNotNull(auction)) {
      e.reply('目前没有拍卖正在进行');
      return;
    }
    auction = JSON.parse(auction);
    let tmp = '';
    if (auction.last_offer_player == 0) {
      tmp = '暂无人出价';
    } else {
      let player = await Read_player(auction.last_offer_player);
      tmp = `最高出价是${player.名号}叫出的${auction.last_price}`;
    }
    let msg = '___[星尘拍卖行]___\n';
    msg += `目前正在拍卖【${auction.thing.name}】\n${tmp}`;
    e.reply(msg);
  }
}

/**
 * 状态
 */
export async function Go(e) {
  let usr_qq = e.user_id;
  //有无存档
  let ifexistplay = await existplayer(usr_qq);
  if (!ifexistplay) {
    return;
  }
  //获取游戏状态
  let game_action = await redis.get(
    'xiuxian:player:' + usr_qq + ':game_action'
  );
  //防止继续其他娱乐行为
  if (game_action == 0) {
    e.reply('修仙：游戏进行中...');
    return;
  }
  //查询redis中的人物动作
  let action = await redis.get('xiuxian:player:' + usr_qq + ':action');
  action = JSON.parse(action);
  if (action != null) {
    //人物有动作查询动作结束时间
    let action_end_time = action.end_time;
    let now_time = new Date().getTime();
    if (now_time <= action_end_time) {
      let m = parseInt((action_end_time - now_time) / 1000 / 60);
      let s = parseInt((action_end_time - now_time - m * 60 * 1000) / 1000);
      e.reply('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒');
      return;
    }
  }
  //let player = await Read_player(usr_qq);
  //if (player.当前血量 < 200) {
  //    e.reply("你都伤成这样了,就不要出去浪了");
  //    return;
  //}
  allaction = true;
  return;
}

export async function get_supermarket_img(e) {
  let usr_qq = e.user_id;
  let ifexistplay = data.existData('player', usr_qq);
  if (!ifexistplay) {
    return;
  }
  let Exchange_list;
  try {
    Exchange_list = await Read_Exchange();
  } catch {
    await Write_Exchange([]);
    Exchange_list = await Read_Exchange();
  }
  let supermarket_data = {
    user_id: usr_qq,
    Exchange_list: Exchange_list,
  };
  const data1 = await new Show(e).get_supermarketData(supermarket_data);
  let img = await puppeteer.screenshot('supermarket', {
    ...data1,
  });
  return img;
}

// export async function openAU() {
//   let e = await redis.get('xiuxian:AuctionofficialTask_E');
//   let random = Math.floor(Math.random() * data.xingge.length);
//   let thing_data = data.xingge[random];
//   let thing_value = Math.floor(thing_data.出售价 * 0.5);
//   let thing_amount = 1;
//   let now_time = new Date().getTime();
//   console.log(thing_data);
//   let wupin = {
//     thing: thing_data,
//     start_price: thing_value,
//     last_price: thing_value,
//     amount: thing_amount,
//     last_offer_price: now_time,
//     last_offer_player: 0,
//     group_id: `${e} `,
//   };
//   await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(wupin));
//   return;
// } NOTE: 过时的

export async function openAU() {
  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';

  const random = Math.floor(Math.random() * data.xingge[0].one.length);
  const thing_data = data.xingge[0].one[random];
  const thing_value = Math.floor(thing_data.出售价);
  const thing_amount = 1;
  const now_time = new Date().getTime();
  const groupList = await redis.sMembers(redisGlKey);

  const wupin = {
    thing: thing_data,
    start_price: thing_value,
    last_price: thing_value,
    amount: thing_amount,
    last_offer_price: now_time,
    last_offer_player: 0,
    groupList,
  };
  await redis.set('xiuxian:AuctionofficialTask', JSON.stringify(wupin));
  return wupin;
}

/**
 * 推送消息，群消息推送群，或者推送私人
 * @param id
 * @param is_group
 * @returns {Promise<void>}
 */
async function pushInfo(id, is_group, msg) {
  if (is_group) {
    await Bot.pickGroup(id)
      .sendMsg(msg)
      .catch(err => {
        Bot.logger.mark(err);
      });
  } else {
    await common.relpyPrivate(id, msg);
  }
}
