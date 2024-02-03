import { __PATH } from '../../model/index.js'
import {
  existplayer,
  Read_player,
  exist_najie_thing,
  Add_najie_thing,
  Write_player
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class motou extends plugin {
  constructor() {
    super({
      name: 'motou',
      dsc: '交易模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#供奉魔石$',
          fnc: 'add_lingeng'
        },
        {
          reg: '^#堕入魔界$',
          fnc: 'mojie'
        },
        {
          reg: '^#献祭魔石$',
          fnc: 'xianji'
        }
      ]
    })
  }

  async add_lingeng(e) {
    //固定写法
    let usr_qq = e.user_id
    //有无存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let player = await Read_player(usr_qq)
    if (player.魔道值 < 1000) {
      e.reply('你不是魔头')
      return false
    }
    let x = await exist_najie_thing(usr_qq, '魔石', '道具')
    if (!x) {
      e.reply('你没有魔石')
      return false
    }
    if (player.talent.type != '魔头') {
      /** 设置上下文 */
      this.setContext('RE_lingeng')
      /** 回复 */
      await e.reply(
        '一旦转为魔根,将会舍弃当前talent。回复:【放弃魔根】或者【转世魔根】进行选择',
        false,
        { at: true }
      )
      return false
    }
    let random = Math.random()
    if (player.talent.name == '一重魔功') {
      if (x < 20) {
        e.reply('魔石不足20个,当前魔石数量' + x + '个')
        return false
      }
      await Add_najie_thing(usr_qq, '魔石', '道具', -20)
      if (random < 0.9) {
        player.talent = {
          id: 100992,
          name: '二重魔功',
          type: '魔头',
          eff: 0.42,
          法球倍率: 0.27
        }
        await Write_player(usr_qq, player)
        e.reply('恭喜你,talent突破成功,当前talent二重魔功!')
        return false
      } else {
        e.reply('talent突破失败')
        return false
      }
    } else if (player.talent.name == '二重魔功') {
      if (x < 30) {
        e.reply('魔石不足30个,当前魔石数量' + x + '个')
        return false
      }
      await Add_najie_thing(usr_qq, '魔石', '道具', -30)
      if (random < 0.8) {
        player.talent = {
          id: 100993,
          name: '三重魔功',
          type: '魔头',
          eff: 0.48,
          法球倍率: 0.31
        }
        await Write_player(usr_qq, player)
        e.reply('恭喜你,talent突破成功,当前talent三重魔功!')
        return false
      } else {
        e.reply('talent突破失败')
        return false
      }
    } else if (player.talent.name == '三重魔功') {
      if (x < 30) {
        e.reply('魔石不足30个,当前魔石数量' + x + '个')
        return false
      }
      await Add_najie_thing(usr_qq, '魔石', '道具', -30)
      if (random < 0.7) {
        player.talent = {
          id: 100994,
          name: '四重魔功',
          type: '魔头',
          eff: 0.54,
          法球倍率: 0.36
        }
        await Write_player(usr_qq, player)
        e.reply('恭喜你,talent突破成功,当前talent四重魔功!')
        return false
      } else {
        e.reply('talent突破失败')
        return false
      }
    } else if (player.talent.name == '四重魔功') {
      if (x < 40) {
        e.reply('魔石不足40个,当前魔石数量' + x + '个')
        return false
      }
      await Add_najie_thing(usr_qq, '魔石', '道具', -40)
      if (random < 0.6) {
        player.talent = {
          id: 100995,
          name: '五重魔功',
          type: '魔头',
          eff: 0.6,
          法球倍率: 0.4
        }
        await Write_player(usr_qq, player)
        e.reply('恭喜你,talent突破成功,当前talent五重魔功!')
        return false
      } else {
        e.reply('talent突破失败')
        return false
      }
    } else if (player.talent.name == '五重魔功') {
      if (x < 40) {
        e.reply('魔石不足40个,当前魔石数量' + x + '个')
        return false
      }
      await Add_najie_thing(usr_qq, '魔石', '道具', -40)
      if (random < 0.5) {
        player.talent = {
          id: 100996,
          name: '六重魔功',
          type: '魔头',
          eff: 0.66,
          法球倍率: 0.43
        }
        await Write_player(usr_qq, player)
        e.reply('恭喜你,talent突破成功,当前talent六重魔功!')
        return false
      } else {
        e.reply('talent突破失败')
        return false
      }
    } else if (player.talent.name == '六重魔功') {
      if (x < 40) {
        e.reply('魔石不足40个,当前魔石数量' + x + '个')
        return false
      }
      await Add_najie_thing(usr_qq, '魔石', '道具', -40)
      if (random < 0.4) {
        player.talent = {
          id: 100997,
          name: '七重魔功',
          type: '魔头',
          eff: 0.72,
          法球倍率: 0.47
        }
        await Write_player(usr_qq, player)
        e.reply('恭喜你,talent突破成功,当前talent七重魔功!')
        return false
      } else {
        e.reply('talent突破失败')
        return false
      }
    } else if (player.talent.name == '七重魔功') {
      if (x < 50) {
        e.reply('魔石不足50个,当前魔石数量' + x + '个')
        return false
      }
      await Add_najie_thing(usr_qq, '魔石', '道具', -50)
      if (random < 0.3) {
        player.talent = {
          id: 100998,
          name: '八重魔功',
          type: '魔头',
          eff: 0.78,
          法球倍率: 0.5
        }
        await Write_player(usr_qq, player)
        e.reply('恭喜你,talent突破成功,当前talent八重魔功!')
        return false
      } else {
        e.reply('talent突破失败')
        return false
      }
    } else if (player.talent.name == '八重魔功') {
      if (x < 50) {
        e.reply('魔石不足50个,当前魔石数量' + x + '个')
        return false
      }
      await Add_najie_thing(usr_qq, '魔石', '道具', -50)
      if (random < 0.2) {
        player.talent = {
          id: 100999,
          name: '九重魔功',
          type: '魔头',
          eff: 1.2,
          法球倍率: 1.2
        }
        await Write_player(usr_qq, player)
        e.reply('恭喜你,talent突破成功,当前talent九重魔功!')
        return false
      } else {
        e.reply('talent突破失败')
        return false
      }
    }
    return false
  }
  async RE_lingeng(e) {
    let usr_qq = e.user_id
    let player = await Read_player(usr_qq)
    /** 内容 */
    let new_msg = this.e.message
    let choice = new_msg[0].text
    if (choice == '放弃魔根') {
      await this.reply('重拾道心,继续修行')
      /** 结束上下文 */
      this.finish('RE_lingeng')
      return false
    } else if (choice == '转世魔根') {
      let x = await exist_najie_thing(usr_qq, '魔石', '道具')
      if (!x) {
        e.reply('你没有魔石')
        return false
      }
      if (x < 10) {
        e.reply('你魔石不足10个')
        return false
      }
      await Add_najie_thing(usr_qq, '魔石', '道具', -10)
      player.talent = {
        id: 100991,
        name: '一重魔功',
        type: '魔头',
        eff: 0.36,
        法球倍率: 0.23
      }
      await Write_player(usr_qq, player)
      e.reply('恭喜你,转世魔头成功!')
      /** 结束上下文 */
      this.finish('RE_lingeng')
      return false
    }
  }

  async mojie(e) {
    let usr_qq = e.user_id
    //查看存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let game_action = await redis.get(
      'xiuxian@1.4.0:' + usr_qq + ':game_action'
    )
    //防止继续其他娱乐行为
    if (game_action == 0) {
      e.reply('修仙：游戏进行中...')
      return false
    }
    //查询redis中the人物动作
    let action = await redis.get('xiuxian@1.4.0:' + usr_qq + ':action')
    action = JSON.parse(action)
    if (action != null) {
      //人物有动作查询动作结束时间
      let action_end_time = action.end_time
      let now_time = new Date().getTime()
      if (now_time <= action_end_time) {
        let m = parseInt((action_end_time - now_time) / 1000 / 60)
        let s = parseInt((action_end_time - now_time - m * 60 * 1000) / 1000)
        e.reply('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒')
        return false
      }
    }
    let player = await Read_player(usr_qq)
    if (player.魔道值 < 1000) {
      e.reply('你不是魔头')
      return false
    }
    if (player.now_exp < 4000000) {
      e.reply('now_exp不足')
      return false
    }
    player.魔道值 -= 100
    player.now_exp -= 4000000
    await Write_player(usr_qq, player)
    let time = 60 //时间（分钟）
    let action_time = 60000 * time //持续时间，单位毫秒
    let arr = {
      action: '魔界', //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: '1', //闭关
      working: '1', //降妖
      Place_action: '1', //秘境状态---关闭
      mojie: '0', //魔界状态---关闭
      Place_actionplus: '1', //沉迷秘境状态---关闭
      power_up: '1', //渡劫状态--关闭
      xijie: '1', //洗劫状态开启
      plant: '1', //采药-开启
      mine: '1', //采矿-开启
      cishu: '10'
    }
    if (e.isGroup) {
      arr.group_id = e.group_id
    }
    await redis.set('xiuxian@1.4.0:' + usr_qq + ':action', JSON.stringify(arr))
    e.reply('开始进入魔界,' + time + '分钟后归来!')
    return false
  }

  async xianji(e) {
    let usr_qq = e.user_id
    //查看存档
    let ifexistplay = await existplayer(usr_qq)
    if (!ifexistplay) return false
    let player = await Read_player(usr_qq)
    if (player.魔道值 < 1000) {
      e.reply('你不是魔头')
      return false
    }
    let x = await exist_najie_thing(usr_qq, '魔石', '道具')
    if (!x) {
      e.reply('你没有魔石')
      return false
    }
    if (x < 8) {
      e.reply('魔石不足8个,当前魔石数量' + x + '个')
      return false
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -8)
    let wuping_length
    let wuping_index
    let wuping
    wuping_length = data.xingge[0].one.length
    wuping_index = Math.trunc(Math.random() * wuping_length)
    wuping = data.xingge[0].one[wuping_index]
    e.reply('获得了' + wuping.name)
    await Add_najie_thing(usr_qq, wuping.name, wuping.class, 1)
    return false
  }
}
