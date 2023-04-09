import { plugin, verc, data, config } from '../../api/api.js';
import {
  Read_player,
  existplayer,
  isNotNull,
  sleep,
  exist_najie_thing,
  Add_najie_thing,
} from '../../model/xiuxian.js';
import {
  Add_灵石,
  Add_修为,
  exist_hunyin,
  find_qinmidu,
  add_qinmidu,
  Goweizhi,
  jindi,
  Go,
} from '../../model/xiuxian.js';
export class SecretPlace extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_SecretPlace',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#修仙状态$',
          fnc: 'Xiuxianstate',
        },
        {
          reg: '^#秘境$',
          fnc: 'Secretplace',
        },
        {
          reg: '^#降临秘境.*$',
          fnc: 'Gosecretplace',
        },
        {
          reg: '^#禁地$',
          fnc: 'Forbiddenarea',
        },
        {
          reg: '^#前往禁地.*$',
          fnc: 'Goforbiddenarea',
        },
        {
          reg: '^#仙府$',
          fnc: 'Timeplace',
        },
        {
          reg: '^#探索仙府$',
          fnc: 'GoTimeplace',
        },
        {
          reg: '^#仙境$',
          fnc: 'Fairyrealm',
        },
        {
          reg: '^#镇守仙境.*$',
          fnc: 'Gofairyrealm',
        },
        {
          reg: '^#逃离',
          fnc: 'Giveup',
        },
      ],
    });
  }

  async Xiuxianstate(e) {
    if (!verc({ e })) return false;
    let flag = await Go(e);
    if (!flag) {
      return false;
    }
    return false;
  }

  //秘境地点
  async Secretplace(e) {
    if (!verc({ e })) return false;
    let addres = '秘境';
    let weizhi = data.didian_list;
    await Goweizhi(e, weizhi, addres);
  }

  //禁地
  async Forbiddenarea(e) {
    if (!verc({ e })) return false;
    let addres = '禁地';
    let weizhi = data.forbiddenarea_list;
    await jindi(e, weizhi, addres);
  }

  //限定仙府
  async Timeplace(e) {
    if (!verc({ e })) return false;
    e.reply('仙府乃民间传说之地,请自行探索');
  }

  //仙境
  async Fairyrealm(e) {
    if (!verc({ e })) return false;
    let addres = '仙境';
    let weizhi = data.Fairyrealm_list;
    await Goweizhi(e, weizhi, addres);
  }

  //降临秘境
  async Gosecretplace(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let flag = await Go(e);
    if (!flag) {
      return false;
    }
    let player = await Read_player(usr_qq);
    let didian = e.msg.replace('#降临秘境', '');
    didian = didian.trim();
    let weizhi = await data.didian_list.find(item => item.name == didian);
    if (!isNotNull(weizhi)) {
      return false;
    }
    if (player.灵石 < weizhi.Price) {
      e.reply('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~');
      return false;
    }
    if (didian == '桃花岛') {
      let exist_B = await exist_hunyin(usr_qq);
      if (!exist_B) {
        e.reply(`还请少侠找到道侣之后再来探索吧`);
        return false;
      }
      let qinmidu = await find_qinmidu(usr_qq, exist_B);
      if (qinmidu < 550) {
        e.reply('少侠还是先和道侣再联络联络感情吧');
        return false;
      }
      await add_qinmidu(usr_qq, exist_B, -50);
    }
    let Price = weizhi.Price;
    await Add_灵石(usr_qq, -Price);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.secretplace; //时间（分钟）
    let action_time = 60000 * time; //持续时间，单位毫秒
    let arr = {
      action: '历练', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '0', //秘境状态---开启
      Place_actionplus: '1', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      //这里要保存秘境特别需要留存的信息
      Place_address: weizhi,
    };
    if (e.isGroup) {
      arr.group_id = e.group_id;
    }
    await redis.set('xiuxian:player:' + usr_qq + ':action', JSON.stringify(arr));
    e.reply('开始降临' + didian + ',' + time + '分钟后归来!');
    return false;
  }

  //前往禁地
  async Goforbiddenarea(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let flag = await Go(e);
    if (!flag) {
      return false;
    }
    let player = await Read_player(usr_qq);
    let now_level_id;
    if (!isNotNull(player.level_id)) {
      e.reply('请先#同步信息');
      return false;
    }
    if (!isNotNull(player.power_place)) {
      e.reply('请#同步信息');
      return false;
    }
    now_level_id = data.Level_list.find(
      item => item.level_id == player.level_id
    ).level_id;
    if (now_level_id < 22) {
      e.reply('没有达到化神之前还是不要去了');
      return false;
    }
    let didian = await e.msg.replace('#前往禁地', '');
    didian = didian.trim();
    let weizhi = await data.forbiddenarea_list.find(
      item => item.name == didian
    );
    // if (player.power_place == 0 && weizhi.id != 666) {
    //     e.reply("仙人不得下凡")
    //     return  false;
    //  }
    if (!isNotNull(weizhi)) {
      return false;
    }
    if (player.灵石 < weizhi.Price) {
      e.reply('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~');
      return false;
    }
    if (player.修为 < weizhi.experience) {
      e.reply('你需要积累' + weizhi.experience + '修为，才能抵抗禁地魔气！');
      return false;
    }
    let Price = weizhi.Price;
    await Add_灵石(usr_qq, -Price);
    await Add_修为(usr_qq, -weizhi.experience);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.forbiddenarea; //时间（分钟）
    let action_time = 60000 * time; //持续时间，单位毫秒
    let arr = {
      action: '禁地', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '0', //秘境状态---开启
      Place_actionplus: '1', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      //这里要保存秘境特别需要留存的信息
      Place_address: weizhi,
    };
    if (e.isGroup) {
      arr.group_id = e.group_id;
    }
    await redis.set('xiuxian:player:' + usr_qq + ':action', JSON.stringify(arr));
    e.reply('正在前往' + weizhi.name + ',' + time + '分钟后归来!');
    return false;
  }

  //探索仙府
  async GoTimeplace(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let flag = await Go(e);
    if (!flag) {
      return false;
    }
    let player = await Read_player(usr_qq);
    let didianlist = ['无欲天仙', '仙遗之地'];
    let suiji = Math.round(Math.random()); //随机一个地方
    let yunqi = Math.random(); //运气随机数
    await sleep(1000);
    e.reply('你在冲水堂发现有人上架了一份仙府地图');
    let didian = didianlist[suiji]; //赋值
    let now_level_id;
    if (!isNotNull(player.level_id)) {
      e.reply('请先#同步信息');
      return false;
    }
    await sleep(1000);
    if (yunqi > 0.9) {
      //10%寄
      if (player.灵石 < 50000) {
        e.reply('还没看两眼就被看堂的打手撵了出去说:“哪来的穷小子,不买别看”');
        return false;
      }
      e.reply(
        '价格为5w,你觉得特别特别便宜,赶紧全款拿下了,历经九九八十天,到了后发现居然是仙湖游乐场！'
      );
      await Add_灵石(usr_qq, -50000);
      return false;
    }
    now_level_id = data.Level_list.find(
      item => item.level_id == player.level_id
    ).level_id;
    if (now_level_id < 21) {
      e.reply('到了地图上的地点，结果你发现,你尚未达到化神,无法抵御灵气压制');
      return false;
    }
    let weizhi = await data.timeplace_list.find(item => item.name == didian);
    if (!isNotNull(weizhi)) {
      e.reply('报错！地点错误，请找群主反馈');
      return false;
    }
    if (player.灵石 < weizhi.Price) {
      e.reply('你发现标价是' + weizhi.Price + ',你买不起赶紧溜了');
      return false;
    }
    if (player.修为 < 100000) {
      e.reply(
        '到了地图上的地点，发现洞府前有一句前人留下的遗言:‘至少有10w修为才能抵御仙威！’'
      );
      return false;
    }
    let dazhe = 1;
    if (
      (await exist_najie_thing(usr_qq, '仙府通行证', '道具')) &&
      player.魔道值 < 1 &&
      (player.灵根.type == '转生' || player.level_id > 41)
    ) {
      dazhe = 0;
      e.reply(player.名号 + '使用了道具仙府通行证,本次仙府免费');
      await Add_najie_thing(usr_qq, '仙府通行证', '道具', -1);
    }
    let Price = weizhi.Price * dazhe;
    await Add_灵石(usr_qq, -Price);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.timeplace; //时间（分钟）
    let action_time = 60000 * time; //持续时间，单位毫秒
    let arr = {
      action: '探索', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '0', //秘境状态---开启
      Place_actionplus: '1', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      //这里要保存秘境特别需要留存的信息
      Place_address: weizhi,
    };
    if (e.isGroup) {
      arr.group_id = e.group_id;
    }
    await redis.set('xiuxian:player:' + usr_qq + ':action', JSON.stringify(arr));
    await Add_修为(usr_qq, -100000);
    if (suiji == 0) {
      e.reply(
        '你买下了那份地图,历经九九八十一天,终于到达了地图上的仙府,洞府上模糊得刻着[' +
          weizhi.name +
          '仙府]你兴奋地冲进去探索机缘,被强大的仙气压制，消耗了100000修为成功突破封锁闯了进去' +
          time +
          '分钟后归来!'
      );
    }
    if (suiji == 1) {
      e.reply(
        '你买下了那份地图,历经九九八十一天,终于到达了地图上的地点,这座洞府仿佛是上个末法时代某个仙人留下的遗迹,你兴奋地冲进去探索机缘,被强大的仙气压制，消耗了100000修为成功突破封锁闯了进去' +
          time +
          '分钟后归来!'
      );
    }
    return false;
  }

  //前往仙境
  async Gofairyrealm(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let flag = await Go(e);
    if (!flag) {
      return false;
    }
    let player = await Read_player(usr_qq);
    let didian = e.msg.replace('#镇守仙境', '');
    didian = didian.trim();
    let weizhi = await data.Fairyrealm_list.find(item => item.name == didian);
    if (!isNotNull(weizhi)) {
      return false;
    }
    if (player.灵石 < weizhi.Price) {
      e.reply('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~');
      return false;
    }
    let now_level_id;
    now_level_id = data.Level_list.find(
      item => item.level_id == player.level_id
    ).level_id;
    if (now_level_id < 42 && player.lunhui == 0) {
      return false;
    }
    let dazhe = 1;
    if (
      (await exist_najie_thing(usr_qq, '杀神崖通行证', '道具')) &&
      player.魔道值 < 1 &&
      (player.灵根.type == '转生' || player.level_id > 41) &&
      didian == '杀神崖'
    ) {
      dazhe = 0;
      e.reply(player.名号 + '使用了道具杀神崖通行证,本次仙境免费');
      await Add_najie_thing(usr_qq, '杀神崖通行证', '道具', -1);
    } else if (
      (await exist_najie_thing(usr_qq, '仙境优惠券', '道具')) &&
      player.魔道值 < 1 &&
      (player.灵根.type == '转生' || player.level_id > 41)
    ) {
      dazhe = 0.5;
      e.reply(player.名号 + '使用了道具仙境优惠券,本次消耗减少50%');
      await Add_najie_thing(usr_qq, '仙境优惠券', '道具', -1);
    }
    let Price = weizhi.Price * dazhe;
    await Add_灵石(usr_qq, -Price);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.secretplace; //时间（分钟）
    let action_time = 60000 * time; //持续时间，单位毫秒
    let arr = {
      action: '历练', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '0', //秘境状态---开启
      Place_actionplus: '1', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      //这里要保存秘境特别需要留存的信息
      Place_address: weizhi,
    };
    if (e.isGroup) {
      arr.group_id = e.group_id;
    }
    await redis.set('xiuxian:player:' + usr_qq + ':action', JSON.stringify(arr));
    e.reply('开始镇守' + didian + ',' + time + '分钟后归来!');
    return false;
  }

  async Giveup(e) {
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      e.reply('没存档你逃个锤子!');
      return false;
    }
    //获取游戏状态
    let game_action = await redis.get(
      'xiuxian:player:' + usr_qq + ':game_action'
    );
    //防止继续其他娱乐行为
    if (game_action == 0) {
      e.reply('修仙：游戏进行中...');
      return false;
    }
    //查询redis中的人物动作
    let action = await redis.get('xiuxian:player:' + usr_qq + ':action');
    action = JSON.parse(action);
    //不为空，有状态
    if (action != null) {
      //是在秘境状态
      if (
        action.Place_action == '0' ||
        action.Place_actionplus == '0' ||
        action.mojie == '0'
      ) {
        //把状态都关了
        let arr = action;
        arr.is_jiesuan = 1; //结算状态
        arr.shutup = 1; //闭关状态
        arr.working = 1; //降妖状态
        arr.power_up = 1; //渡劫状态
        arr.Place_action = 1; //秘境
        arr.Place_actionplus = 1; //沉迷状态
        arr.mojie = 1;
        arr.end_time = new Date().getTime(); //结束的时间也修改为当前时间
        delete arr.group_id; //结算完去除group_id
        await redis.set(
          'xiuxian:player:' + usr_qq + ':action',
          JSON.stringify(arr)
        );
        e.reply('你已逃离！');
        return false;
      }
    }
    return false;
  }
}
