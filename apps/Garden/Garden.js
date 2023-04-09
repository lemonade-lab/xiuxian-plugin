import { plugin, verc, data, config } from '../../api/api.js';
import {
  timestampToTime,
  shijianc,
  exist_najie_thing,
  ForwardMsg,
  Add_najie_thing,
} from '../../model/xiuxian.js';
export class Garden extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_Garden',
      dsc: '药园模块',
      event: 'message',
      priority: 600, //小功能高一些
      rule: [
        {
          reg: '^#拔苗助长.*$',
          fnc: 'Get_vegetable',
        },
        {
          reg: '^#偷菜*$',
          fnc: 'Get_morevegetable',
        },
        {
          reg: '^#药园*$',
          fnc: 'Vegetable',
        },
        {
          reg: '^(禁言术|残云封天剑).*$',
          fnc: 'Silencing',
        },
        {
          reg: '^(除你禁言|废除).*$',
          fnc: 'Banislifted',
        },
      ],
    });
  }

  //菜园显示
  async Vegetable(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq);

    if (!ifexistplay) return false;

    let player = data.getData('player', usr_qq);

    if (!isNotNull(player.宗门)) return false;

    let ass = data.getAssociation(player.宗门.宗门名称);
    if (!isNotNull(player.宗门)) {
      return false;
    } else if (ass.药园.药园等级 == 1 || ass.药园.药园等级 !== ass.宗门等级) {
      //加入宗门，没有药园或药园等级不等于宗门等级，则新建药园。
      await new_Garden(player.宗门.宗门名称, usr_qq); //新建药园
      e.reply('新建药园，种下了一棵草');
      ass = data.getAssociation(player.宗门.宗门名称);
    }
    let zuowu;
    let shuliang = ass.宗门等级;
    if (shuliang > 6) {
      shuliang = 6;
    }
    let msg = [
      `宗门名称: ${ass.宗门名称}` +
        '\n' +
        `药园可栽种: ${shuliang} 棵药草` +
        '\n' +
        `药园药草如下:`,
    ];
    let nowTime = new Date().getTime(); //获取当前时间

    for (var i = 0; i < ass.药园.作物.length; i++) {
      zuowu = ass.药园.作物;
      if (
        zuowu[i].name == '天灵花' ||
        zuowu[i].name == '皇草' ||
        zuowu[i].name == '创世花'
      )
        continue;
      let vegetable_Oldtime = await redis.get(
        'xiuxian:' + ass.宗门名称 + zuowu[i].name
      ); //获得上次的成熟时间戳,
      let chengshu_t = Math.trunc((vegetable_Oldtime - nowTime) / 86400000); //成熟天数
      let chengshu_m = Math.trunc(
        ((vegetable_Oldtime - nowTime) % 86400000) / 60 / 60 / 1000
      ); //成熟小时
      let chengshu_s = Math.trunc(
        ((vegetable_Oldtime - nowTime) % 3600000) / 60 / 1000
      ); //成熟分钟
      if (chengshu_t <= 0 && chengshu_m <= 0 && chengshu_s <= 0) {
        chengshu_t = 0;
        chengshu_m = 0;
        chengshu_s = 0;
      }
      let msg1 = [
        `作物: ${zuowu[i].name} ` +
          '\n' +
          `描述: ${zuowu[i].desc}` +
          '\n' +
          `成长时间:${chengshu_t}天${chengshu_m}小时${chengshu_s}分钟`,
      ];
      msg.push(msg1);
    }
    await ForwardMsg(e, msg);
    return false;
  }

  //拔苗助长
  async Get_vegetable(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) return false;
    let player = data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) return false;
    let ass = data.getAssociation(player.宗门.宗门名称);
    if (!isNotNull(player.宗门)) {
      return false;
    } else if (ass.药园.药园等级 == 1) {
      //加入宗门，没有药园，则新建药园。
      e.reply('药园等级太低，可远观不可亵玩焉');
      return false;
    }

    //增加cd
    let now = new Date();
    //获取当前时间戳
    let nowTime = now.getTime();
    //获得时间戳
    let last_garden_time = await redis.get(
      'xiuxian@1.3.0:' + usr_qq + ':last_garden_time'
    );
    //
    last_garden_time = parseInt(last_garden_time);
    var time = config.getConfig('xiuxian', 'xiuxian').CD.garden; //时间（分钟）
    let transferTimeout = parseInt(60000 * time); //
    if (nowTime < last_garden_time + transferTimeout) {
      let waittime_m = Math.trunc(
        (last_garden_time + transferTimeout - nowTime) / 60 / 1000
      );
      let waittime_s = Math.trunc(
        ((last_garden_time + transferTimeout - nowTime) % 60000) / 1000
      );
      e.reply(
        `每${transferTimeout / 1000 / 60}分钟拔苗一次。` +
          `cd: ${waittime_m}分${waittime_s}秒`
      );
      return false;
    }

    let vegetable = ass.药园.作物;
    let vagetable_name = e.msg.replace('#拔苗助长', '');
    for (var i = 0; i < vegetable.length; i++) {
      if (vegetable[i].name == vagetable_name) {
        let ts = vegetable[i].ts;
        let nowTime = new Date().getTime(); //获取当前时间
        let vegetable_Oldtime = await redis.get(
          'xiuxian:' + ass.宗门名称 + vagetable_name
        ); //获得上次的成熟时间戳,
        if (nowTime + 1000 * 60 * 30 < vegetable_Oldtime) {
          //判断是否成熟
          e.reply(
            `作物${vagetable_name}增加1800000成熟度,还需要${
              vegetable_Oldtime - nowTime - 1000 * 60 * 30
            }成熟度`
          );
          vegetable_Oldtime -= 1000 * 60 * 30; //每次拔苗助长减少 预定成熟的时间
          await redis.set(
            'xiuxian:' + ass.宗门名称 + vagetable_name,
            vegetable_Oldtime
          ); //存入缓存
          //记录本次获得时间戳
          await redis.set(
            'xiuxian@1.3.0:' + usr_qq + ':last_garden_time',
            nowTime
          );
          return false;
        } else {
          e.reply(
            `作物${vagetable_name}已成熟，被${usr_qq}${player.名号}摘取,放入纳戒了`
          );
          await Add_najie_thing(usr_qq, vagetable_name, '草药', 1);
          var vegetable_OutTime = nowTime + 1000 * 60 * 60 * 24 * ts; //设置新一轮成熟时间戳
          ass.药园.作物[i].start_time = nowTime; //将当前时间写入药园作物中
          await data.setAssociation(ass.宗门名称, ass); //刷新写入作物时间戳
          await redis.set(
            'xiuxian:' + ass.宗门名称 + vagetable_name,
            vegetable_OutTime
          ); //存入缓存
          //记录本次获得时间戳
          await redis.set(
            'xiuxian@1.3.0:' + usr_qq + ':last_garden_time',
            nowTime
          );
          return false;
        }
      }
    }
    e.reply('您拔错了吧！掣电树chedianshu');

    //记录本次获得时间戳
    await redis.set('xiuxian:player:' + usr_qq + ':last_garden_time', nowTime);
    return false;
  }

  //禁言术/残云封天剑/需要剑帝信物发动  你尚未拥有剑帝信物，无法发动残云封天剑
  async Silencing(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id; //使用者QQ
    let qq = null;

    for (let msg of e.message) {
      //获取对方QQ
      if (msg.type == 'at') {
        qq = msg.qq;
        break;
      }
    }
    if (qq == null) return false;
    //判断双方是否有档
    let ifexistplay = data.existData('player', usr_qq);
    let ifexistplay1 = data.existData('player', qq);
    if (!ifexistplay) return false;
    if (!ifexistplay1) return false;
    var GayCD = {};
    const cd = 2; //设置冷却时间，单位为分钟
    let id = e.group_id + e.user_id;
    if (GayCD[id]) {
      e.reply(`残云封天剑有${cd}分钟冷却时间!`);
      return false;
    }

    let player = data.getData('player', usr_qq); //读取用户修仙信息
    let player1 = data.getData('player', qq); //读取用户修仙信息
    let qingdianshu = await exist_najie_thing(usr_qq, '剑帝一剑', '道具');
    if (qingdianshu !== false && qingdianshu !== 0) {
      //判断纳戒有没有剑帝信物
      let num1 = Math.round(Math.random() * 100 * 1.1); //能跑就行，暂时不用在意取名细节
      let num2 = Math.round((Math.random() * 100) / 1.1);
      let num3 = Math.random();
      let num4 = Math.random();
      await Add_najie_thing(usr_qq, '剑帝一剑', '道具', -1);

      if (num1 < num2) {
        if (num3 > num4) {
          e.reply(`剑帝一剑【残云封天】，封！`);
          e.group.muteMember(qq, num2 * 6);
        } else if (num3 < num4) {
          e.reply(`虚空中出现一只大手，砍出一剑，${player1.名号}没有了动静`);
          e.group.muteMember(qq, num2 * 9);
        } else {
          e.reply(
            `${user_id}${player.名号}一手按压在剑帝信物上，一道剑光从剑帝信物上发出，化成符文冲入${qq}${player1.名号}口中，封！`
          );
          e.group.muteMember(qq, num2 * 8);
        }
      } else if (num1 > num2) {
        if (num3 > num4) {
          e.reply(`斩！`);
          e.group.muteMember(qq, num2);
        } else if (num3 < num4) {
          e.reply(`残云封天剑封！`);
          e.group.muteMember(qq, num2 * 8);
        } else {
          e.reply(
            `一手按压在剑帝信物上，一道剑光从剑帝信物上发出，化成符文冲入${qq}${player1.名号}口中，封！`
          );
          e.group.muteMember(qq, num2 * 8);
        }
      } else {
        e.reply(`修仙之人不讲武德！,同归于尽！`);
        e.group.muteMember(usr_qq, num2 * 2);
        e.group.muteMember(qq, num2);
      }

      GayCD[id] = true;

      GayCD[id] = setTimeout(() => {
        if (GayCD[id]) {
          delete GayCD[id];
        }
      }, cd * 60 * 1000);
      //执行的逻辑功能

      return false;
    } else {
      e.reply(`你并没有【剑帝一剑】，请通过人界秘境获取`);
    }
  }

  async Banislifted(e) {
    return false;
  }
}

/**
 * 创立新的药园
 * @param name 宗门名称
 * @param user_qq qq号
 */
async function new_Garden(association_name, user_qq) {
  let now = new Date();
  let nowTime = now.getTime(); //获取当前时间戳
  let date = timestampToTime(nowTime);
  let ass = data.getAssociation(association_name);
  let AssociationGarden;
  //怎么直接写这里而不是调用文件
  if (ass.宗门等级 == 9) {
    AssociationGarden = {
      药园等级: 9,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草',
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸',
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量',
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑',
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草',
        },
        {
          name: '龙火',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '龙火，不详',
        },
      ],
    };
  } else if (ass.宗门等级 == 8) {
    AssociationGarden = {
      药园等级: 8,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草',
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸',
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量',
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑',
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草',
        },
        {
          name: '龙火',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '龙火，不详',
        },
      ],
    };
  } else if (ass.宗门等级 == 7) {
    AssociationGarden = {
      药园等级: 7,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草',
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸',
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量',
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑',
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草',
        },
        {
          name: '龙火',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '龙火，不详',
        },
      ],
    };
  } else if (ass.宗门等级 == 6) {
    AssociationGarden = {
      药园等级: 6,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草',
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸',
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量',
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑',
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草',
        },
        {
          name: '龙火',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '龙火，不详',
        },
      ],
    };
  } else if (ass.宗门等级 == 5) {
    AssociationGarden = {
      药园等级: 5,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草',
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸',
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量',
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑',
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草',
        },
      ],
    };
  } else if (ass.宗门等级 == 4) {
    AssociationGarden = {
      药园等级: 4,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草',
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸',
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量',
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑',
        },
      ],
    };
  } else if (ass.宗门等级 == 3) {
    AssociationGarden = {
      药园等级: 3,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草',
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸',
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量',
        },
      ],
    };
  } else if (ass.宗门等级 == 2) {
    AssociationGarden = {
      药园等级: 2,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草',
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸',
        },
      ],
    };
  } else if (ass.宗门等级 == 1) {
    AssociationGarden = {
      药园等级: 1,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草',
        },
      ],
    };
  }

  ass.药园 = AssociationGarden;
  data.setAssociation(association_name, ass);
  //let ass = data.getAssociation(holder_qq);
  return false;
}

/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @return  falses obj==null/undefined,return  false ,other return  false true
 */
function isNotNull(obj) {
  if (obj == undefined || obj == null) return false;
  return true;
}

//对象数组排序
function sortBy(field) {
  //从大到小,b和a反一下就是从小到大
  return function (b, a) {
    return a[field] - b[field];
  };
}
// function isNotBlank(value) {
//     if (value ?? '' !== '') {
//         return  false true;
//     } else {
//         return  false ;
//     }
// }

//获取上次签到时间
async function getLastsign_Asso(usr_qq) {
  //查询redis中的人物动作
  let time = await redis.get('xiuxian:player:' + usr_qq + ':lastsign_Asso_time');
  if (time != null) {
    let data = await shijianc(parseInt(time));
    return data;
  }
  return false;
}
