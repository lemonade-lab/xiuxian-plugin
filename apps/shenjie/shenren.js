import plugin from '../../../../lib/plugins/plugin.js';
import { __PATH } from '../../model/xiuxian.js';
import data from '../../model/XiuxianData.js';
import {
  existplayer,
  Read_player,
  exist_najie_thing,
  Add_najie_thing,
  Write_player,
  shijianc,
} from '../../model/xiuxian.js';

export class shenren extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: 'shenren',
      /** 功能描述 */
      dsc: '交易模块',
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 600,
      rule: [
        {
          reg: '^#供奉神石$',
          fnc: 'add_lingeng',
        },
        {
          reg: '^#踏入神界$',
          fnc: 'shenjie',
        },
        {
          reg: '^#参悟神石$',
          fnc: 'canwu',
        },
        {
          reg: '^#敲开闪闪发光的石头$',
          fnc: 'open_shitou',
        },
      ],
    });
  }

  async add_lingeng(e) {
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    //查看存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let x = await exist_najie_thing(usr_qq, '神石', '道具');
    if (!x) {
      e.reply('你没有神石');
      return;
    }
    let player = await Read_player(usr_qq);
    if (
      player.魔道值 > 0 ||
      (player.灵根.type != '转生' && player.level_id < 42)
    ) {
      e.reply('你尝试供奉神石,但是失败了');
      return;
    }
    player.神石 += x;
    await Write_player(usr_qq, player);
    e.reply('供奉成功,当前供奉进度' + player.神石 + '/200');
    await Add_najie_thing(usr_qq, '神石', '道具', -x);
    return;
  }
  async open_shitou(e) {
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    //查看存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let x = await exist_najie_thing(usr_qq, '闪闪发光的石头', '道具');
    if (!x) {
      e.reply('你没有闪闪发光的石头');
      return;
    }
    await Add_najie_thing(usr_qq, '闪闪发光的石头', '道具', -1);
    let random = Math.random();
    let thing;
    if (random < 0.5) {
      thing = '神石';
    } else {
      thing = '魔石';
    }
    e.reply('你打开了石头,获得了' + thing + 'x2');
    await Add_najie_thing(usr_qq, thing, '道具', 2);
    return;
  }

  async shenjie(e) {
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    //查看存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
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
    let player = await Read_player(usr_qq);
    let now = new Date();
    let nowTime = now.getTime(); //获取当前日期的时间戳
    let Today = await shijianc(nowTime);
    let lastdagong_time = await getLastdagong(usr_qq); //获得上次签到日期
    if (
      (Today.Y != lastdagong_time.Y && Today.M != lastdagong_time.M) ||
      Today.D != lastdagong_time.D
    ) {
      await redis.set('xiuxian:player:' + usr_qq + ':lastdagong_time', nowTime); //redis设置签到时间
      var n = 1;
      if (player.灵根.name == '二转轮回体') {
        n = 2;
      } else if (
        player.灵根.name == '三转轮回体' ||
        player.灵根.name == '四转轮回体'
      ) {
        n = 3;
      } else if (
        player.灵根.name == '五转轮回体' ||
        player.灵根.name == '六转轮回体'
      ) {
        n = 4;
      } else if (
        player.灵根.name == '七转轮回体' ||
        player.灵根.name == '八转轮回体'
      ) {
        n = 4;
      } else if (player.灵根.name == '九转轮回体') {
        n = 5;
      }
      player.神界次数 = n;
      await Write_player(usr_qq, player);
    }
    player = await Read_player(usr_qq);
    if (
      player.魔道值 > 0 ||
      (player.灵根.type != '转生' && player.level_id < 42)
    ) {
      e.reply('你没有资格进入神界');
      return;
    }
    if (player.灵石 < 2200000) {
      e.reply('灵石不足');
      return;
    }
    player.灵石 -= 2200000;
    if (
      Today.Y == lastdagong_time.Y &&
      Today.M == lastdagong_time.M &&
      Today.D == lastdagong_time.D &&
      player.神界次数 == 0
    ) {
      e.reply('今日次数用光了,请明日再来吧');
      return;
    } else {
      player.神界次数--;
    }
    await Write_player(usr_qq, player);
    var time = 30; //时间（分钟）
    let action_time = 60000 * time; //持续时间，单位毫秒
    let arr = {
      action: '神界', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '1', //秘境状态---关闭
      mojie: '-1', //魔界状态---关闭
      Place_actionplus: '1', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      cishu: '5',
    };
    if (e.isGroup) {
      arr.group_id = e.group_id;
    }
    await redis.set(
      'xiuxian:player:' + usr_qq + ':action',
      JSON.stringify(arr)
    );
    e.reply('开始进入神界,' + time + '分钟后归来!');
    return;
  }

  async canwu(e) {
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    //查看存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let player = await Read_player(usr_qq);
    if (
      player.魔道值 > 0 ||
      (player.灵根.type != '转生' && player.level_id < 42)
    ) {
      e.reply('你尝试领悟神石,但是失败了');
      return;
    }
    let x = await exist_najie_thing(usr_qq, '神石', '道具');
    if (!x) {
      e.reply('你没有神石');
      return;
    }
    if (x < 8) {
      e.reply('神石不足8个,当前神石数量' + x + '个');
      return;
    }
    await Add_najie_thing(usr_qq, '神石', '道具', -8);
    let wuping_length;
    let wuping_index;
    let wuping;
    wuping_length = data.timedanyao_list.length;
    wuping_index = Math.trunc(Math.random() * wuping_length);
    wuping = data.timedanyao_list[wuping_index];
    e.reply('获得了' + wuping.name);
    await Add_najie_thing(usr_qq, wuping.name, wuping.class, 1);
    return;
  }
}

async function getLastdagong(usr_qq) {
  //查询redis中的人物动作
  let time = await redis.get('xiuxian:player:' + usr_qq + ':lastdagong_time');
  console.log(time);
  if (time != null) {
    let data = await shijianc(parseInt(time));
    return data;
  }
  return false;
}
