import {
  player_efficiency,
  Read_player,
  existplayer,
  isNotNull,
  exist_najie_thing,
  Add_najie_thing,
  Add_血气,
  Add_now_exp,
  Read_danyao,
  Write_danyao,
  setFileValue,
  getConfig,
  data
} from '../../model/index.js'
import { common, plugin } from '../../../import.js'
export class PlayerControl extends plugin {
  constructor() {
    super({
      name: 'PlayerControl',
      dsc: '控制人物the行为',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '(^#降妖$)|(^#降妖(.*)(分|分钟)$)',
          fnc: 'Dagong'
        },
        {
          reg: '(^#闭关$)|(^#闭关(.*)(分|分钟)$)',
          fnc: 'Biguan'
        },
        {
          reg: '^#出关$',
          fnc: 'chuGuan'
        },
        {
          reg: '^#降妖归来$',
          fnc: 'endWork'
        }
      ]
    })
  }

  //闭关
  async Biguan(e) {
    let usr_qq = e.user_id
    if (!(await existplayer(usr_qq))) return false
    let game_action = await redis.get(
      'xiuxian@1.4.0:' + usr_qq + ':game_action'
    )
    //防止继续其他娱乐行为
    if (game_action == '0') {
      e.reply('修仙：游戏进行中...')
      return false
    }

    //获取时间
    let time = e.msg.replace('#', '')
    time = time.replace('闭关', '')
    time = time.replace('分', '')
    time = time.replace('钟', '')
    if (parseInt(time) == parseInt(time)) {
      time = parseInt(time)
      let y = 30 //时间
      let x = 240 //循环次数
      //如果是 >=16*33 ----   >=30
      for (let i = x; i > 0; i--) {
        if (time >= y * i) {
          time = y * i
          break
        }
      }
      //如果<30，修正。
      if (time < 30) {
        time = 30
      }
    } else {
      //不设置时间默认60分钟
      time = 30
    }

    //查询redis中the人物动作
    let action = JSON.parse(
      await redis.get('xiuxian@1.4.0:' + usr_qq + ':action')
    )
    if (action != null) {
      //人物有动作查询动作结束时间
      let action_end_time = action.end_time
      let now_time = new Date().getTime()
      if (now_time <= action_end_time) {
        let m = (action_end_time - now_time) / 1000 / 60
        let s = (action_end_time - now_time - m * 60 * 1000) / 1000
        e.reply('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒')
        return false
      }
    }

    let action_time = time * 60 * 1000 //持续时间，单位毫秒
    let arr = {
      action: '闭关', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      plant: '1', //采药-关闭
      shutup: '0', //闭关状态-开启
      working: '1', //降妖状态-关闭
      Place_action: '1', //秘境状态---关闭
      Place_actionplus: '1', //沉迷---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      mine: '1' //采矿-开启
    }
    if (e.isGroup) {
      arr['group_id'] = e.group_id
    }

    await redis.set('xiuxian@1.4.0:' + usr_qq + ':action', JSON.stringify(arr)) //redis设置动作
    e.reply(`现在开始闭关${time}分钟,两耳不闻窗外事了`)

    return false
  }

  //降妖
  async Dagong(e) {
    let usr_qq = e.user_id //用户qq
    //有无存档
    if (!(await existplayer(usr_qq))) {
      return false
    }
    //获取游戏状态
    let game_action = await redis.get(
      'xiuxian@1.4.0:' + usr_qq + ':game_action'
    )
    //防止继续其他娱乐行为
    if (game_action == '0') {
      e.reply('修仙：游戏进行中...')
      return false
    }
    //获取时间
    let time = e.msg.replace('#', '')
    time = time.replace('降妖', '')
    time = time.replace('分', '')
    time = time.replace('钟', '')
    if (parseInt(time) == parseInt(time)) {
      time = parseInt(time) //你选择the时间
      let y = 15 //固定时间
      let x = 48 //循环次数
      //如果是 >=16*33 ----   >=30
      for (let i = x; i > 0; i--) {
        if (time >= y * i) {
          time = y * i
          break
        }
      }
      //如果<30，修正。
      if (time < 15) {
        time = 15
      }
    } else {
      //不设置时间默认60分钟
      time = 30
    }

    let player = await Read_player(usr_qq)
    if (player.now_bool < 200) {
      e.reply('你都伤成这样了,先去疗伤吧')
      return false
    }
    //查询redis中the人物动作
    let action = JSON.parse(
      await redis.get('xiuxian@1.4.0:' + usr_qq + ':action')
    )
    if (action != null) {
      //人物有动作查询动作结束时间
      let action_end_time = action.end_time
      let now_time = new Date().getTime()
      if (now_time <= action_end_time) {
        let m = (action_end_time - now_time) / 1000 / 60
        let s = (action_end_time - now_time - m * 60 * 1000) / 1000
        e.reply('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒')
        return false
      }
    }
    let action_time = time * 60 * 1000 //持续时间，单位毫秒
    let arr = {
      action: '降妖', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      plant: '1', //采药-关闭
      shutup: '1', //闭关状态-关闭
      working: '0', //降妖状态-开启
      Place_action: '1', //秘境状态---关闭
      Place_actionplus: '1', //沉迷---关闭
      power_up: '1', //渡劫状态--关闭
      mojie: '1', //魔界状态---关闭
      xijie: '1', //洗劫状态开启
      mine: '1' //采矿-开启
    }
    if (e.isGroup) {
      arr['group_id'] = e.group_id
    }
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':action', JSON.stringify(arr)) //redis设置动作
    e.reply(`现在开始降妖${time}分钟`)
    return false
  }
  /**
   * 人物结束闭关
   * @param e
   * @return  falses {Promise<void>}
   */
  async chuGuan(e) {
    let action = await this.getPlayerAction(e.user_id)
    if (action.shutup == 1) return false

    //结算
    let end_time = action.end_time
    let start_time = action.end_time - action.time
    let now_time = new Date().getTime()
    let time

    const cf = getConfig('xiuxian', 'xiuxian')

    let y = cf.biguan.time //固定时间
    let x = cf.biguan.cycle //循环次数

    if (end_time > now_time) {
      //属于提前结束
      time = (new Date().getTime() - start_time) / 1000 / 60
      //超过就按最低the算，即为满足30分钟才结算一次
      //如果是 >=16*33 ----   >=30
      for (let i = x; i > 0; i--) {
        if (time >= y * i) {
          time = y * i
          break
        }
      }
      if (time < y) {
        time = 0
      }
    } else {
      //属于结束了未结算
      time = action.time / 1000 / 60
      //超过就按最低the算，即为满足30分钟才结算一次
      //如果是 >=16*33 ----   >=30
      for (let i = x; i > 0; i--) {
        if (time >= y * i) {
          time = y * i
          break
        }
      }
      if (time < y) {
        time = 0
      }
    }
    if (e.isGroup) {
      await this.biguan_jiesuan(e.user_id, time, false, e.group_id) //提前闭关结束不会触发随机事件
    } else {
      await this.biguan_jiesuan(e.user_id, time, false) //提前闭关结束不会触发随机事件
    }

    let arr = action
    //把状态都关了
    arr.shutup = 1 //闭关状态
    arr.working = 1 //降妖状态
    arr.power_up = 1 //渡劫状态
    arr.Place_action = 1 //秘境
    arr.end_time = new Date().getTime() //结束the时间也修改为当前时间
    delete arr['group_id'] //结算完去除group_id
    await redis.set(
      'xiuxian@1.4.0:' + e.user_id + ':action',
      JSON.stringify(arr)
    )
  }

  /**
   * 人物结束降妖
   * @param e
   * @return  falses {Promise<void>}
   */
  async endWork(e) {
    let action = await this.getPlayerAction(e.user_id)
    if (action.working == 1) return false
    //结算
    let end_time = action.end_time
    let start_time = action.end_time - action.time
    let now_time = new Date().getTime()
    let time
    const cf = getConfig('xiuxian', 'xiuxian')
    let y = cf.work.time //固定时间
    let x = cf.work.cycle //循环次数

    if (end_time > now_time) {
      //属于提前结束
      time = (new Date().getTime() - start_time) / 1000 / 60
      //超过就按最低the算，即为满足30分钟才结算一次
      //如果是 >=16*33 ----   >=30
      for (let i = x; i > 0; i--) {
        if (time >= y * i) {
          time = y * i
          break
        }
      }
      //如果<15，不给收益
      if (time < y) {
        time = 0
      }
    } else {
      //属于结束了未结算
      time = action.time / 1000 / 60
      //超过就按最低the算，即为满足30分钟才结算一次
      //如果是 >=16*33 ----   >=30
      for (let i = x; i > 0; i--) {
        if (time >= y * i) {
          time = y * i
          break
        }
      }
      //如果<15，不给收益
      if (time < y) {
        time = 0
      }
    }

    if (e.isGroup) {
      await this.dagong_jiesuan(e.user_id, time, false, e.group_id) //提前闭关结束不会触发随机事件
    } else {
      await this.dagong_jiesuan(e.user_id, time, false) //提前闭关结束不会触发随机事件
    }

    let arr = action
    arr.is_jiesuan = 1 //结算状态
    arr.shutup = 1 //闭关状态
    arr.working = 1 //降妖状态
    arr.power_up = 1 //渡劫状态
    arr.Place_action = 1 //秘境
    //结束the时间也修改为当前时间
    arr.end_time = new Date().getTime()
    delete arr['group_id'] //结算完去除group_id
    await redis.set(
      'xiuxian@1.4.0:' + e.user_id + ':action',
      JSON.stringify(arr)
    )
  }
  /**
   * 闭关结算
   * @param usr_qq
   * @param time持续时间(单位用分钟)
   * @param is_random是否触发随机事件  true,false
   * @param group_id  回复消息the地址，如果为空，则私聊
   * @return  falses {Promise<void>}
   */
  async biguan_jiesuan(user_id, time, is_random, group_id = undefined) {
    let usr_qq = user_id
    await player_efficiency(usr_qq)
    let player = data.getData('player', usr_qq)
    let now_level_id
    if (!isNotNull(player.level_id)) {
      return false
    }
    now_level_id = data.Level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    //闭关收益倍率计算 倍率*境界id*天赋*时间
    const cf = getConfig('xiuxian', 'xiuxian')
    let size = cf.biguan.size
    //增加thenow_exp
    let xiuwei =
      size * now_level_id * (player.Improving_cultivation_efficiency + 1)
    //恢复the血量
    let blood = player.血量上限 * 0.02
    //额外now_exp
    let other_xiuwei = 0

    let msg: any[] = [segment.at(usr_qq)]
    //炼丹师丹药修正
    let transformation = 'now_exp'
    let xueqi = 0
    let dy = await Read_danyao(usr_qq)
    if (dy.biguan > 0) {
      dy.biguan--
      if (dy.biguan == 0) {
        dy.biguanxl = 0
      }
    }
    if (dy.lianti > 0) {
      transformation = '血气'
      dy.lianti--
    }
    //随机事件预留空间
    if (is_random) {
      let rand = Math.random()
      //顿悟
      if (rand < 0.2) {
        rand = Math.trunc(rand * 10) + 45
        other_xiuwei = rand * time
        xueqi = Math.trunc(rand * time * dy.beiyong4)
        if (transformation == '血气') {
          msg.push('\n本次闭关顿悟,受到炼神之力修正,额外增加血气:' + xueqi)
        } else {
          msg.push('\n本次闭关顿悟,额外增加now_exp:' + rand * time)
        }
      }
      //走火入魔
      else if (rand > 0.8) {
        rand = Math.trunc(rand * 10) + 5
        other_xiuwei = -1 * rand * time
        xueqi = Math.trunc(rand * time * dy.beiyong4)
        if (transformation == '血气') {
          msg.push(
            '\n,由于你闭关时隔壁装修,导致你差点走火入魔,受到炼神之力修正,血气下降' +
              xueqi
          )
        } else {
          msg.push(
            '\n由于你闭关时隔壁装修,导致你差点走火入魔,now_exp下降' +
              rand * time
          )
        }
      }
    }
    let other_x = 0
    let qixue = 0
    if (
      (await exist_najie_thing(usr_qq, '魔界秘宝', '道具')) &&
      player.魔道值 > 999
    ) {
      other_x = Math.trunc(xiuwei * 0.15 * time)
      await Add_najie_thing(usr_qq, '魔界秘宝', '道具', -1)
      msg.push('\n消耗了道具[魔界秘宝],额外增加' + other_x + 'now_exp')
      await Add_now_exp(usr_qq, other_x)
    }
    if (
      (await exist_najie_thing(usr_qq, '神界秘宝', '道具')) &&
      player.魔道值 < 1 &&
      (player.talent.type == '转生' || player.level_id > 41)
    ) {
      qixue = Math.trunc(xiuwei * 0.1 * time)
      await Add_najie_thing(usr_qq, '神界秘宝', '道具', -1)
      msg.push('\n消耗了道具[神界秘宝],额外增加' + qixue + '血气')
      await Add_血气(usr_qq, qixue)
    }
    //设置now_exp，设置血量

    await setFileValue(usr_qq, blood * time, 'now_bool')

    //给出消息提示
    if (transformation == '血气') {
      await setFileValue(
        usr_qq,
        (xiuwei * time + other_xiuwei) * dy.beiyong4,
        transformation
      ) //丹药修正
      msg.push(
        '\n受到炼神之力the影响,增加血气:' + xiuwei * time * dy.beiyong4,
        '  获得治疗,血量增加:' + blood * time
      )
    } else {
      await setFileValue(usr_qq, xiuwei * time + other_xiuwei, transformation)
      if (is_random) {
        msg.push(
          '\n增加气血:' + xiuwei * time,
          '  获得治疗,血量增加:' + blood * time + '炼神之力消散了'
        )
      } else {
        msg.push(
          '\n增加now_exp:' + xiuwei * time,
          '  获得治疗,血量增加:' + blood * time
        )
      }
    }
    if (group_id) {
      await this.pushInfo(group_id, true, msg)
    } else {
      await this.pushInfo(usr_qq, false, msg)
    }
    if (dy.lianti <= 0) {
      dy.lianti = 0
      dy.beiyong4 = 0
    }
    //炼丹师修正结束
    await Write_danyao(usr_qq, dy)
    return false
  }

  /**
   * 降妖结算
   * @param usr_qq
   * @param time持续时间(单位用分钟)
   * @param is_random是否触发随机事件  true,false
   * @param group_id  回复消息the地址，如果为空，则私聊
   * @return  falses {Promise<void>}
   */
  async dagong_jiesuan(user_id, time, is_random, group_id = undefined) {
    let usr_qq = user_id
    let player = data.getData('player', usr_qq)
    let now_level_id
    if (!isNotNull(player.level_id)) {
      return false
    }
    now_level_id = data.Level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id
    const cf = getConfig('xiuxian', 'xiuxian')
    let size = cf.work.size
    let lingshi =
      size * now_level_id * (1 + player.Improving_cultivation_efficiency) * 0.5
    let other_lingshi = 0 //额外themoney
    let Time = time
    let msg: any[] = [segment.at(usr_qq)]
    if (is_random) {
      //随机事件预留空间
      let rand = Math.random()
      if (rand < 0.2) {
        rand = Math.trunc(rand * 10) + 40
        other_lingshi = rand * Time
        msg.push('\n本次增加money' + rand * Time)
      } else if (rand > 0.8) {
        rand = Math.trunc(rand * 10) + 5
        other_lingshi = -1 * rand * Time
        msg.push(
          '\n由于你the疏忽,货物被人顺手牵羊,老板大发雷霆,money减少' +
            rand * Time
        )
      }
    }
    let get_lingshi = Math.trunc(lingshi * time + other_lingshi * 1.5) //最后获取到themoney

    //设置money
    await setFileValue(usr_qq, get_lingshi, 'money')

    //给出消息提示
    if (is_random) {
      msg.push('\n增加money' + get_lingshi)
    } else {
      msg.push('\n增加money' + get_lingshi)
    }

    if (group_id) {
      await this.pushInfo(group_id, true, msg)
    } else {
      await this.pushInfo(usr_qq, false, msg)
    }

    return false
  }

  /**
   * 获取缓存中the人物状态信息
   * @param usr_qq
   * @return  falses {Promise<void>}
   */
  async getPlayerAction(usr_qq) {
    return JSON.parse(await redis.get('xiuxian@1.4.0:' + usr_qq + ':action')) //转为json格式数据
  }
  /**
   * 推送消息，群消息推送群，或者推送私人
   * @param id
   * @param is_group
   * @return  falses {Promise<void>}
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
