import { plugin } from '../../api/api.js'
import fs from 'node:fs';
import data from '../../model/XiuxianData.js';
import config from '../../model/Config.js';
import { get_player_img } from '../ShowImeg/showData.js';
import { AppName } from '../../app.config.js';
import {
  existplayer, isNotNull, Write_player, Write_najie, Read_najie, Read_updata_log, Add_najie_thing,
  exist_najie_thing, Read_equipment, Write_equipment, Read_danyao, Write_danyao
} from '../../model/xiuxian.js';
import { Read_Exchange, Write_Exchange } from '../Exchange/Exchange.js';
import { Read_player, __PATH } from '../../model/xiuxian.js';
import puppeteer from '../../../../lib/puppeteer/puppeteer.js';
import Show from '../../model/show.js';
export class AdminSuper extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_AdminSuper',
      dsc: '修仙设置',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#解封.*$',
          fnc: 'relieve',
        },
        {
          reg: '^#解除所有$',
          fnc: 'Allrelieve',
        },
        {
          reg: '^#打落凡间.*$',
          fnc: 'Knockdown',
        },
        {
          reg: '^#清除冲水堂$',
          fnc: 'Deleteexchange',
        },
        {
          reg: '^#查看日志$',
          fnc: 'show_log',
        },
        {
          reg: '^#解散宗门.*$',
          fnc: 'jiesan_ass',
        },
        {
          reg: '#将米娜桑的纳戒里叫.*的的的(装备|道具|丹药|功法|草药|材料|仙宠|口粮)(抹除|替换为叫.*之之之(装备|道具|丹药|功法|草药|材料|仙宠|口粮))$',
          fnc: 'replaceThing',
        },
      ],
    });
    this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
  }
  async jiesan_ass(e) {
    if (!e.isMaster) {
      return;
    }
    let didian = e.msg.replace('#解散宗门', '');
    didian = didian.trim();
    let ass = data.getAssociation(didian);
    if (ass == 'error') {
      e.reply('该宗门不存在');
      return;
    }
    for (let qq of ass.所有成员) {
      let player = await data.getData('player', qq);
      if (player.宗门) {
        if (player.宗门.宗门名称 == didian) {
          delete player.宗门;
          await Write_player(qq, player);
        }
      }
    }
    fs.rmSync(`${data.filePathMap.association}/${didian}.json`);
    e.reply('解散成功!');
    return;
  }
  async show_log(e) {
    let j;
    const reader = await Read_updata_log();
    let str = [];
    let line_log = reader.trim().split('\n'); //读取数据并按行分割
    line_log.forEach((item, index) => {
      // 删除空项
      if (!item) {
        line_log.splice(index, 1);
      }
    });
    for (let y = 0; y < line_log.length; y++) {
      let temp = line_log[y].trim().split(/\s+/); //读取数据并按空格分割
      let i = 0;
      if (temp.length == 4) {
        str.push(temp[0]);
        i = 1;
      }
      let t = '';
      for (let x = i; x < temp.length; x++) {
        t += temp[x];
        //console.log(t)
        if (x == temp.length - 2 || x == temp.length - 3) {
          t += '\t';
        }
      }
      str.push(t);
      //str += "\n";
    }
    let T;
    for (j = 0; j < str.length / 2; j++) {
      T = str[j];
      str[j] = str[str.length - 1 - j];
      str[str.length - 1 - j] = T;
    }
    for (j = str.length - 1; j > -1; j--) {
      if (
        str[j] == '零' ||
        str[j] == '打铁的'
      ) {
        let m = j;
        while (
          str[m - 1] != '零' &&
          str[m - 1] != '打铁的' &&
          m > 0
        ) {
          T = str[m];
          str[m] = str[m - 1];
          str[m - 1] = T;
          m--;
        }
      }
    }
    let log_data = {
      log: str,
    };
    const data1 = await new Show(e).get_logData(log_data);
    let img = await puppeteer.screenshot('log', {
      ...data1,
    });
    e.reply(img);
    return;
  }

  async Deleteexchange(e) {
    if (!e.isMaster) {
      return;
    }
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    e.reply('开始清除！');
    let Exchange;
    try {
      Exchange = await Read_Exchange();
    } catch {
      //没有表要先建立一个！
      await Write_Exchange([]);
      Exchange = await Read_Exchange();
    }
    for (let i of Exchange) {
      let usr_qq = i.qq;
      let thing = i.name.name;
      let quanity = i.aconut;
      if (i.name.class == "装备" || i.name.class == "仙宠")
        thing = i.name;
      await Add_najie_thing(usr_qq, thing, i.name.class, quanity, i.name.pinji);
    }
    await Write_Exchange([]);
    e.reply('清除完成！');
    return;
  }

  //#我的信息
  async Show_player(e) {
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    //不开放私聊功能
    if (!e.isGroup) {
      e.reply('此功能暂时不开放私聊');
      return;
    }
    let img = await get_player_img(e);
    e.reply(img);
    return;
  }

  async Allrelieve(e) {
    if (!e.isMaster) {
      return;
    }
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    e.reply('开始行动！');
    let playerList = [];
    let files = fs
      .readdirSync(
        './plugins/' + AppName + '/resources/data/xiuxian_player'
      )
      .filter(file => file.endsWith('.json'));
    for (let file of files) {
      file = file.replace('.json', '');
      playerList.push(file);
    }
    for (let player_id of playerList) {
      //清除游戏状态
      await redis.set('xiuxian:player:' + player_id + ':game_action', 1);
      let action = await redis.get('xiuxian:player:' + player_id + ':action');
      action = JSON.parse(action);
      //不为空，存在动作
      if (action != null) {
        await redis.del('xiuxian:player:' + player_id + ':action');
        let arr = action;
        arr.is_jiesuan = 1; //结算状态
        arr.shutup = 1; //闭关状态
        arr.working = 1; //降妖状态
        arr.power_up = 1; //渡劫状态
        arr.Place_action = 1; //秘境
        arr.Place_actionplus = 1; //沉迷状态
        arr.end_time = new Date().getTime(); //结束的时间也修改为当前时间
        delete arr.group_id; //结算完去除group_id
        await redis.set(
          'xiuxian:player:' + player_id + ':action',
          JSON.stringify(arr)
        );
      }
    }
    e.reply('行动结束！');
  }

  async relieve(e) {
    //主人判断
    if (!e.isMaster) {
      return;
    }
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    //没有at信息直接返回,不执行
    let isat = e.message.some(item => item.type === 'at');
    if (!isat) {
      return;
    }
    //获取at信息
    let atItem = e.message.filter(item => item.type === 'at');
    //对方qq
    let qq = atItem[0].qq;
    //检查存档
    let ifexistplay = await existplayer(qq);
    if (!ifexistplay) {
      return;
    }
    //清除游戏状态
    await redis.set('xiuxian:player:' + qq + ':game_action', 1);
    //查询redis中的人物动作
    let action = await redis.get('xiuxian:player:' + qq + ':action');
    action = JSON.parse(action);
    //不为空，有状态
    if (action != null) {
      //把状态都关了
      let arr = action;
      arr.is_jiesuan = 1; //结算状态
      arr.shutup = 1; //闭关状态
      arr.working = 1; //降妖状态
      arr.power_up = 1; //渡劫状态
      arr.Place_action = 1; //秘境
      arr.Place_actionplus = 1; //沉迷状态
      arr.end_time = new Date().getTime(); //结束的时间也修改为当前时间
      delete arr.group_id; //结算完去除group_id
      await redis.set('xiuxian:player:' + qq + ':action', JSON.stringify(arr));
      e.reply('已解除！');
      return;
    }
    //是空的
    e.reply('不需要解除！');
    return;
  }

  async Knockdown(e) {
    //主人判断
    if (!e.isMaster) {
      return;
    }
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    //没有at信息直接返回,不执行
    let isat = e.message.some(item => item.type === 'at');
    if (!isat) {
      return;
    }
    //获取at信息
    let atItem = e.message.filter(item => item.type === 'at');
    //对方qq
    let qq = atItem[0].qq;
    //检查存档
    let ifexistplay = await existplayer(qq);
    if (!ifexistplay) {
      e.reply('没存档你打个锤子！');
      return;
    }
    let player = await Read_player(qq);
    player.power_place = 1;
    e.reply('已打落凡间！');
    await Write_player(qq, player);
    return;
  }

  async replaceThing(e) {
    //主人判断
    if (!e.isMaster) return;
    const msg1 = e.msg.replace('#将米娜桑的纳戒里叫', '');
    const [thingName, msg2] = msg1.split('的的的');

    // #将米娜桑的纳戒里叫.*的的的(装备|道具|丹药|功法|草药|材料|盒子|仙宠|口粮|项链|食材)(抹除|替换为叫.*之之之(装备|道具|丹药|功法|草药|材料|盒子|仙宠|口粮|项链|食材))$
    if (e.msg.endsWith('抹除')) {
      const thingType = msg2.replace(/抹除$/, '');
      if (!thingName || !thingType)
        return e.reply(
          '格式错误，正确格式范例：#将米娜桑的纳戒里叫1w的的的道具替换为叫1k之之之道具'
        );
      await clearNajieThing(thingType, thingName);
      return e.reply('全部抹除完成');
    }

    // 替换为
    const N = 1; // 倍数
    const [thingType, msg3] = msg2.split('替换为叫');
    const [newThingName, newThingType] = msg3.split('之之之');
    const objArr = await clearNajieThing(thingType, thingName);
    objArr.map(uid_tnum => {
      const usrId = Object.entries(uid_tnum)[0][0];
      Add_najie_thing(usrId, newThingName, newThingType, uid_tnum.usrId * N);
    });
    return e.reply('全部替换完成');
  }
}

async function clearNajieThing(thingType, thingName) {
  if (!thingType || !thingName) return [];

  const path = './plugins/' + AppName + '/resources/data/xiuxian_najie';
  return fs
    .readdirSync(path)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const usrId = file.replace('.json', '');
      const najie = fs.readFileSync(`${path}/${file}`);
      const thingInNajie = JSON.parse(najie)[thingType]?.find(
        thing => thing.name == thingName
      );
      if (!thingInNajie) return false;

      let thingNumber = thingInNajie.数量;
      Add_najie_thing(usrId, thingName, thingType, -thingNumber);

      if (thingType == '装备') {
        ['劣', '普', '优', '精', '绝', '顶'].map(async pinji => {
          const thingNum = await exist_najie_thing(
            usrId,
            thingName,
            thingType,
            pinji
          );
          if (thingNum) {
            Add_najie_thing(usrId, thingName, thingType, -thingNum, pinji);
            thingNumber += thingNum;
          }
        });
      }

      return { [usrId]: thingNumber };
    })
    .filter(usrObj => usrObj);
}

export async function synchronization(e) {
  if (!e.isMaster) {
    return;
  }
  e.reply('存档开始同步');
  let playerList = [];
  let files = fs
    .readdirSync(
      './plugins/' + AppName + '/resources/data/xiuxian_player'
    )
    .filter(file => file.endsWith('.json'));
  for (let file of files) {
    file = file.replace('.json', '');
    playerList.push(file);
  }
  for (let player_id of playerList) {
    let usr_qq = player_id;
    let player = await data.getData('player', usr_qq);
    let najie = await Read_najie(usr_qq);
    let equipment = await Read_equipment(usr_qq);
    let ziduan = ["镇妖塔层数", "神魄段数", "魔道值", "师徒任务阶段", "师徒积分", "favorability", "血气", "lunhuiBH", "lunhui",
      "攻击加成", "防御加成", "生命加成", "幸运", "练气皮肤", "装备皮肤", "islucky", "sex", "addluckyNo", "神石"];
    let ziduan2 = ["Physique_id", "linggenshow", "power_place", "occupation_level", "血量上限", "当前血量", "攻击", "防御"];
    let ziduan3 = ["linggen", "occupation", "仙宠"];
    let ziduan4 = ["材料", "草药", "仙宠", "仙宠口粮"];
    for (let k of ziduan) {
      if (!isNotNull(player[k])) {
        player[k] = 0;
      }
    }
    for (let k of ziduan2) {
      if (!isNotNull(player[k])) {
        player[k] = 1;
      }
    }
    for (let k of ziduan3) {
      if (!isNotNull(player[k])) {
        player[k] = [];
      }
    }
    for (let k of ziduan4) {
      if (!isNotNull(najie[k])) {
        najie[k] = [];
      }
    }
    if (!isNotNull(player.breakthrough)) {
      player.breakthrough = false;
    }
    if (!isNotNull(player.id)) {
      player.id = usr_qq;
    }
    if (!isNotNull(player.轮回点) || player.轮回点 > 10) {
      player.轮回点 = 10 - player.lunhui;
    }
    try {
      await Read_danyao(usr_qq);
    }
    catch
    {
      const arr = {
        biguan: 0, //闭关状态
        biguanxl: 0, //增加效率
        xingyun: 0,
        lianti: 0,
        ped: 0,
        modao: 0,
        beiyong1: 0, //ped
        beiyong2: 0,
        beiyong3: 0,
        beiyong4: 0,
        beiyong5: 0
      };
      await Write_danyao(usr_qq, arr);
    }

    let suoding = ["装备", "丹药", "道具", "功法", "草药", "材料", "仙宠", "仙宠口粮"];
    for (let j of suoding) {
      najie[j].forEach(item => {
        if (!isNotNull(item.islockd)) {
          item.islockd = 0;
        }
      });
    }
    //仙宠调整
    if (player.仙宠.id > 2930 && player.仙宠.id < 2936) {
      player.仙宠.初始加成 = 0.002;
      player.仙宠.每级增加 = 0.002;
      player.仙宠.加成 = player.仙宠.每级增加 * player.仙宠.等级;
      player.幸运 = player.addluckyNo + player.仙宠.加成;
    }
    else
      player.幸运 = player.addluckyNo;
    for (let j of najie.仙宠) {
      if (j.id > 2930 && player.仙宠.id < 2936) {
        j.初始加成 = 0.002;
        j.每级增加 = 0.002;
      }
    }
    //装备调整
    let wuqi = ["雾切之回光", "护摩之杖", "磐岩结绿", "三圣器·朗基努斯之枪"]
    let wuqi2 = ["紫云剑", "炼血竹枪", "少阴玉剑", "纯阴金枪"]
    for (let j of najie.装备) {
      for (let k in wuqi) {
        if (j.name == wuqi[k]) {
          j.name = wuqi2[k];
        }
        if (equipment.武器.name == wuqi[k])
          equipment.武器.name = wuqi2[k];
        if (equipment.法宝.name == wuqi[k])
          equipment.法宝.name = wuqi2[k];
      }
    }
    //口粮调整
    for (let j of najie.仙宠口粮) {
      j.class = "仙宠口粮";
    }
    let linggeng = data.talent_list.find(item => item.name == player.灵根.name);
    if (linggeng)
      player.灵根 = linggeng;

    //隐藏灵根
    if (player.隐藏灵根)
      player.隐藏灵根 = data.yincang.find(item => item.name == player.隐藏灵根.name);
    //重新根据id去重置仙门
    let now_level_id = await data.Level_list.find(
      item => item.level_id == player.level_id
    ).level_id;
    if (now_level_id < 42) {
      player.power_place = 1;
    }
    await Write_equipment(usr_qq, equipment);
    await Write_najie(usr_qq, najie);
    await Write_player(usr_qq, player);
  }
  e.reply('存档同步结束');

  // NOTE: 魔术师同步，开发者专用，要使用请删除注释
  /*
  const thingType = ''; // 填写欲抹除物品类型
  const thingName = ''; // 填写欲抹除物品名称

  const objArr = await clearNajieThing(thingType, thingName);
  e.reply('物品自动抹除结束');

  const newThingType = '';
  const newThingName = ''; // 填写新物品
  const N = 1; // 填写

  objArr.map(uid_tnum => {
    const usrId = Object.entries(uid_tnum)[0][0];
    Add_najie_thing(usrId, newThingName, newThingType, uid_tnum.usrId * N);
  });
  e.reply('物品自动替换结束');
*/
  return;
}
