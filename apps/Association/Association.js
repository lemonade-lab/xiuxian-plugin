import fs from 'fs';
import {
  plugin,
  segment,
  puppeteer,
  verc,
  Show,
  data,
  config,
} from '../../api/api.js';
import {
  timestampToTime,
  shijianc,
  get_random_fromARR,
  ForwardMsg,
  player_efficiency,
  setFileValue,
} from '../../model/xiuxian.js';
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];
const 宗门灵石池上限 = [
  2000000, 5000000, 8000000, 11000000, 15000000, 20000000, 25000000, 30000000,
];
export class Association extends plugin {
  constructor() {
    super({
      name: 'Association',
      dsc: '宗门模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#加入宗门.*$',
          fnc: 'Join_association',
        },
        {
          reg: '^#退出宗门$',
          fnc: 'Exit_association',
        },
        {
          reg: '^#宗门(上交|上缴|捐赠)灵石[1-9]d*',
          fnc: 'give_association_lingshi',
        },
        {
          reg: '^#宗门俸禄$',
          fnc: 'gift_association',
        },
        {
          reg: '^#宗门捐献记录$',
          fnc: 'Logs_donate',
        },
        {
          reg: '^#宗门列表$',
          fnc: 'List_appointment',
        },
      ],
    });
  }

  //宗门俸禄
  async gift_association(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) return false;
    let player = data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) return false;
    let ass = data.getAssociation(player.宗门.宗门名称);
    let ismt = isNotMaintenance(ass);
    if (ismt) {
      e.reply(`宗门尚未维护，快找宗主维护宗门`);
      return false;
    }
    let now = new Date();
    let nowTime = now.getTime(); //获取当前日期的时间戳
    let Today = await shijianc(nowTime);
    let lastsign_time = await getLastsign_Asso(usr_qq); //获得上次宗门签到日期
    if (
      Today.Y == lastsign_time.Y &&
      Today.M == lastsign_time.M &&
      Today.D == lastsign_time.D
    ) {
      e.reply(`今日已经领取过了`);
      return false;
    }
    //给奖励
    let temp = player.宗门.职位;
    let n = 1;
    if (temp == '外门弟子') {
      e.reply('没有资格领取俸禄');
      return false;
    }
    if (temp == '内门弟子') {
      e.reply('没有资格领取俸禄');
      return false;
    }
    if (temp == '长老') {
      n = 3;
    }
    if (temp == '副宗主') {
      n = 4;
    }
    if (temp == '宗主') {
      n = 5;
    }
    let fuli = Number(Math.trunc(ass.宗门建设等级 * 2000));
    let gift_lingshi = Math.trunc(ass.宗门等级 * 1200 * n + fuli);
    gift_lingshi = gift_lingshi / 2;
    if (ass.灵石池 - gift_lingshi < 0) {
      e.reply(`宗门灵石池不够发放俸禄啦，快去为宗门做贡献吧`);
      return false;
    }
    ass.灵石池 -= gift_lingshi;
    player.灵石 += gift_lingshi;
    await redis.set('xiuxian:player:' + usr_qq + ':lastsign_Asso_time', nowTime); //redis设置签到时间
    data.setData('player', usr_qq, player);
    data.setAssociation(ass.宗门名称, ass);
    let msg = [
      segment.at(usr_qq),
      `宗门俸禄领取成功,获得了${gift_lingshi}灵石`,
    ];
    e.reply(msg);
    return false;
  }

  //加入宗门
  async Join_association(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) return false;
    let player = data.getData('player', usr_qq);
    if (isNotNull(player.宗门)) return false;
    let now_level_id;
    if (!isNotNull(player.level_id)) {
      e.reply('请先#同步信息');
      return false;
    }
    let association_name = e.msg.replace('#加入宗门', '');
    association_name = association_name.trim();
    let ifexistass = data.existData('association', association_name);
    if (!ifexistass) {
      e.reply('这方天地不存在' + association_name);
      return false;
    }
    let ass = data.getAssociation(association_name);
    now_level_id = data.Level_list.find(
      item => item.level_id == player.level_id
    ).level_id;
    if (now_level_id >= 42 && ass.power == 0) {
      e.reply('仙人不可下界！');
      return false;
    }
    if (now_level_id < 42 && ass.power == 1) {
      e.reply('你在仙界吗？就去仙界宗门');
      return false;
    }

    if (ass.最低加入境界 > now_level_id) {
      let level = data.Level_list.find(
        item => item.level_id === ass.最低加入境界
      ).level;
      e.reply(
        `${association_name}招收弟子的最低境界要求为:${level},当前未达到要求`
      );
      return false;
    }
    let mostmem = 宗门人数上限[ass.宗门等级 - 1]; //该宗门目前人数上限
    let nowmem = ass.所有成员.length; //该宗门目前人数
    if (mostmem <= nowmem) {
      e.reply(`${association_name}的弟子人数已经达到目前等级最大,无法加入`);
      return false;
    }
    let now = new Date();
    let nowTime = now.getTime(); //获取当前时间戳
    let date = timestampToTime(nowTime);
    player.宗门 = {
      宗门名称: association_name,
      职位: '外门弟子',
      time: [date, nowTime],
    };
    data.setData('player', usr_qq, player);
    ass.所有成员.push(usr_qq);
    ass.外门弟子.push(usr_qq);
    await player_efficiency(usr_qq);
    data.setAssociation(association_name, ass);
    e.reply(`恭喜你成功加入${association_name}`);
    return false;
  }

  //退出宗门
  async Exit_association(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) return false;
    let player = data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) return false;
    let now = new Date();
    let nowTime = now.getTime(); //获取当前时间戳
    let addTime;
    var time = config.getConfig('xiuxian', 'xiuxian').CD.joinassociation; //分钟
    if (typeof player.宗门.time == 'undefined') {
      addTime = player.宗门.加入时间[1] + 60000 * time;
    } else {
      //新版本的数据变成了time
      addTime = player.宗门.time[1] + 60000 * time;
    }
    if (addTime > nowTime) {
      e.reply('加入宗门不满' + `${time}分钟,无法退出`);
      return false;
    }

    if (player.宗门.职位 != '宗主') {
      let ass = data.getAssociation(player.宗门.宗门名称);
      ass[player.宗门.职位] = ass[player.宗门.职位].filter(
        item => item != usr_qq
      );
      ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq);
      data.setAssociation(ass.宗门名称, ass);
      delete player.宗门;
      data.setData('player', usr_qq, player);
      await player_efficiency(usr_qq);
      e.reply('退出宗门成功');
    } else {
      let ass = data.getAssociation(player.宗门.宗门名称);
      if (ass.所有成员.length < 2) {
        fs.rmSync(
          `${data.filePathMap.association}/${player.宗门.宗门名称}.json`
        );
        delete player.宗门; //删除存档里的宗门信息
        data.setData('player', usr_qq, player);
        await player_efficiency(usr_qq);
        e.reply(
          '退出宗门成功,退出后宗门空无一人。\n一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'
        );
      } else {
        ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq); //原来的成员表删掉这个B
        delete player.宗门; //删除这个B存档里的宗门信息
        data.setData('player', usr_qq, player);
        await player_efficiency(usr_qq);
        //随机一个幸运儿的QQ,优先挑选等级高的
        let randmember_qq;
        if (ass.副宗主.length > 0) {
          randmember_qq = await get_random_fromARR(ass.副宗主);
        } else if (ass.长老.length > 0) {
          randmember_qq = await get_random_fromARR(ass.长老);
        } else if (ass.内门弟子.length > 0) {
          randmember_qq = await get_random_fromARR(ass.内门弟子);
        } else {
          randmember_qq = await get_random_fromARR(ass.所有成员);
        }
        let randmember = await data.getData('player', randmember_qq); //获取幸运儿的存档
        ass[randmember.宗门.职位] = ass[randmember.宗门.职位].filter(
          item => item != randmember_qq
        ); //原来的职位表删掉这个幸运儿
        ass['宗主'] = randmember_qq; //新的职位表加入这个幸运儿
        randmember.宗门.职位 = '宗主'; //成员存档里改职位
        data.setData('player', randmember_qq, randmember); //记录到存档
        data.setData('player', usr_qq, player);
        data.setAssociation(ass.宗门名称, ass); //记录到宗门
        e.reply(`退出宗门成功,退出后,宗主职位由${randmember.名号}接管`);
      }
    }
    player.favorability = 0;
    data.setData('player', usr_qq, player);
    return false;
  }

  //捐赠灵石
  async give_association_lingshi(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) return false;
    let player = data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) {
      return false;
    }
    //获取灵石数量
    var reg = new RegExp(/#宗门(上交|上缴|捐赠)灵石/);
    let lingshi = e.msg.replace(reg, '');
    lingshi = lingshi.trim(); //去掉空格
    if (!isNaN(parseFloat(lingshi)) && isFinite(lingshi)) {
    } else {
      return false;
    }
    //校验输入灵石数
    if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) > 0) {
      lingshi = parseInt(lingshi);
    } else {
      return false;
    }
    if (player.灵石 < lingshi) {
      e.reply(`你身上只有${player.灵石}灵石,数量不足`);
      return false;
    }
    let ass = data.getAssociation(player.宗门.宗门名称);
    let xf = 1;
    if (ass.power == 1) {
      xf = 10;
    }
    if (ass.灵石池 + lingshi > 宗门灵石池上限[ass.宗门等级 - 1] * xf) {
      e.reply(
        `${ass.宗门名称}的灵石池最多还能容纳${
          宗门灵石池上限[ass.宗门等级 - 1] * xf - ass.灵石池
        }灵石,请重新捐赠`
      );
      return false;
    }
    ass.灵石池 += lingshi;
    if (!isNotNull(player.宗门.lingshi_donate)) {
      player.宗门.lingshi_donate = 0; //未定义捐赠数量则为0
    }
    player.宗门.lingshi_donate += lingshi;
    data.setData('player', usr_qq, player);
    data.setAssociation(ass.宗门名称, ass);
    await setFileValue(usr_qq, -lingshi, '灵石');
    e.reply(
      `捐赠成功,你身上还有${player.灵石 - lingshi}灵石,宗门灵石池目前有${
        ass.灵石池
      }灵石`
    );
    return false;
  }

  //宗门捐献记录
  async Logs_donate(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) return false;
    let player = data.getData('player', usr_qq);
    if (!isNotNull(player.宗门)) return false;
    let ass = data.getAssociation(player.宗门.宗门名称);
    let donate_list = [];
    for (let i in ass.所有成员) {
      //遍历所有成员
      let member_qq = ass.所有成员[i];
      let member_data = data.getData('player', member_qq);
      if (!isNotNull(member_data.宗门.lingshi_donate)) {
        member_data.宗门.lingshi_donate = 0; //未定义捐赠数量则为0
      }
      donate_list[i] = {
        name: member_data.名号,
        lingshi_donate: member_data.宗门.lingshi_donate,
      };
    }
    donate_list.sort(sortBy('lingshi_donate'));
    let msg = [`${ass.宗门名称} 灵石捐献记录表`];
    for (let i = 0; i < donate_list.length; i++) {
      msg.push(
        `第${i + 1}名  ${donate_list[i].name}  捐赠灵石:${
          donate_list[i].lingshi_donate
        }`
      );
    }
    await ForwardMsg(e, msg);
    return false;
  }

  //宗门列表
  async List_appointment(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq);
    if (!ifexistplay) return;
    let dir = data.filePathMap.association;
    let File = fs.readdirSync(dir);
    File = File.filter(file => file.endsWith('.json')); //这个数组内容是所有的宗门名称
    let temp = [];
    if (File.length == 0) {
      e.reply('暂时没有宗门数据');
      return;
    }
    for (var i = 0; i < File.length; i++) {
      let this_name = File[i].replace('.json', '');
      let this_ass = await data.getAssociation(this_name);
      //处理一下宗门效率问题
      let this_ass_xiuxian = 0;
      if (this_ass.宗门驻地 == 0) {
        this_ass_xiuxian = this_ass.宗门等级 * 0.05 * 100;
      } else {
        let dongTan = await data.bless_list.find(
          item => item.name == this_ass.宗门驻地
        );
        try {
          this_ass_xiuxian =
            this_ass.宗门等级 * 0.05 * 100 + dongTan.efficiency * 100;
        } catch {
          this_ass_xiuxian = this_ass.宗门等级 * 0.05 * 100 + 5;
        }
      }
      this_ass_xiuxian = Math.trunc(this_ass_xiuxian);
      var shenshou = this_ass.宗门神兽;
      var zhudi = this_ass.宗门驻地;
      var power;
      if (this_ass.宗门神兽 == 0) {
        shenshou = '暂无';
      }
      if (zhudi == 0) {
        zhudi = '暂无';
      }
      if (this_ass.power == 0) {
        power = '凡界';
      } else {
        power = '仙界';
      }
      let level = data.Level_list.find(
        item => item.level_id == this_ass.最低加入境界
      ).level;
      let arr = {
        宗名: this_ass.宗门名称,
        人数: this_ass.所有成员.length,
        宗门人数上限: 宗门人数上限[this_ass.宗门等级 - 1],
        位置: power,
        等级: this_ass.宗门等级,
        天赋加成: this_ass_xiuxian,
        宗门建设等级: this_ass.宗门建设等级,
        镇宗神兽: shenshou,
        宗门驻地: zhudi,
        最低加入境界: level,
        宗主: this_ass.宗主,
      };
      temp.push(arr);
    }
    let zongmeng_data = {
      temp,
    };
    const data1 = await new Show(e).get_zongmeng_data(zongmeng_data);
    let img = await puppeteer.screenshot('zongmeng', {
      ...data1,
    });
    e.reply(img);
    return false;
  }
}

/**
 * 判断宗门是否需要维护
 * @param ass 宗门对象
 * @returns true or false
 */
function isNotMaintenance(ass) {
  let now = new Date();
  let nowTime = now.getTime(); //获取当前日期的时间戳
  if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
    return false;
  }
  return true;
}

/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @returns obj==null/undefined,return false,other return true
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
