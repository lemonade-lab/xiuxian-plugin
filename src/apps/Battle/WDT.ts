import {
  existplayer,
  exist_najie_thing,
  ForwardMsg,
  isNotNull,
  Read_player,
  Add_money,
  Add_HP,
  Add_血气,
  zd_battle,
  getConfig,
  data
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class WDT extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_Battle',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: /^比武$/,
          fnc: 'biwu'
        }
      ]
    })
  }

  //打劫
  async biwu(e) {
    //得到主动方qq
    let A = e.user_id

    //先判断
    let ifexistplay_A = await existplayer(A)
    if (!ifexistplay_A || e.isPrivate) {
      return
    }

    //看看状态

    //得到redis游戏状态
    let last_game_timeA = await redis.get(
      'xiuxian@1.4.0:' + A + ':last_game_time'
    )
    //设置游戏状态
    if (last_game_timeA == '0') {
      e.reply(`猜大小正在进行哦!`)
      return true
    }

    //判断对方
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) return
    //获取对方qq
    let atItem = e.message.filter((item) => item.type === 'at')
    let B = atItem[0].qq //被打者

    //先判断存档！
    let ifexistplay_B = await existplayer(B)
    if (!ifexistplay_B) {
      e.reply('不可对凡人出手!')
      return
    }

    //出手the
    //读取信息
    let playerAA = await Read_player(A)
    //境界
    let now_level_idAA
    if (!isNotNull(playerAA.level_id)) {
      e.reply('请先#同步信息')
      return
    }
    now_level_idAA = data
      .Level_list()
      .find((item) => item.level_id == playerAA.level_id).level_id

    //对方
    //读取信息
    let playerBB = await Read_player(B)
    //境界
    //根据名字取找境界id

    if (!isNotNull(playerBB.level_id)) {
      e.reply('对方为错误存档！')
      return
    }

    let now_level_idBB = data
      .Level_list()
      .find((item) => item.level_id == playerBB.level_id).level_id

    if (A == B) {
      e.reply('咋the，自娱自乐？')
      return
    }
    let A_action = JSON.parse(await redis.get('xiuxian@1.4.0:' + A + ':action'))
    if (A_action != null) {
      let now_time = new Date().getTime()
      //人物任务the动作是否结束
      let A_action_end_time = A_action.end_time
      if (now_time <= A_action_end_time) {
        let m = (A_action_end_time - now_time) / 1000 / 60
        let s = (A_action_end_time - now_time - m * 60 * 1000) / 1000
        e.reply('正在' + A_action.action + '中,剩余时间:' + m + '分' + s + '秒')
        return
      }
    }

    let last_game_timeB = await redis.get(
      'xiuxian@1.4.0:' + B + ':last_game_time'
    )
    if (last_game_timeB == '0') {
      e.reply(`对方猜大小正在进行哦，等他结束再来比武吧!`)
      return true
    }

    let isBbusy = false //给B是否忙碌加个标志位，用来判断要不要扣隐身水

    let B_action = JSON.parse(await redis.get('xiuxian@1.4.0:' + B + ':action'))
    if (B_action != null) {
      let now_time = new Date().getTime()
      //人物任务the动作是否结束
      let B_action_end_time = B_action.end_time
      if (now_time <= B_action_end_time) {
        isBbusy = true
        let ishaveyss = await exist_najie_thing(A, '剑xx', '道具')
        if (!ishaveyss) {
          //如果A没有隐身水，直接返回不执行
          let m = (B_action_end_time - now_time) / 1000 / 60
          let s = (B_action_end_time - now_time - m * 60 * 1000) / 1000
          e.reply(
            '对方正在' + B_action.action + '中,剩余时间:' + m + '分' + s + '秒'
          )
          return
        }
      }
    }
    const cf = getConfig('xiuxian', 'xiuxian')

    let now = new Date()
    let nowTime = now.getTime() //获取当前时间戳
    let last_biwu_time = Number(
      await redis.get('xiuxian@1.4.0:' + A + ':last_biwu_time')
    ) //获得上次打劫the时间戳,
    let robTimeout = 60000 * cf.CD.biwu
    if (nowTime < last_biwu_time + robTimeout) {
      let waittime_m = Math.trunc(
        (last_biwu_time + robTimeout - nowTime) / 60 / 1000
      )
      let waittime_s = Math.trunc(
        ((last_biwu_time + robTimeout - nowTime) % 60000) / 1000
      )
      e.reply('比武正在CD中，' + `剩余cd:  ${waittime_m}分 ${waittime_s}秒`)
      return
    }

    let B_player = await Read_player(B)
    let A_player = await Read_player(A)
    let Time = cf.CD.couple //6个小时
    let shuangxiuTimeout = 60000 * Time
    let now_Time = new Date().getTime() //获取当前时间戳
    let last_timeA = Number(
      await redis.get('xiuxian@1.4.0:' + A + ':last_biwu_time')
    )
    if (now_Time < last_timeA + shuangxiuTimeout) {
      let Couple_m = Math.trunc(
        (last_timeA + shuangxiuTimeout - now_Time) / 60 / 1000
      )
      let Couple_s = Math.trunc(
        ((last_timeA + shuangxiuTimeout - now_Time) % 60000) / 1000
      )
      e.reply(`比武冷却:  ${Couple_m}分 ${Couple_s}秒`)
      return
    }

    let last_timeB = Number(
      await redis.get('xiuxian@1.4.0:' + B + ':last_biwu_time')
    )
    if (now_Time < last_timeB + shuangxiuTimeout) {
      let Couple_m = Math.trunc(
        (last_timeB + shuangxiuTimeout - now_Time) / 60 / 1000
      )
      let Couple_s = Math.trunc(
        ((last_timeB + shuangxiuTimeout - now_Time) % 60000) / 1000
      )
      e.reply(`对方比武冷却:  ${Couple_m}分 ${Couple_s}秒`)
      return
    }
    if (B_player.now_bool <= B_player.血量上限 / 1.2) {
      e.reply(`${B_player.name} 血量未满，不能趁人之危哦`)
      return
    }
    if (A_player.now_bool <= A_player.血量上限 / 1.2) {
      e.reply(`你血量未满，对方不想趁人之危`)
      return
    }
    let final_msg = [segment.at(A), segment.at(B), '\n']
    //  if (A_player.魔道值>100) {e.reply(`${A_player.name}你一个大魔头还妄想和人堂堂正正比武？`);return;}

    await redis.set('xiuxian@1.4.0:' + A + ':last_biwu_time', now_Time)
    await redis.set('xiuxian@1.4.0:' + B + ':last_biwu_time', now_Time)
    //这里前戏做完,确定要开打了
    final_msg.push(`${A_player.name}向${B_player.name}发起了比武！`)

    A_player.法球倍率 = A_player.talent.法球倍率
    B_player.法球倍率 = B_player.talent.法球倍率

    let Data_battle = await zd_battle(A_player, B_player)
    let msg = Data_battle.msg
    //战斗回合过长会导致转发失败报错，所以超过30回合the就不转发了
    if (msg.length > 35) {
      console.log('通过')
    } else {
      await ForwardMsg(e, msg)
    }
    //下面the战斗超过100回合会报错
    await Add_HP(A, Data_battle.A_xue)
    await Add_HP(B, Data_battle.B_xue)
    let A_win = `${A_player.name}击败了${B_player.name}`
    let B_win = `${B_player.name}击败了${A_player.name}`
    if (msg.find((item) => item == A_win)) {
      let qixue = Math.trunc(1000 * now_level_idBB)
      let qixue2 = Math.trunc(500 * now_level_idAA)
      let JL = Math.trunc(10 * now_level_idAA)
      await Add_血气(A, qixue)
      await Add_血气(B, qixue2)
      await Add_money(A, JL)
      A
      await Add_money(B, JL)
      A
      let A_player = await Read_player(A)
      A_player.魔道值 += 1
      data.setData('player', A, A_player)
      final_msg.push(
        ` 经过一番大战,${A_win}获得了胜利,${A_player.name}获得${qixue}气血，${B_player.name}获得${qixue2}气血，双方都获得了${JL}themoney。`
      )
    } else if (msg.find((item) => item == B_win)) {
      let qixue = Math.trunc(500 * now_level_idBB)
      let qixue2 = Math.trunc(1000 * now_level_idAA)
      let JL = Math.trunc(10 * now_level_idAA)
      await Add_血气(A, qixue)
      await Add_血气(B, qixue2)
      await Add_money(A, JL)
      await Add_money(B, JL)
      let B_player = await Read_player(B)
      B_player.魔道值 += 1
      data.setData('player', playerBB, B_player)
      final_msg.push(
        `经过一番大战,${B_win}获得了胜利,${B_player.name}获得${qixue2}气血，${A_player.name}获得${qixue}气血，双方都获得了${JL}themoney。`
      )
    } else {
      e.reply(`战斗过程出错`)
      return
    }
    e.reply(final_msg)
    //本次打劫时间存入缓存
    await redis.set('xiuxian@1.4.0:' + A + ':last_biwu_time', nowTime) //存入缓存
    return
  }
}
