//插件加载
import plugin from '../../../../lib/plugins/plugin.js';
import data from '../../model/XiuxianData.js';
import config from '../../model/Config.js';
import fs from 'fs';
import { segment } from 'oicq';
import {
  __PATH,
  Read_player,
  existplayer,
  exist_najie_thing,
  instead_equipment,
  player_efficiency,
  Read_najie,
  get_random_talent,
  Write_player,
  sleep,
  Add_血气,
  Add_灵石,
  Add_najie_thing,
  Add_HP,
  Add_修为,
  Add_魔道值,
  Read_danyao,
  Write_danyao,
  Go,
  Add_仙宠,
  Add_player_学习功法,
  Add_najie_灵石,
  isNotNull,
  Read_equipment,
  Write_equipment,
  foundthing,
  convert2integer,
  get_equipment_img,
} from '../../model/xiuxian.js';
import { AppName } from '../../app.config.js';
import { readall } from '../../model/duanzaofu.js';

/**
 * 全局变量
 */
/**
 * 货币与物品操作模块
 */
export class UserHome extends plugin {
  constructor() {
    super({
      name: 'UserHome',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#(存|取)灵石(.*)$',
          fnc: 'Take_lingshi',
        },
        {
          reg: '^#(装备|消耗|服用|学习)((.*)|(.*)*(.*))$',
          fnc: 'Player_use',
        },
        {
          reg: '^#购买((.*)|(.*)*(.*))$',
          fnc: 'Buy_comodities',
        },
        {
          reg: '^#出售.*$',
          fnc: 'Sell_comodities',
        },
        {
          reg: '^#哪里有(.*)$',
          fnc: 'find_thing',
        },
        {
          reg: '^#检查存档.*$',
          fnc: 'check_player',
        },
        {
          reg: '^#抽(天地卡池|灵界卡池|凡界卡池)$',
          fnc: 'sk',
        },
        {
          reg: '^#供奉奇怪的石头$',
          fnc: 'Add_lhd',
        },
        {
          reg: '^#活动兑换.*$',
          fnc: 'huodong',
        },
        {
          reg: '^#回收.*$',
          fnc: 'huishou',
        },
        {
          reg: '^#打磨.*$',
          fnc: 'refining',
        },
        {
          reg: '^#修仙世界$',
          fnc: 'world',
        },
        {
          reg: '^#修仙攻略$',
          fnc: 'gonglue',
        },
      ],
    });
    this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
  }
  async gonglue(e) {
    e.reply('修仙攻略\nhttps://docs.qq.com/doc/DTHhuVnRLWlhjclhC');
    return;
  }
  async world(e) {
    if (!e.isGroup) {
      return;
    }
    let playerList = [];
    let files = fs
      .readdirSync('./plugins/' + AppName + '/resources/data/xiuxian_player')
      .filter(file => file.endsWith('.json'));
    for (let file of files) {
      file = file.replace('.json', '');
      playerList.push(file);
    }
    let num = [0, 0, 0, 0];
    for (let player_id of playerList) {
      let usr_qq = player_id;
      let player = await data.getData('player', usr_qq);
      if (player.魔道值 > 999) num[3]++;
      else if ((player.lunhui > 0 || player.level_id > 41) && player.魔道值 < 1)
        num[0]++;
      else if (player.lunhui > 0 || player.level_id > 41) num[1]++;
      else num[2]++;
    }
    const n = num[0] + num[1] + num[2];
    let msg =
      '___[修仙世界]___' +
      '\n人数：' +
      n +
      '\n神人：' +
      num[0] +
      '\n仙人：' +
      num[1] +
      '\n凡人：' +
      num[2] +
      '\n魔头：' +
      num[3];
    e.reply(msg);
    return;
  }

  async refining(e) {
    if (!e.isGroup) {
      return;
    }
    //固定写法
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let thing_name = e.msg.replace('#', '');
    thing_name = thing_name.replace('打磨', '');
    let code = thing_name.split('*');
    thing_name = code[0];
    let thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
      e.reply(`你在瞎说啥呢?哪来的【${thing_name}】?`);
      return;
    }
    let pj = {
      劣: 0,
      普: 1,
      优: 2,
      精: 3,
      极: 4,
      绝: 5,
      顶: 6,
    };
    pj = pj[code[1]];
    if (
      pj > 5 ||
      (thing_exist.atk < 10 && thing_exist.def < 10 && thing_exist.HP < 10)
    ) {
      e.reply(`${thing_name}(${code[1]})不支持打磨`);
      return;
    }
    let najie = await Read_najie(usr_qq);
    let x = 0;
    for (let i of najie['装备']) {
      if (i.name == thing_name && i.pinji == pj) x++;
    }
    if (x < 3) {
      e.reply(`你只有${thing_name}(${code[1]})x${x}`);
      return;
    }
    //都通过了
    for (let i = 0; i < 3; i++)
      await Add_najie_thing(usr_qq, thing_name, '装备', -1, pj);
    await Add_najie_thing(usr_qq, thing_name, '装备', 1, pj + 1);
    e.reply('打磨成功获得' + thing_name);
    return;
  }

  async huishou(e) {
    if (!e.isGroup) {
      return;
    }
    //固定写法
    let usr_qq = e.user_id;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let thing_name = e.msg.replace('#回收', '');
    thing_name = thing_name.trim();
    let thing_exist = await foundthing(thing_name);
    if (thing_exist) {
      e.reply(`${thing_name}可以使用,不需要回收`);
      return;
    }
    let lingshi = 0;
    let najie = await Read_najie(usr_qq);
    let type = [
      '装备',
      '丹药',
      '道具',
      '功法',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮',
    ];
    for (let i of type) {
      let thing = najie[i].find(item => item.name == thing_name);
      if (thing) {
        if (thing.class == '材料' || thing.class == '草药') {
          lingshi += thing.出售价 * thing.数量;
        } else {
          lingshi += thing.出售价 * 2 * thing.数量;
        }
        await Add_najie_thing(
          usr_qq,
          thing.name,
          thing.class,
          -thing.数量,
          thing.pinji
        );
      }
    }
    await Add_灵石(usr_qq, lingshi);
    e.reply(`回收成功,获得${lingshi}灵石`);
    return;
  }
  async huodong(e) {
    if (!e.isGroup) {
      return;
    }
    //固定写法
    let usr_qq = e.user_id;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    var name = e.msg.replace('#活动兑换', '');
    name = name.trim();
    let i; //获取对应npc列表的位置
    for (i = 0; i < data.duihuan.length; i++) {
      if (data.duihuan[i].name == name) {
        break;
      }
    }
    if (i == data.duihuan.length) {
      e.reply('兑换码不存在!');
      return;
    }
    let action = await redis.get('xiuxian:player:' + usr_qq + ':duihuan'); //兑换码
    action = await JSON.parse(action);
    if (action == null) {
      action = [];
    }
    for (var k = 0; k < action.length; k++) {
      if (action[k] == name) {
        e.reply('你已经兑换过该兑换码了');
        return;
      }
    }
    action.push(name);
    await redis.set(
      'xiuxian:player:' + usr_qq + ':duihuan',
      JSON.stringify(action)
    );
    let msg = [];
    for (var k = 0; k < data.duihuan[i].thing.length; k++) {
      await Add_najie_thing(
        usr_qq,
        data.duihuan[i].thing[k].name,
        data.duihuan[i].thing[k].class,
        data.duihuan[i].thing[k].数量
      );
      msg.push(
        '\n' +
          data.duihuan[i].thing[k].name +
          'x' +
          data.duihuan[i].thing[k].数量
      );
    }
    e.reply('恭喜获得:' + msg);
    return;
  }
  async check_player(e) {
    if (!e.isMaster) {
      e.reply('只有主人可以执行操作');
      return;
    }
    let File = fs.readdirSync(__PATH.player_path);
    File = File.filter(file => file.endsWith('.json'));
    let File_length = File.length;
    let cundang = ['存档'];
    let najie = ['纳戒'];
    let equipment = ['装备'];
    for (var k = 0; k < File_length; k++) {
      let usr_qq = File[k].replace('.json', '');
      try {
        await Read_player(usr_qq);
      } catch {
        cundang.push('\n');
        cundang.push(usr_qq);
      }
      try {
        await Read_najie(usr_qq);
      } catch {
        najie.push('\n');
        najie.push(usr_qq);
      }
      try {
        await Read_equipment(usr_qq);
      } catch {
        equipment.push('\n');
        equipment.push(usr_qq);
      }
    }
    if (cundang.length > 1) {
      await e.reply(cundang);
    } else {
      cundang.push('正常');
      await e.reply(cundang);
    }
    if (najie.length > 1) {
      await e.reply(najie);
    } else {
      najie.push('正常');
      await e.reply(najie);
    }
    if (equipment.length > 1) {
      await e.reply(equipment);
    } else {
      equipment.push('正常');
      await e.reply(equipment);
    }
    return;
  }

  async Add_lhd(e) {
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
    let x = await exist_najie_thing(usr_qq, '长相奇怪的小石头', '道具');
    if (!x) {
      e.reply(
        '你翻遍了家里的院子，也没有找到什么看起来奇怪的石头\n于是坐下来冷静思考了一下。\n等等，是不是该去一趟精神病院？\n自己为什么突然会有供奉石头的怪念头？'
      );
      return;
    }
    let player = data.getData('player', usr_qq);
    if (player.轮回点 >= 10 && player.lunhui == 0) {
      e.reply('你梳洗完毕，将小石头摆在案上,点上香烛，拜上三拜！');
      await sleep(3000);
      player.当前血量 = 1;
      player.血气 -= 500000;
      e.reply(
        `奇怪的小石头灵光一闪，你感受到胸口一阵刺痛，喷出一口鲜血：\n` +
          `“不好，这玩意一定是个邪物！不能放在身上！\n是不是该把它卖了补贴家用？\n` +
          `或者放拍卖行骗几个自认为识货的人回本？”`
      );
      data.setData('player', usr_qq, player);
      return;
    }
    await Add_najie_thing(usr_qq, '长相奇怪的小石头', '道具', -1);
    e.reply('你梳洗完毕，将小石头摆在案上,点上香烛，拜上三拜！');
    await sleep(3000);
    player.当前血量 = Math.floor(player.当前血量 / 3);
    player.血气 = Math.floor(player.血气 / 3);
    e.reply(
      '小石头灵光一闪，化作一道精光融入你的体内。\n' +
        '你喷出一口瘀血，顿时感受到天地束缚弱了几分，可用轮回点+1'
    );
    await sleep(1000);
    player.轮回点++;
    data.setData('player', usr_qq, player);
    return;
  }

  async sk(e) {
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
    let tianluoRandom;
    let thing = e.msg.replace('#', '');
    thing = thing.replace('抽', '');
    if (thing == '天地卡池') {
      let x = await exist_najie_thing(usr_qq, '天罗地网', '道具');
      if (!x) {
        e.reply('你没有【天罗地网】');
        return;
      }
      await Add_najie_thing(usr_qq, '天罗地网', '道具', -1);
    } else if (thing == '灵界卡池') {
      let x = await exist_najie_thing(usr_qq, '金丝仙网', '道具');
      if (!x) {
        e.reply('你没有【金丝仙网】');
        return;
      }
      await Add_najie_thing(usr_qq, '金丝仙网', '道具', -1);
    } else if (thing == '凡界卡池') {
      let x = await exist_najie_thing(usr_qq, '银丝仙网', '道具');
      if (!x) {
        e.reply('你没有【银丝仙网】');
        return;
      }
      await Add_najie_thing(usr_qq, '银丝仙网', '道具', -1);
    }
    tianluoRandom = Math.floor(Math.random() * data.changzhuxianchon.length);
    tianluoRandom = (Math.ceil((tianluoRandom + 1) / 5) - 1) * 5;
    e.reply('一道金光从天而降');
    await sleep(5000);
    e.reply(
      '金光掉落在地上，走近一看是【' +
        data.changzhuxianchon[tianluoRandom].品级 +
        '】' +
        data.changzhuxianchon[tianluoRandom].name
    );
    await Add_仙宠(usr_qq, data.changzhuxianchon[tianluoRandom].name, 1);
    e.reply('恭喜获得' + data.changzhuxianchon[tianluoRandom].name);
    return;
  }

  async find_thing(e) {
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    var reg = new RegExp(/哪里有/);
    let msg = e.msg.replace(reg, '');
    msg = msg.replace('#', '');
    let thing_name = msg.replace('哪里有', '');
    let didian = [
      'guildSecrets_list',
      'forbiddenarea_list',
      'Fairyrealm_list',
      'timeplace_list',
      'didian_list',
      'shenjie',
      'mojie',
      'xingge',
      'shop_list',
    ];
    let found = [];
    let thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
      e.reply(`你在瞎说啥呢?哪来的【${thing_name}】?`);
      return;
    }
    let number = await exist_najie_thing(usr_qq, '寻物纸', '道具');
    if (!number) {
      e.reply('查找物品需要【寻物纸】');
      return;
    }
    for (var i of didian) {
      for (var j of data[i]) {
        let n = ['one', 'two', 'three'];
        for (var k of n) {
          if (j[k] && j[k].find(item => item.name == thing_name)) {
            found.push(j.name + '\n');
            break;
          }
        }
      }
    }
    found.push('消耗了一张寻物纸');
    if (found.length == 1) {
      e.reply('天地没有回应......');
    } else {
      await e.reply(found);
    }
    await Add_najie_thing(usr_qq, '寻物纸', '道具', -1);
    return;
  }

  //存取灵石
  async Take_lingshi(e) {
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let flag = await Go(e);
    if (!flag) {
      return;
    }
    //检索方法
    var reg = new RegExp(/取|存/);
    let func = reg.exec(e.msg);
    let msg = e.msg.replace(reg, '');
    msg = msg.replace('#', '');
    let lingshi = msg.replace('灵石', '');
    if (func == '存' && lingshi == '全部') {
      let P = await Read_player(usr_qq);
      lingshi = P.灵石;
    }
    if (func == '取' && lingshi == '全部') {
      let N = await Read_najie(usr_qq);
      lingshi = N.灵石;
    }
    lingshi = await convert2integer(lingshi);
    if (func == '存') {
      let player_lingshi = await Read_player(usr_qq);
      player_lingshi = player_lingshi.灵石;
      if (player_lingshi < lingshi) {
        e.reply([
          segment.at(usr_qq),
          `灵石不足,你目前只有${player_lingshi}灵石`,
        ]);
        return;
      }
      let najie = await Read_najie(usr_qq);
      if (najie.灵石上限 < najie.灵石 + lingshi) {
        await Add_najie_灵石(usr_qq, najie.灵石上限 - najie.灵石);
        await Add_灵石(usr_qq, -najie.灵石上限 + najie.灵石);
        e.reply([
          segment.at(usr_qq),
          `已为您放入${najie.灵石上限 - najie.灵石}灵石,纳戒存满了`,
        ]);
        return;
      }
      await Add_najie_灵石(usr_qq, lingshi);
      await Add_灵石(usr_qq, -lingshi);
      e.reply([
        segment.at(usr_qq),
        `储存完毕,你目前还有${player_lingshi - lingshi}灵石,纳戒内有${
          najie.灵石 + lingshi
        }灵石`,
      ]);
      return;
    }
    if (func == '取') {
      let najie = await Read_najie(usr_qq);
      if (najie.灵石 < lingshi) {
        e.reply([
          segment.at(usr_qq),
          `纳戒灵石不足,你目前最多取出${najie.灵石}灵石`,
        ]);
        return;
      }
      let player_lingshi = await Read_player(usr_qq);
      player_lingshi = player_lingshi.灵石;
      await Add_najie_灵石(usr_qq, -lingshi);
      await Add_灵石(usr_qq, lingshi);
      e.reply([
        segment.at(usr_qq),
        `本次取出灵石${lingshi},你的纳戒还剩余${najie.灵石 - lingshi}灵石`,
      ]);
      return;
    }
    return;
  }

  //#(装备|服用|消耗)物品*数量
  async Player_use(e) {
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let player = await Read_player(usr_qq);
    let najie = await Read_najie(usr_qq);
    //检索方法
    var reg = new RegExp(/装备|服用|消耗|学习/);
    let func = reg.exec(e.msg);
    let msg = e.msg.replace(reg, '');
    msg = msg.replace('#', '');
    let code = msg.split('*');
    let thing_name = code[0];
    code[0] = parseInt(code[0]);
    let quantity = code[1];
    quantity = await convert2integer(quantity);
    //装备优化
    if (func == '装备' && code[0] && code[0] > 100) {
      try {
        thing_name = najie.装备[code[0] - 101].name;
      } catch {
        e.reply('装备代号输入有误!');
        return;
      }
    }
    //看看物品名称有没有设定,是不是瞎说的
    let thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
      e.reply(`你在瞎说啥呢?哪来的【${thing_name}】?`);
      return;
    }
    let pj = {
      劣: 0,
      普: 1,
      优: 2,
      精: 3,
      极: 4,
      绝: 5,
      顶: 6,
    };
    pj = pj[code[1]];
    let x = await exist_najie_thing(usr_qq, thing_name, thing_exist.class, pj);
    if (!x) {
      e.reply(`你没有【${thing_name}】这样的【${thing_exist.class}】`);
      return;
    }
    if (x < quantity) {
      e.reply(`你只有${thing_name}x${x}`);
      return;
    }
    if (func == '装备') {
      let equ;
      if (!pj) {
        equ = najie.装备.find(item => item.name == thing_name);
        for (var i of najie.装备) {
          //遍历列表有没有比那把强的
          if (i.name == thing_name && i.pinji > equ.pinji) {
            equ = i;
          }
        }
      } else {
        equ = najie.装备.find(
          item => item.name == thing_name && item.pinji == pj
        );
      }
      await instead_equipment(usr_qq, equ);
      let img = await get_equipment_img(e);
      e.reply(img);
      return;
    }
    if (func == '服用') {
      let dy = await Read_danyao(usr_qq);
      if (thing_exist.class != '丹药') return;
      if (thing_exist.type == '血量') {
        let player = await Read_player(usr_qq);
        if (!isNotNull(thing_exist.HPp)) {
          thing_exist.HPp = 1;
        }
        let blood = parseInt(
          player.血量上限 * thing_exist.HPp + thing_exist.HP
        );
        await Add_HP(usr_qq, quantity * blood);
        let now_HP = await Read_player(usr_qq);
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        e.reply(`服用成功,当前血量为:${now_HP.当前血量} `);
        return;
      }
      if (thing_exist.type == '修为') {
        await Add_修为(usr_qq, quantity * thing_exist.exp);
        e.reply(`服用成功,修为增加${quantity * thing_exist.exp}`);
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        return;
      }
      if (thing_exist.type == '血气') {
        await Add_血气(usr_qq, quantity * thing_exist.xueqi);
        e.reply(`服用成功,血气增加${quantity * thing_exist.xueqi}`);
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        return;
      }
      if (thing_exist.type == '幸运') {
        if (player.islucky > 0) {
          e.reply('目前尚有福源丹在发挥效果，身体无法承受更多福源');
          return;
        }
        player.islucky = 10 * quantity;
        player.addluckyNo = thing_exist.xingyun;
        player.幸运 += thing_exist.xingyun;
        data.setData('player', usr_qq, player);
        e.reply(
          `${thing_name}服用成功，将在之后的 ${
            quantity * 10
          }次冒险旅途中为你提高幸运值！`
        );
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        return;
      }
      if (thing_exist.type == '闭关') {
        dy.biguan = quantity;
        dy.biguanxl = thing_exist.biguan;
        e.reply(
          `${thing_name}提高了你的忍耐力,提高了下次闭关的效率,当前提高${
            dy.biguanxl * 100
          }%\n查看练气信息后生效`
        );
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        await Write_danyao(usr_qq, dy);
        return;
      }
      if (thing_exist.type == '仙缘') {
        dy.ped = 5 * quantity;
        dy.beiyong1 = thing_exist.gailv;
        e.reply(
          `${thing_name}赐予${player.名号}仙缘,${player.名号}得到了仙兽的祝福`
        );
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        await Write_danyao(usr_qq, dy);
        return;
      }
      if (thing_exist.type == '凝仙') {
        if (dy.biguan > 0) {
          dy.biguan += thing_exist.机缘 * quantity;
        }
        if (dy.lianti > 0) {
          dy.lianti += thing_exist.机缘 * quantity;
        }
        if (dy.ped > 0) {
          dy.ped += thing_exist.机缘 * quantity;
        }
        if (dy.beiyong2 > 0) {
          dy.beiyong2 += thing_exist.机缘 * quantity;
        }
        e.reply(
          `丹韵入体,身体内蕴含的仙丹药效增加了${thing_exist.机缘 * quantity}次`
        );
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        await Write_danyao(usr_qq, dy);
        return;
      }
      if (thing_exist.type == '炼神') {
        dy.lianti = quantity;
        dy.beiyong4 = thing_exist.lianshen;
        e.reply(
          `服用了${thing_name},获得了炼神之力,下次闭关获得了炼神之力,当前炼神之力为${
            thing_exist.lianshen * 100
          }%`
        );
        await Write_danyao(usr_qq, dy);
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        return;
      }
      if (thing_exist.type == '神赐') {
        dy.beiyong2 = quantity;
        dy.beiyong3 = thing_exist.概率;
        e.reply(
          `${player.名号}获得了神兽的恩赐,赐福的概率增加了,当前剩余次数${dy.beiyong2}`
        );
        await Write_danyao(usr_qq, dy);
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        return;
      }
      if (thing_exist.type == '灵根') {
        const a = await readall('隐藏灵根');
        const newa = Math.floor(Math.random() * a.length);
        player.隐藏灵根 = a[newa];
        await Write_player(usr_qq, player);
        e.reply(
          `神药入体,${player.名号}更改了自己的隐藏灵根,当前隐藏灵根为[${player.隐藏灵根.name}]`
        );
        await Add_najie_thing(usr_qq, thing_name, '丹药', -1);
        return;
      }
      if (thing_exist.type == '器灵') {
        if (!player.锻造天赋) {
          e.reply(`请先去#炼器师能力评测,再来更改天赋吧`);
          return;
        }
        player.锻造天赋 = player.锻造天赋 + thing_exist.天赋 * quantity;
        e.reply(
          `服用成功,您额外获得了${
            thing_exist.天赋 * quantity
          }天赋上限,您当前炼器天赋为${player.锻造天赋}`
        );
        await Write_player(usr_qq, player);
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        return;
      }
      if (thing_exist.type == '锻造上限') {
        if (dy.beiyong5 > 0) {
          e.reply(`您已经增加了锻造上限,消耗完毕再接着服用吧`);
          return;
        }
        dy.xingyun = quantity;
        dy.beiyong5 = thing_exist.额外数量;
        e.reply(
          `服用成功,您下一次的炼器获得了额外的炼器格子[${thing_exist.额外数量}]`
        );
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        await Write_danyao(usr_qq, dy);
        return;
      }
      if (thing_exist.type == '魔道值') {
        await Add_魔道值(usr_qq, -quantity * thing_exist.modao);
        e.reply(`获得了转生之力,降低了${quantity * thing_exist.modao}魔道值`);
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        return;
      }
      if (thing_exist.type == '入魔') {
        await Add_魔道值(usr_qq, quantity * thing_exist.modao);
        e.reply(
          `${quantity}道黑色魔气入体,增加了${
            quantity * thing_exist.modao
          }魔道值`
        );
        await Add_najie_thing(usr_qq, thing_name, '丹药', -quantity);
        return;
      }
      if (thing_exist.type == '补根') {
        player.灵根 = {
          id: 70001,
          name: '垃圾五灵根',
          type: '伪灵根',
          eff: 0.01,
          法球倍率: 0.01,
        };
        data.setData('player', usr_qq, player);
        e.reply(`服用成功,当前灵根为垃圾五灵根,你具备了称帝资格`);
        await Add_najie_thing(usr_qq, thing_name, '丹药', -1);
        return;
      }
      if (thing_exist.type == '补天') {
        player.灵根 = {
          id: 70054,
          name: '天五灵根',
          type: '圣体',
          eff: 0.2,
          法球倍率: 0.12,
        };
        data.setData('player', usr_qq, player);
        e.reply(`服用成功,当前灵根为天五灵根,你具备了称帝资格`);
        await Add_najie_thing(usr_qq, thing_name, '丹药', -1);
        return;
      }
      if (thing_exist.type == '突破') {
        if (player.breakthrough == true) {
          e.reply(`你已经吃过破境丹了`);
          return;
        } else {
          player.breakthrough = true;
          data.setData('player', usr_qq, player);
          e.reply(`服用成功,下次突破概率增加20%`);
          await Add_najie_thing(usr_qq, thing_name, '丹药', -1);
          return;
        }
      }
    }
    if (func == '消耗') {
      if (thing_name == '轮回阵旗') {
        player.lunhuiBH = 1;
        data.setData('player', usr_qq, player);
        e.reply(['已得到"轮回阵旗"的辅助，下次轮回可抵御轮回之苦的十之八九']);
        await Add_najie_thing(usr_qq, '轮回阵旗', '道具', -1);
        return;
      }
      if (thing_name == '仙梦之匙') {
        if (player.仙宠 == []) {
          e.reply('你还没有出战仙宠');
          return;
        }
        player.仙宠.灵魂绑定 = 0;
        data.setData('player', usr_qq, player);
        await Add_najie_thing(usr_qq, '仙梦之匙', '道具', -1);
        e.reply('出战仙宠解绑成功!');
        return;
      }
      if (thing_name == '残卷') {
        let number = await exist_najie_thing(usr_qq, '残卷', '道具');
        if (isNotNull(number) && number > 9) {
          /** 设置上下文 */
          this.setContext('DUIHUAN');
          /** 回复 */
          await e.reply(
            '是否消耗十个卷轴兑换一个八品功法？回复:【兑换*功法名】或者【还是算了】进行选择',
            false,
            { at: true }
          );
          return;
        } else {
          e.reply('你没有足够的残卷');
          return;
        }
      }
      if (thing_name == '重铸石') {
        let equipment = await Read_equipment(usr_qq);
        let type = ['武器', '护具', '法宝'];
        let z = [0.8, 1, 1.1, 1.2, 1.3, 1.5];
        for (var j in type) {
          let random = Math.trunc(Math.random() * 6);
          if (!z[equipment[type[j]].pinji]) continue;
          equipment[type[j]].atk =
            (equipment[type[j]].atk / z[equipment[type[j]].pinji]) * z[random];
          equipment[type[j]].def =
            (equipment[type[j]].def / z[equipment[type[j]].pinji]) * z[random];
          equipment[type[j]].HP =
            (equipment[type[j]].HP / z[equipment[type[j]].pinji]) * z[random];
          equipment[type[j]].pinji = random;
        }
        await Write_equipment(usr_qq, equipment);
        await Add_najie_thing(usr_qq, '重铸石', '道具', -1);
        e.reply('使用成功,发送#我的装备查看属性');
        return;
      }
      if (thing_exist.type == '洗髓') {
        if ((await player.linggenshow) != 0) {
          await e.reply('你未开灵根，无法洗髓！');
          return;
        }
        await Add_najie_thing(usr_qq, thing_name, '道具', -1);
        player.灵根 = await get_random_talent();
        data.setData('player', usr_qq, player);
        await player_efficiency(usr_qq);
        e.reply([
          segment.at(usr_qq),
          `  服用成功,剩余 ${thing_name}数量: ${x - 1}，新的灵根为 "${
            player.灵根.type
          }"：${player.灵根.name}`,
          '\n可以在【#我的练气】中查看',
        ]);
        return;
      }
      if (thing_name == '隐身水' || thing_name == '幸运草') {
        e.reply(`该道具无法在纳戒中消耗`);
        return;
      }
      if (thing_name == '定灵珠') {
        await Add_najie_thing(usr_qq, thing_name, '道具', -1);
        player.linggenshow = 0;
        await Write_player(usr_qq, player);
        e.reply(
          `你眼前一亮，看到了自己的灵根,` +
            `"${player.灵根.type}"：${player.灵根.name}`
        );
        return;
      }
      let qh = data.qianghua.find(item => item.name == thing_exist.name);
      if (qh) {
        if (qh.class == '魔头' && player.魔道值 < 1000) {
          e.reply(`你还是提升点魔道值再用吧!`);
          return;
        } else if (
          qh.class == '神人' &&
          (player.魔道值 > 0 ||
            (player.灵根.type != '转生' && player.level_id < 42))
        ) {
          e.reply(`你尝试使用它,但是失败了`);
          return;
        }
        player.攻击加成 += qh.攻击 * quantity;
        player.防御加成 += qh.防御 * quantity;
        player.生命加成 += qh.血量 * quantity;
        await Write_player(usr_qq, player);
        let equipment = await Read_equipment(usr_qq);
        await Write_equipment(usr_qq, equipment);
        await Add_najie_thing(usr_qq, thing_name, '道具', -quantity);
        e.reply(`${qh.msg}`);
        return;
      }
      e.reply(`功能开发中,敬请期待`);
      return;
    }
    if (func == '学习') {
      let player = await Read_player(usr_qq);
      let islearned = player.学习的功法.find(item => item == thing_name);
      if (islearned) {
        e.reply(`你已经学过该功法了`);
        return;
      }
      await Add_najie_thing(usr_qq, thing_name, '功法', -1);
      //
      await Add_player_学习功法(usr_qq, thing_name);
      e.reply(`你学会了${thing_name},可以在【#我的炼体】中查看`);
    }
  }

  //兑换方法
  async DUIHUAN(e) {
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    /** 内容 */
    let new_msg = this.e.message;
    let choice = new_msg[0].text;
    let code = choice.split('*');
    let les = code[0]; //条件
    let gonfa = code[1]; //功法
    if (les == '还是算了') {
      await this.reply('取消兑换');
      /** 结束上下文 */
      this.finish('DUIHUAN');
      return;
    } else if (les == '兑换') {
      let ifexist2 = data.bapin.find(item => item.name == gonfa);
      if (ifexist2) {
        await Add_najie_thing(usr_qq, '残卷', '道具', -10);
        await Add_najie_thing(usr_qq, gonfa, '功法', 1);
        await this.reply('兑换' + gonfa + '成功');
        this.finish('DUIHUAN');
        return;
      } else {
        await this.reply('残卷无法兑换该功法');
        this.finish('DUIHUAN');
        return;
      }
    }
  }

  //购买商品
  async Buy_comodities(e) {
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let flag = await Go(e);
    if (!flag) {
      return;
    }
    let thing = e.msg.replace('#', '');
    thing = thing.replace('购买', '');
    let code = thing.split('*');
    let thing_name = code[0];
    let ifexist = data.commodities_list.find(item => item.name == thing_name);
    if (!ifexist) {
      e.reply(`柠檬堂还没有这样的东西:${thing_name}`);
      return;
    }
    let quantity = await convert2integer(code[1]);
    let player = await Read_player(usr_qq);
    let lingshi = player.灵石;
    //如果没钱，或者为负数
    if (lingshi <= 0) {
      e.reply(`掌柜：就你这穷酸样，也想来柠檬堂？走走走！`);
      return;
    }
    // 价格倍率
    //价格
    let commodities_price = ifexist.出售价 * 1.2 * quantity;
    commodities_price = Math.trunc(commodities_price);
    //判断金额
    if (lingshi < commodities_price) {
      e.reply(
        `口袋里的灵石不足以支付${thing_name},还需要${
          commodities_price - lingshi
        }灵石`
      );
      return;
    }
    //符合就往戒指加
    await Add_najie_thing(usr_qq, thing_name, ifexist.class, quantity);
    await Add_灵石(usr_qq, -commodities_price);
    //发送消息
    e.reply([
      `购买成功!  获得[${thing_name}]*${quantity},花[${commodities_price}]灵石,剩余[${
        lingshi - commodities_price
      }]灵石  `,
      '\n可以在【我的纳戒】中查看',
    ]);
    return;
  }

  //出售商品
  async Sell_comodities(e) {
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    //命令判断
    let thing = e.msg.replace('#', '');
    thing = thing.replace('出售', '');
    let code = thing.split('*');
    let thing_name = code[0]; //物品
    code[0] = parseInt(code[0]);
    let thing_amount = code[1]; //数量
    let thing_piji;
    //判断列表中是否存在，不存在不能卖,并定位是什么物品
    let najie = await Read_najie(usr_qq);
    if (code[0]) {
      if (code[0] > 1000) {
        try {
          thing_name = najie.仙宠[code[0] - 1001].name;
        } catch {
          e.reply('仙宠代号输入有误!');
          return;
        }
      } else if (code[0] > 100) {
        try {
          thing_name = najie.装备[code[0] - 101].name;
        } catch {
          e.reply('装备代号输入有误!');
          return;
        }
      }
    }
    let thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
      e.reply(`这方世界没有[${thing_name}]`);
      return;
    }
    let pj = {
      劣: 0,
      普: 1,
      优: 2,
      精: 3,
      极: 4,
      绝: 5,
      顶: 6,
    };
    thing_piji = pj[code[1]];
    if (thing_exist.class == '装备') {
      if (thing_piji) {
        thing_amount = code[2];
      } else {
        let equ = najie.装备.find(item => item.name == thing_name);
        if (!equ) {
          e.reply(`你没有[${thing_name}]这样的${thing_exist.class}`);
          return;
        }
        for (var i of najie.装备) {
          //遍历列表有没有比那把强的
          if (i.name == thing_name && i.pinji < equ.pinji) {
            equ = i;
          }
        }
        thing_piji = equ.pinji;
      }
    }
    thing_amount = await convert2integer(thing_amount);
    let x = await exist_najie_thing(
      usr_qq,
      thing_name,
      thing_exist.class,
      thing_piji
    );
    //判断戒指中是否存在
    if (!x) {
      //没有
      e.reply(`你没有[${thing_name}]这样的${thing_exist.class}`);
      return;
    }
    //判断戒指中的数量
    if (x < thing_amount) {
      //不够
      e.reply(`你目前只有[${thing_name}]*${x}`);
      return;
    }
    //数量够,数量减少,灵石增加
    await Add_najie_thing(
      usr_qq,
      thing_name,
      thing_exist.class,
      -thing_amount,
      thing_piji
    );
    let commodities_price;
    commodities_price = thing_exist.出售价 * thing_amount;
    if (
      data.zalei.find(item => item.name == thing_name.replace(/[0-9]+/g, ''))
    ) {
      let sell = najie.装备.find(
        item => item.name == thing_name && thing_piji == item.pinji
      );
      commodities_price = sell.出售价 * thing_amount;
    }
    await Add_灵石(usr_qq, commodities_price);
    e.reply(
      `出售成功!  获得${commodities_price}灵石,还剩余${thing_name}*${
        x - thing_amount
      } `
    );
    return;
  }
}
