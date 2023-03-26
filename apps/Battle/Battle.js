import { plugin ,segment,common} from '../../api/api.js'
import config from '../../model/Config.js';
import data from '../../model/XiuxianData.js';
import {
  existplayer, exist_najie_thing, ForwardMsg, isNotNull, Write_player, Add_najie_thing,
  Add_HP, Add_血气, Read_player, Read_equipment
} from '../../model/xiuxian.js';

/**
 * 战斗类
 */

export class Battle extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_Battle',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^打劫$',
          fnc: 'Dajie',
        },
        {
          reg: '^(以武会友)$',
          fnc: 'biwu',
        },
      ],
    });
    this.set = config.getConfig('xiuxian', 'xiuxian');
    this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
  }

  //打劫
  async Dajie(e) {
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    // 判断是否在开启时间

    const nowDate = new Date();
    const todayDate = new Date(nowDate);
    const { openHour, closeHour } = this.set.Auction;
    const todayTime = todayDate.setHours(0, 0, 0, 0);
    const openTime = todayTime + openHour * 60 * 60 * 1000;
    const nowTime1 = nowDate.getTime();
    const closeTime = todayTime + closeHour * 60 * 60 * 1000;
    if (!(nowTime1 < openTime || nowTime1 > closeTime)) {
      e.reply(`这个时间由星阁阁主看管,还是不要张扬较好`);
      return;
    }

    //得到主动方qq
    let A = e.user_id;

    //先判断
    let ifexistplay_A = await existplayer(A);
    if (!ifexistplay_A || e.isPrivate) {
      return;
    }

    //看看状态

    //得到redis游戏状态
    let last_game_timeA = await redis.get(
      'xiuxian:player:' + A + ':last_game_time'
    );
    //设置游戏状态
    if (last_game_timeA == 0) {
      e.reply(`猜大小正在进行哦!`);
      return true;
    }

    //判断对方
    let isat = e.message.some(item => item.type === 'at');
    if (!isat) {
      return;
    }
    //获取对方qq
    let atItem = e.message.filter(item => item.type === 'at');
    let B = atItem[0].qq; //被打劫者

    //先判断存档！
    let ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
      e.reply('不可对凡人出手!');
      return;
    }

    //出手的
    //读取信息
    let playerAA = await Read_player(A);
    //境界
    let now_level_idAA;
    if (!isNotNull(playerAA.level_id)) {
      e.reply('请先#同步信息');
      return;
    }
    now_level_idAA = data.Level_list.find(
      item => item.level_id == playerAA.level_id
    ).level_id;

    //对方
    //读取信息
    let playerBB = await Read_player(B);
    //境界
    //根据名字取找境界id

    let now_level_idBB;

    if (!isNotNull(playerBB.level_id)) {
      e.reply('对方为错误存档！');
      return;
    }

    now_level_idBB = data.Level_list.find(
      item => item.level_id == playerBB.level_id
    ).level_id;

    //A是仙人，B不是仙人
    if (now_level_idAA > 41 && now_level_idBB <= 41) {
      e.reply(`仙人不可对凡人出手！`);
      return;
    }

    //A是修仙者，B不是
    if (now_level_idAA >= 12 && now_level_idBB < 12) {
      e.reply(`不可欺负弱小！`);
      return;
    }

    if (A == B) {
      e.reply('咋的，自己弄自己啊？');
      return;
    }
    let playerA = data.getData('player', A);
    let playerB = data.getData('player', B);
    if (isNotNull(playerA.宗门) && isNotNull(playerB.宗门)) {
      var assA = data.getAssociation(playerA.宗门.宗门名称);
      var assB = data.getAssociation(playerB.宗门.宗门名称);
      if (assA.宗门名称 == assB.宗门名称) {
        e.reply('门派禁止内讧');
        return;
      }
    }

    let A_action = await redis.get('xiuxian:player:' + A + ':action');
    A_action = JSON.parse(A_action);
    if (A_action != null) {
      let now_time = new Date().getTime();
      //人物任务的动作是否结束
      let A_action_end_time = A_action.end_time;
      if (now_time <= A_action_end_time) {
        let m = parseInt((A_action_end_time - now_time) / 1000 / 60);
        let s = parseInt((A_action_end_time - now_time - m * 60 * 1000) / 1000);
        e.reply(
          '正在' + A_action.action + '中,剩余时间:' + m + '分' + s + '秒'
        );
        return;
      }
    }

    let last_game_timeB = await redis.get(
      'xiuxian:player:' + B + ':last_game_time'
    );
    if (last_game_timeB == 0) {
      e.reply(`对方猜大小正在进行哦，等他赚够了再打劫也不迟!`);
      return true;
    }

    let isBbusy = false; //给B是否忙碌加个标志位，用来判断要不要扣隐身水

    let B_action = await redis.get('xiuxian:player:' + B + ':action');
    B_action = JSON.parse(B_action);
    if (B_action != null) {
      let now_time = new Date().getTime();
      //人物任务的动作是否结束
      let B_action_end_time = B_action.end_time;
      if (now_time <= B_action_end_time) {
        isBbusy = true;
        let ishaveyss = await exist_najie_thing(A, '隐身水', '道具');
        if (!ishaveyss) {
          //如果A没有隐身水，直接返回不执行
          let m = parseInt((B_action_end_time - now_time) / 1000 / 60);
          let s = parseInt(
            (B_action_end_time - now_time - m * 60 * 1000) / 1000
          );
          e.reply(
            '对方正在' + B_action.action + '中,剩余时间:' + m + '分' + s + '秒'
          );
          return;
        }
      }
    }

    let now = new Date();
    let nowTime = now.getTime(); //获取当前时间戳
    let last_dajie_time = await redis.get(
      'xiuxian:player:' + A + ':last_dajie_time'
    ); //获得上次打劫的时间戳,
    last_dajie_time = parseInt(last_dajie_time);
    let robTimeout = parseInt(60000 * this.xiuxianConfigData.CD.rob);
    if (nowTime < last_dajie_time + robTimeout) {
      let waittime_m = Math.trunc(
        (last_dajie_time + robTimeout - nowTime) / 60 / 1000
      );
      let waittime_s = Math.trunc(
        ((last_dajie_time + robTimeout - nowTime) % 60000) / 1000
      );
      e.reply('打劫正在CD中，' + `剩余cd:  ${waittime_m}分 ${waittime_s}秒`);
      return;
    }
    let A_player = await Read_player(A);
    let B_player = await Read_player(B);
    if (A_player.修为 < 0) {
      e.reply(`还是闭会关再打劫吧`);
      return;
    }
    if (B_player.当前血量 < 20000) {
      e.reply(`${B_player.名号} 重伤未愈,就不要再打他了`);
      return;
    }
    if (B_player.灵石 < 30002) {
      e.reply(`${B_player.名号} 穷得快赶上水脚脚了,就不要再打他了`);
      return;
    }
    let final_msg = [segment.at(A), segment.at(B), '\n'];

    //这里前戏做完,确定要开打了

    if (isBbusy) {
      //如果B忙碌,自动扣一瓶隐身水强行打架,奔着人道主义关怀,提前判断了不是重伤
      final_msg.push(
        `${B_player.名号}正在${B_action.action}，${A_player.名号}利用隐身水悄然接近，但被发现。`
      );
      await Add_najie_thing(A, '隐身水', '道具', -1);
    } else {
      final_msg.push(`${A_player.名号}向${B_player.名号}发起了打劫。`);
    }
    //本次打劫时间存入缓存
    await redis.set('xiuxian:player:' + A + ':last_dajie_time', nowTime); //存入缓存
    A_player.法球倍率 = A_player.灵根.法球倍率;
    B_player.法球倍率 = B_player.灵根.法球倍率;

    let Data_battle = await zd_battle(A_player, B_player);
    let msg = Data_battle.msg;
    //战斗回合过长会导致转发失败报错，所以超过30回合的就不转发了
    if (msg.length > 35) {
    } else {
      await ForwardMsg(e, msg);
    }
    //下面的战斗超过100回合会报错
    await Add_HP(A, Data_battle.A_xue);
    await Add_HP(B, Data_battle.B_xue);
    let A_win = `${A_player.名号}击败了${B_player.名号}`;
    let B_win = `${B_player.名号}击败了${A_player.名号}`;
    if (msg.find(item => item == A_win)) {
      if (await exist_najie_thing(B, "替身人偶", "道具") && B_player.魔道值 < 1 && (B_player.灵根.type == "转生" || B_player.level_id > 41)) {
        e.reply(B_player.名号 + "使用了道具替身人偶,躲过了此次打劫");
        await Add_najie_thing(B, "替身人偶", "道具", -1);
        return;
      }
      let mdzJL = A_player.魔道值;
      let lingshi = Math.trunc(B_player.灵石 / 5);
      let qixue = Math.trunc(100 * now_level_idAA);
      let mdz = Math.trunc(lingshi / 10000);
      if (lingshi >= B_player.灵石) {
        lingshi = B_player.灵石 / 2;
      }
      A_player.灵石 += lingshi;
      B_player.灵石 -= lingshi;
      A_player.血气 += qixue;
      A_player.魔道值 += mdz;
      A_player.灵石 += mdzJL;
      await Write_player(A, A_player);
      await Write_player(B, B_player);
      final_msg.push(
        ` 经过一番大战,${A_win},成功抢走${lingshi}灵石,${A_player.名号}获得${qixue}血气，`
      );
    } else if (msg.find(item => item == B_win)) {
      if (A_player.灵石 < 30002) {
        let qixue = Math.trunc(100 * now_level_idBB);
        B_player.血气 += qixue;
        await Write_player(B, B_player);
        var time2 = 60; //时间（分钟）
        var action_time2 = 60000 * time2; //持续时间，单位毫秒
        var action2 = await redis.get('xiuxian:player:' + A + ':action');
        action2 = await JSON.parse(action2);
        action2.action = '禁闭';
        action2.end_time = new Date().getTime() + action_time2;
        await redis.set(
          'xiuxian:player:' + A + ':action',
          JSON.stringify(action2)
        );
        final_msg.push(
          `经过一番大战,${A_player.名号}被${B_player.名号}击败了,${B_player.名号}获得${qixue}血气,${A_player.名号} 真是偷鸡不成蚀把米,被关禁闭60分钟`
        );
      } else {
        let lingshi = Math.trunc(A_player.灵石 / 4);
        let qixue = Math.trunc(100 * now_level_idBB);
        if (lingshi <= 0) {
          lingshi = 0;
        }
        A_player.灵石 -= lingshi;
        B_player.灵石 += lingshi;
        B_player.血气 += qixue;
        await Write_player(A, A_player);
        await Write_player(B, B_player);
        final_msg.push(
          `经过一番大战,${A_player.名号}被${B_player.名号}击败了,${B_player.名号}获得${qixue}血气,${A_player.名号} 真是偷鸡不成蚀把米,被劫走${lingshi}灵石`
        );
      }
    } else {
      e.reply(`战斗过程出错`);
      return;
    }
    e.reply(final_msg);
    return;
  }

  //比武
  async biwu(e) {
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    let A = e.user_id;
    //先判断
    let ifexistplay_A = await existplayer(A);
    if (!ifexistplay_A || e.isPrivate) {
      return;
    }
    let isat = e.message.some(item => item.type === 'at');
    if (!isat) {
      return;
    }
    let atItem = e.message.filter(item => item.type === 'at');
    let B = atItem[0].qq; //后手

    if (A == B) {
      e.reply('你还跟自己修炼上了是不是?');
      return;
    }
    let ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
      e.reply('修仙者不可对凡人出手!');
      return;
    }
    //这里前戏做完,确定要开打了
    let final_msg = [segment.at(A), segment.at(B), '\n'];
    let A_player = await Read_player(A);
    let B_player = await Read_player(B);
    final_msg.push(`${A_player.名号}向${B_player.名号}发起了切磋。`);
    A_player.法球倍率 = A_player.灵根.法球倍率;
    B_player.法球倍率 = B_player.灵根.法球倍率;
    A_player.当前血量 = A_player.血量上限;
    B_player.当前血量 = B_player.血量上限;
    let Data_battle = await zd_battle(A_player, B_player);
    let msg = Data_battle.msg;
    await ForwardMsg(e, msg);
    //最后发送消息
    e.reply(final_msg);
    return;
  }
}
export async function zd_battle(AA_player, BB_player) {
  let A_player = JSON.parse(JSON.stringify(BB_player));
  let B_player = JSON.parse(JSON.stringify(AA_player));
  let cnt = 0; //回合数
  let cnt2;
  let A_xue = 0; //最后要扣多少血
  let B_xue = 0;
  let t;
  let msg = [];
  let jineng1 = data.jineng1;
  let jineng2 = data.jineng2;
  //隐藏灵根
  let wuxing = ["金", "木", "土", "水", "火"];
  let type = ["武器", "护具", "法宝"];
  if (A_player.隐藏灵根 && A_player.id) {
    let buff = 1;
    let wx = [];
    let equ = await Read_equipment(A_player.id);
    for (let i of wuxing)
      if (A_player.隐藏灵根.name.includes(i))
        wx.push(i);
    for (let i of type) {
      if (equ[i].id > 0 && equ[i].id < 6)
        buff += kezhi(equ[i].id, wx);
    }
    A_player.攻击 = Math.trunc(A_player.攻击 * buff);
    A_player.防御 = Math.trunc(A_player.防御 * buff);
    A_player.当前血量 = Math.trunc(A_player.当前血量 * buff);
    msg.push(`${A_player.名号}与装备产生了共鸣,自身全属性提高${Math.trunc((buff - 1) * 100)}%`)
  }
  if (B_player.隐藏灵根 && B_player.id) {
    let wx = [];
    let buff = 1;
    let equ = await Read_equipment(B_player.id);
    for (let i of wuxing)
      if (B_player.隐藏灵根.name.includes(i))
        wx.push(i);
    for (let i of type) {
      if (equ[i].id > 0 && equ[i].id < 6)
        buff += kezhi(equ[i].id, wx);
    }
    B_player.攻击 = Math.trunc(B_player.攻击 * buff);
    B_player.防御 = Math.trunc(B_player.防御 * buff);
    B_player.当前血量 = Math.trunc(B_player.当前血量 * buff);
    msg.push(`${B_player.名号}与装备产生了共鸣,自身全属性提高${Math.trunc((buff - 1) * 100)}%`)
  }
  while (A_player.当前血量 > 0 && B_player.当前血量 > 0) {
    cnt2 = Math.trunc(cnt / 2);
    let Random = Math.random();
    let random = Math.random();
    let buff = 1;
    t = A_player;
    A_player = B_player;
    B_player = t;
    let baoji = baojishanghai(A_player.暴击率);
    //仙宠
    if (isNotNull(A_player.仙宠)) {
      if (A_player.仙宠.type == '暴伤')
        baoji += A_player.仙宠.加成;
      else if (A_player.仙宠.type == "战斗") {
        let ran = Math.random();
        if (ran < 0.35) {
          A_player.攻击 += Math.trunc(A_player.攻击 * A_player.仙宠.加成);
          A_player.防御 += Math.trunc(A_player.防御 * A_player.仙宠.加成);
          msg.push("仙宠【" + A_player.仙宠.name + "】辅佐了[" + A_player.名号 + "]，使其伤害增加了[" + Math.trunc(A_player.仙宠.加成 * 100) + "%]");
        }
      }
    }
    //武器
    if (isNotNull(A_player.id)) {
      let equipment = await Read_equipment(A_player.id);
      let ran = Math.random();
      if (equipment.武器.name == "紫云剑" && ran > 0.7) {
        A_player.攻击 *= 3;
        msg.push(`${A_player.名号}触发了紫云剑被动,攻击力提高了200%`);
      }
      else if (equipment.武器.name == "炼血竹枪" && ran > 0.75) {
        A_player.攻击 *= 2;
        A_player.当前血量 = Math.trunc(A_player.当前血量 * 1.2);
        msg.push(`${A_player.名号}触发了炼血竹枪被动,攻击力提高了100%,血量回复了20%`);
      }
      else if (equipment.武器.name == "少阴玉剑" && ran > 0.85) {
        A_player.当前血量 = Math.trunc(A_player.当前血量 * 1.4);
        msg.push(`${A_player.名号}触发了少阴玉剑被动,血量回复了40%`);
      }
    }
    let 伤害 = Harm(A_player.攻击 * 0.85, B_player.防御);
    let 法球伤害 = Math.trunc(A_player.攻击 * A_player.法球倍率);
    伤害 = Math.trunc(baoji * 伤害 + 法球伤害 + A_player.防御 * 0.1);
    //技能
    let count = 0;//限制次数
    for (var i = 0; i < jineng1.length; i++) {
      if ((jineng1[i].class == "常驻" && (cnt2 == jineng1[i].cnt || jineng1[i].cnt == -1) && Random < jineng1[i].pr) ||
        ((A_player.学习的功法 && jineng1[i].class == "功法" && A_player.学习的功法.indexOf(jineng1[i].name) > -1) && (cnt2 == jineng1[i].cnt || jineng1[i].cnt == -1) && Random < jineng1[i].pr) ||
        (A_player.灵根 && jineng1[i].class == "灵根" && A_player.灵根.name == jineng1[i].name && (cnt2 == jineng1[i].cnt || jineng1[i].cnt == -1) && Random < jineng1[i].pr)) {
        if (jineng1[i].msg2 == "") {
          msg.push(A_player.名号 + jineng1[i].msg1);
        }
        else {
          msg.push(A_player.名号 + jineng1[i].msg1 + B_player.名号 + jineng1[i].msg2);
        }
        伤害 = 伤害 * jineng1[i].beilv + jineng1[i].other;
        count++;
      }
      if (count == 3)
        break;
    }
    for (var i = 0; i < jineng2.length; i++) {
      if ((jineng2[i].class == "常驻" && (cnt2 == jineng2[i].cnt || jineng2[i].cnt == -1) && random < jineng2[i].pr) ||
        ((B_player.学习的功法 && jineng2[i].class == "功法" && B_player.学习的功法.indexOf(jineng2[i].name) > -1) && (cnt2 == jineng2[i].cnt || jineng2[i].cnt == -1) && random < jineng2[i].pr) ||
        (B_player.灵根 && jineng2[i].class == "灵根" && B_player.灵根.name == jineng2[i].name && (cnt2 == jineng2[i].cnt || jineng2[i].cnt == -1) && random < jineng2[i].pr)) {
        if (jineng2[i].msg2 == "") {
          msg.push(B_player.名号 + jineng2[i].msg1);
        }
        else {
          msg.push(B_player.名号 + jineng2[i].msg1 + A_player.名号 + jineng2[i].msg2);
        }
        伤害 = 伤害 * jineng2[i].beilv + jineng2[i].other;
      }
    }
    if (A_player.魔道值 > 999) {
      buff += Math.trunc(A_player.魔道值 / 1000) / 100;
      if (buff > 1.3) buff = 1.3;
      if (A_player.灵根.name == "九重魔功") buff += 0.2;
      msg.push("魔道值为" + A_player.名号 + "提供了" + Math.trunc((buff - 1) * 100) + "%的增伤");
    }
    if (B_player.魔道值 < 1 && (B_player.灵根.type == "转生" || B_player.level_id > 41)) {
      var buff2 = B_player.神石 * 0.0015;
      if (buff2 > 0.3) buff2 = 0.3;
      if (B_player.灵根.name == "九转轮回体") buff2 += 0.2;
      buff -= buff2
      msg.push("神石为" + B_player.名号 + "提供了" + Math.trunc(buff2 * 100) + "%的减伤");
    }
    伤害 = Math.trunc(伤害 * buff);
    B_player.当前血量 -= 伤害;
    if (B_player.当前血量 < 0) {
      B_player.当前血量 = 0;
    }
    if (cnt % 2 == 0) {
      A_player.防御 = AA_player.防御;
      A_player.攻击 = AA_player.攻击;
    }
    else {
      A_player.防御 = BB_player.攻击;
      A_player.防御 = BB_player.防御;
    }
    msg.push(`第${cnt2 + 1}回合：
${A_player.名号}攻击了${B_player.名号}，${ifbaoji(baoji)}造成伤害${伤害}，${B_player.名号}剩余血量${B_player.当前血量}`);
    cnt++;
  }
  if (cnt % 2 == 0) {
    t = A_player;
    A_player = B_player;
    B_player = t;
  }
  if (A_player.当前血量 <= 0) {
    AA_player.当前血量 = 0;
    msg.push(`${BB_player.名号}击败了${AA_player.名号}`);
    B_xue = B_player.当前血量 - BB_player.当前血量;
    A_xue = -AA_player.当前血量;
  }
  else if (B_player.当前血量 <= 0) {
    BB_player.当前血量 = 0;
    msg.push(`${AA_player.名号}击败了${BB_player.名号}`);
    B_xue = -BB_player.当前血量;
    A_xue = A_player.当前血量 - AA_player.当前血量;
  }
  let Data_nattle = { msg: msg, A_xue: A_xue, B_xue: B_xue, };
  return Data_nattle;
}
export function baojishanghai(baojilv) {
  if (baojilv > 1) {
    baojilv = 1;
  } //暴击率最高为100%,即1
  let rand = Math.random();
  let bl = 1;
  if (rand < baojilv) {
    bl = baojilv + 1.5; //这个是暴击伤害倍率//满暴击时暴伤2为50%
  }
  return bl;
}

//通过暴击伤害返回输出用的文本
export function ifbaoji(baoji) {
  if (baoji == 1) {
    return '';
  } else {
    return '触发暴击，';
  }
}

//攻击攻击防御计算伤害
export function Harm(atk, def) {
  let x;
  let s = atk / def;
  let rand = Math.trunc(Math.random() * 11) / 100 + 0.95; //保留±5%的伤害波动
  if (s < 1) {
    x = 0.1;
  } else if (s > 2.5) {
    x = 1;
  } else {
    x = 0.6 * s - 0.5;
  }
  x = Math.trunc(x * atk * rand);
  return x;
}
//判断克制关系
export function kezhi(equ, wx) {
  let wuxing = ["金", "木", "土", "水", "火", "金"];
  let equ_wx = wuxing[equ - 1];
  //相同
  for (let j of wx) {
    if (j == equ_wx)
      return 0.04;
  }
  //不同
  for (let j of wx)
    for (let i = 0; i < wuxing.length - 1; i++) {
      if (wuxing[i] == equ_wx && wuxing[i + 1] == j)
        return -0.02
    }
  return 0;
}
