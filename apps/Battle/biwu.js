import { plugin ,segment,common} from '../../api/api.js'
import config from '../../model/Config.js';
import data from '../../model/XiuxianData.js';
import {
  existplayer, exist_najie_thing, ForwardMsg, isNotNull, Write_player, Add_najie_thing,
  Add_HP, Read_player, Read_equipment, sleep
} from '../Xiuxian/xiuxian.js';
import { Harm,baojishanghai,ifbaoji } from "../Battle/Battle.js"

/**
 * 战斗类
 */
let i = 0;
let A_QQ = [];
let B_QQ = [];

export class biwu extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_biwu',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        /*{
          reg: '^切磋$',
          fnc: 'biwu',
        },
        {
          reg: '^#选择技能.*$',
          fnc: 'choice'
        },
        {
          reg: '^#释放技能.*$',
          fnc: 'release'
        }*/
      ],
    });
  }


  async biwu(e) {
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
    A_QQ.push(
      {
        QQ: A,
        技能: ["技能1", "技能2", "技能3"],
        技能1: "空",
        技能2: "空",
        技能3: "空",
      });
    B_QQ.push(
      {
        QQ: B,
        技能: ["技能1", "技能2", "技能3"],
        技能1: "空",
        技能2: "空",
        技能3: "空",
      });
    i++;
    this.battle(e, i - 1);

    return;
  }

  async battle(e, num) {
    let A_player = await Read_player(A_QQ[num].QQ);
    let B_player = await Read_player(B_QQ[num].QQ);
    let msg = "请选择你本局携带的技能:\n1、技能1\n2、技能2\n3、技能3"
    //推送私人
    Bot.pickMember(e.group_id, A_QQ[num].QQ).sendMsg(msg);
    Bot.pickMember(e.group_id, B_QQ[num].QQ).sendMsg(msg);
    await sleep(30000);
    let cnt = 1;
    let action_A={
      cnt:cnt,
      技能1:A_QQ[num].技能1,
      技能2:A_QQ[num].技能2,
      技能3:A_QQ[num].技能3,
      use:4
    }
    let action_B={
      cnt:cnt,
      技能1:B_QQ[num].技能1,
      技能2:B_QQ[num].技能2,
      技能3:B_QQ[num].技能3,
      use:4
    }
    await redis.set("xiuxian:player:" + A_QQ[num].QQ + ":bisai", JSON.stringify(action_A));
    await redis.set("xiuxian:player:" + B_QQ[num].QQ + ":bisai", JSON.stringify(action_B));
    while (A_player.当前血量 > 0 && B_player.当前血量 > 0) {
      msg = `第${cnt}回合,是否释放以下技能:\n1、${A_QQ[num].技能1}\n2、${A_QQ[num].技能2}\n3、${A_QQ[num].技能3}`;
      Bot.pickMember(e.group_id, A_QQ[num].QQ).sendMsg(msg);
      msg = `第${cnt}回合,是否释放以下技能:\n1、${B_QQ[num].技能1}\n2、${B_QQ[num].技能2}\n3、${B_QQ[num].技能3}`;
      Bot.pickMember(e.group_id, B_QQ[num].QQ).sendMsg(msg);
      await sleep(30000);
      //A
      let A_baoji = baojishanghai(A_player.暴击率);
      let A_伤害 = Harm(A_player.攻击 * 0.85, B_player.防御);
      let A_法球伤害 = Math.trunc(A_player.攻击 * A_player.法球倍率);
      A_伤害 = Math.trunc(A_baoji * A_伤害 + A_法球伤害 + A_player.防御 * 0.1);
      action_A = await JSON.parse(await redis.get("xiuxian:player:" + A_QQ[num].QQ + ":bisai"));
      //B
      let B_baoji = baojishanghai(B_player.暴击率);
      let B_伤害 = Harm(B_player.攻击 * 0.85, A_player.防御);
      let B_法球伤害 = Math.trunc(B_player.攻击 * B_player.法球倍率);
      B_伤害 = Math.trunc(B_baoji * B_伤害 + B_法球伤害 + B_player.防御 * 0.1);
      action_B = await JSON.parse(await redis.get("xiuxian:player:" + B_QQ[num].QQ + ":bisai"));
      let msgg=[];
      console.log(action_A.use)
      if (action_A.use!=4)
      {
        A_伤害 = Math.trunc(A_伤害);
        B_player.当前血量 -= A_伤害;
        msgg.push(`第${cnt}回合,${A_player.名号}触发${action_A[`技能${action_A.use}`]}，${ifbaoji(A_baoji)}造成伤害${A_伤害}，${B_player.名号}剩余血量${B_player.当前血量}\n`);
      }
      else
      {
        A_伤害 = Math.trunc(A_伤害);
        B_player.当前血量 -= A_伤害;
        msgg.push(`第${cnt}回合,${A_player.名号}普通攻击，${ifbaoji(A_baoji)}造成伤害${A_伤害}，${B_player.名号}剩余血量${B_player.当前血量}\n`);
      }
      if (action_B.use!=4)
      {
        B_伤害 = Math.trunc(B_伤害);
        A_player.当前血量 -= B_伤害;
        msgg.push(`第${cnt}回合,${B_player.名号}触发${action_B[`技能${action_B.use}`]}，${ifbaoji(B_baoji)}造成伤害${B_伤害}，${A_player.名号}剩余血量${A_player.当前血量}`);
      }
      else
      {
        B_伤害 = Math.trunc(B_伤害);
        A_player.当前血量 -= B_伤害;
        msgg.push(`第${cnt}回合,${B_player.名号}普通攻击，${ifbaoji(B_baoji)}造成伤害${B_伤害}，${A_player.名号}剩余血量${A_player.当前血量}`);
      }
      cnt++;
      e.reply(msgg)
    }
    return;

  }

  async choice(e) {
    let jineng_name = e.msg.replace("#选择技能", '');
    let code = jineng_name.split("\，");
    let msg = []
    if (A_QQ.some(item => item.QQ == e.user_id)) {
      for (let j of A_QQ) {
        if (j.QQ == e.user_id) {
          code = code.slice(0, 3);
          for (let m in code) {
            j[`技能${m * 1 + 1}`] = j.技能[code[m] - 1];
            msg.push(j.技能[code[m] - 1])
          }
        }
      }
      e.reply(`本场战斗支持一下技能\n${msg}`);
      return;
    }
    else if (B_QQ.some(item => item.QQ == e.user_id)) {
      for (let j of B_QQ) {
        if (j.QQ == e.user_id) {
          code = code.slice(0, 3);
          for (let m in code) {
            j[`技能${m * 1 + 1}`] = j.技能[code[m] - 1];
            msg.push(j.技能[code[m] - 1])
          }
        }
      }
      e.reply(`本场战斗支持一下技能\n${msg}`);
      return;
    }
    return;
  }

  async release(e) {
    let action = await redis.get("xiuxian:player:" + e.user_id + ":bisai");
    action = await JSON.parse(action);
    if (!action)
      return;
    let jineng = e.msg.replace("#释放技能", '');
    jineng=Number(jineng);
    action.use=jineng;
    await redis.set("xiuxian:player:" + e.user_id + ":bisai", JSON.stringify(action));
    return;
  }

}

