import { plugin, common, segment, data, config } from '../../api/api.js';
import fs from 'fs';
import { isNotNull } from '../../model/xiuxian.js';
import { Add_najie_thing, Add_职业经验 } from '../../model/xiuxian.js';
import { AppName } from '../../app.config.js';
export class OccupationTask extends plugin {
  constructor() {
    super({
      name: 'OccupationTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: [],
    });
    this.set = config.getConfig('task', 'task');
    this.task = {
      cron: this.set.action_task,
      name: 'OccupationTask',
      fnc: () => this.OccupationTask(),
    };
  }

  async OccupationTask() {
    let playerList = [];
    let files = fs
      .readdirSync('./plugins/' + AppName + '/resources/data/xiuxian_player')
      .filter(file => file.endsWith('.json'));
    for (let file of files) {
      file = file.replace('.json', '');
      playerList.push(file);
    }
    for (let player_id of playerList) {
      let log_mag = ''; //查询当前人物动作日志信息
      log_mag = log_mag + '查询' + player_id + '是否有动作,';
      //得到动作
      let action = await redis.get('xiuxian:' + player_id + ':action');
      action = JSON.parse(action);
      //不为空，存在动作
      if (action != null) {
        let push_address; //消息推送地址
        let is_group = false; //是否推送到群
        if (action.hasOwnProperty('group_id')) {
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
        //闭关状态
        if (action.plant == '0') {
          //这里改一改,要在结束时间的前一分钟提前结算
          //时间过了
          end_time = end_time - 60000 * 2;
          if (now_time > end_time) {
            log_mag += '当前人物未结算，结算状态';
            let player = data.getData('player', player_id);
            let time = parseInt(action.time) / 1000 / 60;
            let exp = time * 10;
            await Add_职业经验(player_id, exp);
            let k = 1;
            if (player.level_id < 22) {
              k = 0.5;
            }
            let sum = (time / 480) * (player.occupation_level * 2 + 12) * k;
            if (player.level_id >= 36) {
              sum = (time / 480) * (player.occupation_level * 3 + 11);
            }
            let names = [
              '万年凝血草',
              '万年何首乌',
              '万年血精草',
              '万年甜甜花',
              '万年清心草',
              '古神藤',
              '万年太玄果',
              '炼骨花',
              '魔蕴花',
              '万年清灵草',
              '万年天魂菊',
              '仙蕴花',
              '仙缘草',
              '太玄仙草',
            ];
            const sum2 = [0.2, 0.3, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const sum3 = [
              0.17, 0.22, 0.17, 0.17, 0.17, 0.024, 0.024, 0.024, 0.024, 0.024,
              0.024, 0.024, 0.012, 0.011,
            ];
            let msg = [segment.at(player_id)];
            msg.push(`\n恭喜你获得了经验${exp},草药:`);
            let newsum = sum3.map(item => item * sum);
            if (player.level_id < 36) {
              newsum = sum2.map(item => item * sum);
            }
            for (let item in sum3) {
              if (newsum[item] < 1) {
                continue;
              }
              msg.push(`\n${names[item]}${Math.floor(newsum[item])}个`);
              await Add_najie_thing(
                player_id,
                names[item],
                '草药',
                Math.floor(newsum[item])
              );
            }
            await Add_职业经验(player_id, exp);
            let arr = action;
            //把状态都关了
            arr.plant = 1; //闭关状态
            arr.shutup = 1; //闭关状态
            arr.working = 1; //降妖状态
            arr.power_up = 1; //渡劫状态
            arr.Place_action = 1; //秘境
            arr.Place_actionplus = 1; //沉迷状态
            delete arr.group_id; //结算完去除group_id
            await redis.set(
              'xiuxian@1.3.0:' + player_id + ':action',
              JSON.stringify(arr)
            );
            if (is_group) {
              await this.pushInfo(push_address, is_group, msg);
            } else {
              await this.pushInfo(player_id, is_group, msg);
            }
          }
        }
        if (action.mine == '0') {
          //这里改一改,要在结束时间的前一分钟提前结算
          //时间过了
          end_time = end_time - 60000 * 2;
          if (now_time > end_time) {
            log_mag += '当前人物未结算，结算状态';
            let player = data.getData('player', player_id);
            if (!isNotNull(player.level_id)) {
              return false;
            }
            let time = parseInt(action.time) / 1000 / 60; //最高480分钟
            //以下1到5为每种的数量
            let mine_amount1 = Math.floor((1.8 + Math.random() * 0.4) * time); //(1.8+随机0到0.4)x时间(分钟)
            let rate =
              data.occupation_exp_list.find(
                item => item.id == player.occupation_level
              ).rate * 10;
            let exp = 0;
            let ext = '';
            exp = time * 10;
            ext = `你是采矿师，获得采矿经验${exp}，额外获得矿石${Math.floor(
              rate * 100
            )}%，`;
            let end_amount = Math.floor(4 * (rate + 1) * mine_amount1); //普通矿石
            let num = Math.floor(((rate / 12) * time) / 30); //锻造
            const A = [
              '金色石胚',
              '棕色石胚',
              '绿色石胚',
              '红色石胚',
              '蓝色石胚',
              '金色石料',
              '棕色石料',
              '绿色石料',
              '红色石料',
              '蓝色石料',
            ];
            const B = [
              '金色妖石',
              '棕色妖石',
              '绿色妖石',
              '红色妖石',
              '蓝色妖石',
              '金色妖丹',
              '棕色妖丹',
              '绿色妖丹',
              '红色妖丹',
              '蓝色妖丹',
            ];
            let xuanze = Math.trunc(Math.random() * A.length);
            end_amount *= player.level_id / 40;
            end_amount = Math.floor(end_amount);
            await Add_najie_thing(player_id, '庚金', '材料', end_amount);
            await Add_najie_thing(player_id, '玄土', '材料', end_amount);
            await Add_najie_thing(player_id, A[xuanze], '材料', num);
            await Add_najie_thing(
              player_id,
              B[xuanze],
              '材料',
              Math.trunc(num / 48)
            );
            await Add_职业经验(player_id, exp);
            msg.push(
              `\n采矿归来，${ext}\n收获庚金×${end_amount}\n玄土×${end_amount}`
            );
            msg.push(
              `\n${A[xuanze]}x${num}\n${B[xuanze]}x${Math.trunc(num / 48)}`
            );
            let arr = action;
            //把状态都关了
            arr.mine = 1; //采矿状态
            arr.mine = 1; //闭状态
            arr.shutup = 1; //闭关状态
            arr.working = 1; //降妖状态
            arr.power_up = 1; //渡劫状态
            arr.Place_action = 1; //秘境
            arr.Place_actionplus = 1; //沉迷状态
            delete arr.group_id; //结算完去除group_id
            await redis.set(
              'xiuxian@1.3.0:' + player_id + ':action',
              JSON.stringify(arr)
            );
            //msg.push("\n增加修为:" + xiuwei * time, "血量增加:" + blood * time);
            if (is_group) {
              await this.pushInfo(push_address, is_group, msg);
            } else {
              await this.pushInfo(player_id, is_group, msg);
            }
          }
        }
      }
    }
  }

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
