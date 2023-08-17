import { plugin, common, name, dsc } from '../../api/api.js'
import data from '../../model/xiuxiandata.js'
import config from '../../model/config.js'
import fs from 'fs'
import { AppName } from '../../app.config.js'
import {
  Read_player,
  isNotNull,
  Write_player,
  dujie
} from '../../model/xiuxian.js'
export class leveltask extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: []
    })
    this.set = config.getconfig('task', 'task')
    this.task = {
      cron: this.set.action_task,
      name: 'levelTask',
      fnc: () => this.levelTask()
    }
  }

  async levelTask() {
    //获取缓存中人物列表
    let playerList = []
    let files = fs
      .readdirSync('./plugins/' + AppName + '/resources/data/xiuxian_player')
      .filter((file) => file.endsWith('.json'))
    for (let file of files) {
      file = file.replace('.json', '')
      playerList.push(file)
    }
    for (let player_id of playerList) {
      let log_mag = '' //查询当前人物动作日志信息
      log_mag = log_mag + '查询' + player_id + '是否有动作,'
      //得到动作
      let action = await redis.get('xiuxian:player:' + player_id + ':action')
      action = JSON.parse(action)
      //不为空，存在动作
      if (action != null) {
        let push_address //消息推送地址
        let is_group = false //是否推送到群
        if (action.hasOwnProperty('group_id')) {
          if (isNotNull(action.group_id)) {
            is_group = true
            push_address = action.group_id
          }
        }
        //最后发送的消息
        let msg = [segment.at(player_id)]
        //动作结束时间
        let end_time = action.end_time
        //现在的时间
        let now_time = new Date().getTime()
        //用户信息
        let player = await Read_player(player_id)
        //开启了渡劫状态
        if (action.power_up == '0') {
          //仙界未开
          if (player.power_place == '1') {
            //伤害区间
            let power_n = action.power_n
            let power_m = action.power_m
            //获取雷次数
            let aconut = await redis.get(
              'xiuxian:player:' + player_id + ':power_aconut'
            )

            //当前系数计算
            let power_distortion = await dujie(player_id)

            //天赋
            let power_Grade = action.power_Grade
            //现在的小于结算，是在渡劫中
            if (now_time <= end_time) {
              //此人需要渡劫
              //获取渡劫随机数
              let variable = Math.random() * (power_m - power_n) + power_n
              //根据雷伤害的次数畸变.最高可达到+1.2
              variable = variable + aconut / 10
              //对比系数
              if (power_distortion >= variable) {
                //判断目前是第几雷，第九就是过了
                if (aconut >= power_Grade) {
                  msg.push(
                    '\n' +
                      player.名号 +
                      '成功度过了第' +
                      aconut +
                      '道雷劫！可以#羽化登仙，飞升仙界啦！'
                  )
                  let arr = action
                  //把状态都关了
                  arr.shutup = 1 //闭关状态
                  arr.working = 1 //降妖状态
                  arr.power_up = 1 //渡劫状态
                  arr.Place_action = 1 //秘境
                  player.power_place = 0
                  await Write_player(player_id, player)
                  await redis.set(
                    'xiuxian:player:' + player_id + ':power_aconut',
                    1
                  )
                  arr.end_time = new Date().getTime() //结束的时间也修改为当前时间
                  delete arr.group_id //结算完去除group_id
                  await redis.set(
                    'xiuxian:player:' + player_id + ':action',
                    JSON.stringify(arr)
                  )
                  if (is_group) {
                    await this.pushInfo(push_address, is_group, msg)
                  } else {
                    await this.pushInfo(player_id, is_group, msg)
                  }
                } else {
                  //血量计算根据雷来计算！
                  let act = variable - power_n
                  act = act / (power_m - power_n)

                  player.当前血量 = player.当前血量 - player.当前血量 * act

                  player.当前血量 = Math.trunc(player.当前血量)

                  await Write_player(player_id, player)
                  variable = Number(variable)
                  power_distortion = Number(power_distortion)
                  msg.push(
                    '\n本次雷伤:' +
                      variable.toFixed(2) +
                      '\n本次雷抗:' +
                      power_distortion.toFixed(2) +
                      '\n' +
                      player.名号 +
                      '成功度过了第' +
                      aconut +
                      '道雷劫！\n下一道雷劫在一分钟后落下！'
                  )
                  aconut = Number(aconut)
                  aconut++
                  await redis.set(
                    'xiuxian:player:' + player_id + ':power_aconut',
                    aconut
                  )
                  aconut = await redis.get(
                    'xiuxian:player:' + player_id + ':power_aconut'
                  )
                  if (is_group) {
                    await this.pushInfo(push_address, is_group, msg)
                  } else {
                    await this.pushInfo(player_id, is_group, msg)
                  }
                }
              } else {
                //血量情况
                player.当前血量 = 1
                //扣一半修为
                player.修为 = player.修为 * 0.5
                player.修为 = Math.trunc(player.修为)
                player.power_place = 1
                await Write_player(player_id, player)
                variable = Number(variable)
                power_distortion = Number(power_distortion)
                //未挡住雷杰
                msg.push(
                  '\n本次雷伤' +
                    variable.toFixed(2) +
                    '\n本次雷抗:' +
                    power_distortion +
                    '\n第' +
                    aconut +
                    '道雷劫落下了，可惜' +
                    player.名号 +
                    '未能抵挡，渡劫失败了！'
                )

                let arr = action
                //关闭所有状态，并把次数清零
                arr.shutup = 1 //闭关状态
                arr.working = 1 //降妖状态
                arr.power_up = 1 //渡劫状态
                arr.Place_action = 1 //秘境
                await redis.set(
                  'xiuxian:player:' + player_id + ':power_aconut',
                  1
                )
                arr.end_time = new Date().getTime() //结束的时间也修改为当前时间
                delete arr.group_id //结算完去除group_id
                await redis.set(
                  'xiuxian:player:' + player_id + ':action',
                  JSON.stringify(arr)
                )
                if (is_group) {
                  await this.pushInfo(push_address, is_group, msg)
                } else {
                  await this.pushInfo(player_id, is_group, msg)
                }
              }
            }
            //时间已经过了
            else {
              msg.push(player.名号 + '陷入了时间轮回，正在拉回！')
              player.当前血量 = 1
              player.修为 = player.修为 * 0.5
              player.修为 = Math.trunc(player.修为)
              player.power_place = 1
              await Write_player(player_id, player)
              //还没有渡劫完成
              //直接重新开始渡劫
              //关闭所有状态，并把次数清零
              let arr = action
              arr.shutup = 1 //闭关状态
              arr.working = 1 //降妖状态
              arr.power_up = 1 //渡劫状态
              arr.Place_action = 1 //秘境
              //开仙门
              await redis.set(
                'xiuxian:player:' + player_id + ':power_aconut',
                1
              )
              arr.end_time = new Date().getTime() //结束的时间也修改为当前时间
              delete arr.group_id //结算完去除group_id
              await redis.set(
                'xiuxian:player:' + player_id + ':action',
                JSON.stringify(arr)
              )
              if (is_group) {
                await this.pushInfo(push_address, is_group, msg)
              } else {
                await this.pushInfo(player_id, is_group, msg)
              }
            }
          }
        }
      }
    }
  }

  /**
   * 增加player文件某属性的值（在原本的基础上增加）
   * @param user_qq
   * @param num 属性的value
   * @param type 修改的属性
   * @return falses {Promise<void>}
   */
  async setFileValue(user_qq, num, type) {
    let user_data = data.getData('player', user_qq)
    let current_num = user_data[type] //当前灵石数量
    let new_num = current_num + num
    if (type == '当前血量' && new_num > user_data.血量上限) {
      new_num = user_data.血量上限 //治疗血量需要判读上限
    }
    user_data[type] = new_num
    await data.setData('player', user_qq, user_data)
    return false
  }

  /**
   * 推送消息，群消息推送群，或者推送私人
   * @param id
   * @param is_group
   * @return falses {Promise<void>}
   */
  async pushInfo(id, is_group, msg) {
    if (is_group) {
      await Bot.pickGroup(id)
        .sendMsg(msg)
        .catch((err) => {
          console.error(err)
        })
    } else {
      await common.relpyPrivate(id, msg)
    }
  }
}
