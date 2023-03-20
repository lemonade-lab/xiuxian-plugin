import plugin from '../../../../lib/plugins/plugin.js';
import common from '../../../../lib/common/common.js';
import config from '../../model/Config.js';
import data from '../../model/XiuxianData.js';
import fs from 'node:fs';
import { segment } from 'oicq';
import {
  Add_najie_thing, Add_修为, Add_血气, Add_HP, exist_najie_thing, Write_player,
  Read_player, isNotNull, Read_danyao, Write_danyao, Read_temp, Write_temp
} from '../Xiuxian/xiuxian.js';
import { zd_battle } from "../Battle/Battle.js"
import { AppName } from '../../app.config.js'

/**
 * 定时任务
 */
export class SecretPlaceplusTask extends plugin {
  constructor() {
    super({
      name: 'SecretPlaceplusTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: [],
    });
    this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
    this.set = config.getdefSet('task', 'task');
    this.task = {
      cron: this.set.actionplus_task,
      name: 'SecretPlaceplusTask',
      fnc: () => this.Secretplaceplustask(),
    };
  }

  async Secretplaceplustask() {
    //获取缓存中人物列表
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
      let log_mag = ''; //查询当前人物动作日志信息
      log_mag = log_mag + '查询' + player_id + '是否有动作,';
      //得到动作
      let action = await redis.get('xiuxian:player:' + player_id + ':action');
      action = await JSON.parse(action);
      //不为空，存在动作
      if (action != null) {
        let push_address; //消息推送地址
        let is_group = false; //是否推送到群
        if (await action.hasOwnProperty('group_id')) {
          if (isNotNull(action.group_id)) {
            is_group = true;
            push_address = action.group_id;
          }
        }
        //最后发送的消息
        let msg = [segment.at(Number(player_id))];
        //动作结束时间
        let end_time = action.end_time;
        //现在的时间
        let now_time = new Date().getTime();
        //用户信息
        let player = await Read_player(player_id);
        //有秘境状态:这个直接结算即可
        if (action.Place_actionplus == '0') {
          //这里改一改,要在结束时间的前两分钟提前结算
          end_time = end_time - action.time;
          //时间过了
          if (now_time > end_time) {
            let weizhi = action.Place_address;
            if (player.当前血量 < 0.3 * player.血量上限) {
              if (await exist_najie_thing(player_id, '起死回生丹', '丹药')) {
                player.当前血量 = player.血量上限;
                await Add_najie_thing(player_id, '起死回生丹', '丹药', -1);
                await Write_player(player_id, player);
              }
            }
            let A_player = {
              名号: player.名号,
              攻击: player.攻击,
              防御: player.防御,
              当前血量: player.当前血量,
              暴击率: player.暴击率,
              法球倍率: player.灵根.法球倍率
            };
            let monster_length = data.monster_list.length;
            let monster_index = Math.trunc(Math.random() * monster_length);
            let monster = data.monster_list[monster_index];
            let B_player = {
              名号: monster.名号,
              攻击: parseInt(monster.攻击 * player.攻击),
              防御: parseInt(monster.防御 * player.防御),
              当前血量: parseInt(monster.当前血量 * player.血量上限),
              暴击率: monster.暴击率,
              法球倍率: 0.1,
            };
            let Data_battle = await zd_battle(A_player, B_player);
            let msgg = Data_battle.msg;
            let A_win = `${A_player.名号}击败了${B_player.名号}`;
            let B_win = `${B_player.名号}击败了${A_player.名号}`;
            var thing_name;
            var thing_class;
            var x = this.xiuxianConfigData.SecretPlace.one;
            let random1 = Math.random();
            var y = this.xiuxianConfigData.SecretPlace.two;
            let random2 = Math.random();
            var z = this.xiuxianConfigData.SecretPlace.three;
            let random3 = Math.random();
            let random4;
            var m = '';
            let fyd_msg = '';
            //查找秘境
            let t1;
            let t2;
            let r = 0;
            for (let i = 0; i < 5; i++) {
              if (Math.random() < 1 / 2) {
                r++;
              } else {
                break;
              }
            }

            var n = 1;
            let last_msg = '';
            if (random1 <= x) {
              if (random2 <= y) {
                //random2=0到1随机数,y=0.6
                if (random3 <= z) {
                  random4 = Math.floor(Math.random() * weizhi.three.length);
                  thing_name = weizhi.three[random4].name;
                  thing_class = weizhi.three[random4].class;
                  m = `抬头一看，金光一闪！有什么东西从天而降，定睛一看，原来是：[${thing_name}`;
                  t1 = 2 + Math.random();
                  t2 = 2 + Math.random();
                } else {
                  random4 = Math.floor(Math.random() * weizhi.two.length);
                  thing_name = weizhi.two[random4].name;
                  thing_class = weizhi.two[random4].class;
                  m = `在洞穴中拿到[${thing_name}`;
                  t1 = 1 + Math.random();
                  t2 = 1 + Math.random();
                  if (weizhi.name == '太极之阳' || weizhi.name == '太极之阴') {
                    n = 5;
                    m = '捡到了[' + thing_name;
                  }
                }
              } else {
                random4 = Math.floor(Math.random() * weizhi.one.length);
                thing_name = weizhi.one[random4].name;
                thing_class = weizhi.one[random4].class;
                m = `捡到了[${thing_name}`;
                t1 = 0.5 + Math.random() * 0.5;
                t2 = 0.5 + Math.random() * 0.5;
                if (weizhi.name == '诸神黄昏·旧神界') {
                  n = 100;
                  if (thing_name == "洗根水")
                    n = 130;
                  m = '捡到了[' + thing_name;
                }
                if (weizhi.name == '太极之阳' || weizhi.name == '太极之阴') {
                  n = 5;
                  m = '捡到了[' + thing_name;
                }
              }
            } else {
              m = '走在路上看见了一只蚂蚁！蚂蚁大仙送了你[起死回生丹';
              await Add_najie_thing(player_id, '起死回生丹', '丹药', 1);
              t1 = 0.5 + Math.random() * 0.5;
              t2 = 0.5 + Math.random() * 0.5;
            }
            if (weizhi.name != '诸神黄昏·旧神界') {
              //判断是不是旧神界
              let random = Math.random();
              if (random < player.幸运) {
                if (random < player.addluckyNo) {
                  last_msg += '福源丹生效，所以在';
                } else if (player.仙宠.type == '幸运') {
                  last_msg += '仙宠使你在探索中欧气满满，所以在';
                }
                n *= 2;
                last_msg +=
                  '探索过程中意外发现了两份机缘,最终获取机缘数量将翻倍\n';
              }
              if (player.islucky > 0) {
                player.islucky--;
                if (player.islucky != 0) {
                  fyd_msg = `  \n福源丹的效力将在${player.islucky}次探索后失效\n`;
                } else {
                  fyd_msg = `  \n本次探索后，福源丹已失效\n`;
                  player.幸运 -= player.addluckyNo;
                  player.addluckyNo = 0;
                }
                data.setData('player', player_id, player);
              }
            }
            m += `]×${n}个。`;
            let xiuwei = 0;
            //默认结算装备数
            let now_level_id;
            let now_physique_id;
            now_level_id = player.level_id;
            now_physique_id = player.Physique_id;
            //结算
            let qixue = 0;
            if (msgg.find(item => item == A_win)) {
              xiuwei = Math.trunc(
                2000 + (100 * now_level_id * now_level_id * t1 * 0.1) / 5
              );
              qixue = Math.trunc(
                2000 + 100 * now_physique_id * now_physique_id * t2 * 0.1
              );
              if (thing_name) {
                await Add_najie_thing(player_id, thing_name, thing_class, n);
              }
              last_msg += `${m}不巧撞见[${B_player.名号}],经过一番战斗,击败对手,获得修为${xiuwei},气血${qixue},剩余血量${(A_player.当前血量 + Data_battle.A_xue)},剩余次数${action.cishu - 1}`;
              let random = Math.random(); //万分之一出神迹
              let newrandom = 0.995;
              let dy = await Read_danyao(player_id);
              newrandom -= dy.beiyong1;
              if (dy.ped > 0) {
                dy.ped--;
              } else {
                dy.beiyong1 = 0;
                dy.ped = 0;
              }
              await Write_danyao(player_id, dy);
              if (random > newrandom) {
                let length = data.xianchonkouliang.length;
                let index = Math.trunc(Math.random() * length);
                let kouliang = data.xianchonkouliang[index];
                last_msg +=
                  '\n七彩流光的神奇仙谷[' +
                  kouliang.name +
                  ']深埋在土壤中，是仙兽们的最爱。';
                await Add_najie_thing(player_id, kouliang.name, '仙宠口粮', 1);
              }
              if (random > 0.1 && random < 0.1002) {
                last_msg +=
                  '\n' +
                  B_player.名号 +
                  '倒下后,你正准备离开此地，看见路边草丛里有个长相奇怪的石头，顺手放进了纳戒。';
                await Add_najie_thing(player_id, '长相奇怪的小石头', '道具', 1);
              }
            } else if (msgg.find(item => item == B_win)) {
              xiuwei = 800;
              last_msg =
                '不巧撞见[' +
                B_player.名号 +
                '],经过一番战斗,败下阵来,还好跑得快,只获得了修为' +
                xiuwei +
                ',剩余血量' +
                A_player.当前血量;
            }
            msg.push('\n' + player.名号 + last_msg + fyd_msg);
            let arr = action;
            if (arr.cishu == 1) {
              //把状态都关了
              arr.shutup = 1; //闭关状态
              arr.working = 1; //降妖状态
              arr.power_up = 1; //渡劫状态
              arr.Place_action = 1; //秘境
              arr.Place_actionplus = 1; //沉迷状态
              //结束的时间也修改为当前时间
              arr.end_time = new Date().getTime();
              //结算完去除group_id
              delete arr.group_id;
              //写入redis
              await redis.set(
                'xiuxian:player:' + player_id + ':action',
                JSON.stringify(arr)
              );
              //先完结再结算
              await Add_血气(player_id, qixue);
              await Add_修为(player_id, xiuwei);
              await Add_HP(player_id, Data_battle.A_xue);
              //发送消息
              if (is_group) {
                await this.pushInfo(push_address, is_group, msg);
              } else {
                await this.pushInfo(player_id, is_group, msg);
              }
            } else {
              arr.cishu--;
              await redis.set(
                'xiuxian:player:' + player_id + ':action',
                JSON.stringify(arr)
              );
              //先完结再结算
              await Add_血气(player_id, qixue);
              await Add_修为(player_id, xiuwei);
              await Add_HP(player_id, Data_battle.A_xue);
              //发送消息
              try {
                let temp = await Read_temp();
                let p = {
                  msg: player.名号 + last_msg + fyd_msg,
                  qq_group: push_address
                }
                temp.push(p);
                await Write_temp(temp);
              }
              catch
              {
                await Write_temp([]);
                let temp = await Read_temp();
                let p = {
                  msg: player.名号 + last_msg + fyd_msg,
                  qq: player_id,
                  qq_group: push_address
                }
                temp.push(p);
                await Write_temp(temp);
              }
            }
          }
        }
      }
    }
  }

  /**
   * 推送消息，群消息推送群，或者推送私人
   * @param id
   * @param is_group
   * @returns {Promise<void>}
   */
  async pushInfo(id, is_group, msg) {
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
}
