import {
  existplayer,
  exist_najie_thing,
  ForwardMsg,
  isNotNull,
  Write_player,
  Add_najie_thing,
  Add_HP,
  Read_player,
  zd_battle,
  getConfig,
  data
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class Battle extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_Battle',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: /^打劫$/,
          fnc: 'Dajie'
        },
        {
          reg: /^(以武会友)$/,
          fnc: 'biwu'
        }
      ]
    })
  }

  //打劫
  async Dajie(e) {
    const nowDate = new Date()
    const todayDate = new Date(nowDate)
    const { openHour, closeHour } = getConfig('xiuxian', 'xiuxian').Auction
    const todayTime = todayDate.setHours(0, 0, 0, 0)
    const openTime = todayTime + openHour * 60 * 60 * 1000
    const nowTime1 = nowDate.getTime()
    const closeTime = todayTime + closeHour * 60 * 60 * 1000
    if (!(nowTime1 < openTime || nowTime1 > closeTime)) {
      e.reply(`这个时间由星阁阁主看管,还是不要张扬较好`)
      return false
    }

    //得到主动方qq
    let A = e.user_id

    //先判断
    let ifexistplay_A = await existplayer(A)
    if (!ifexistplay_A || e.isPrivate) {
      return false
    }

    //得到redis游戏状态
    let last_game_timeA = await redis.get(
      'xiuxian@1.4.0:' + A + ':last_game_time'
    )
    //设置游戏状态
    if (last_game_timeA == '0') {
      e.reply(`猜大小正在进行哦!`)
      return false
    }

    //判断对方
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) return false
    //获取对方qq
    let atItem = e.message.filter((item) => item.type === 'at')
    let B = atItem[0].qq //被打劫者

    //先判断存档！
    let ifexistplay_B = await existplayer(B)
    if (!ifexistplay_B) {
      e.reply('不可对凡人出手!')
      return false
    }

    //出手the
    //读取信息
    let playerAA = await Read_player(A)
    //境界
    let now_level_idAA
    if (!isNotNull(playerAA.level_id)) {
      e.reply('请先#同步信息')
      return false
    }
    now_level_idAA = data.Level_list.find(
      (item) => item.level_id == playerAA.level_id
    ).level_id

    //对方
    //读取信息
    let playerBB = await Read_player(B)
    //境界
    //根据名字取找境界id

    let now_level_idBB

    if (!isNotNull(playerBB.level_id)) {
      e.reply('对方为错误存档！')
      return false
    }

    now_level_idBB = data.Level_list.find(
      (item) => item.level_id == playerBB.level_id
    ).level_id

    //A是仙人，B不是仙人
    if (now_level_idAA > 41 && now_level_idBB <= 41) {
      e.reply(`仙人不可对凡人出手！`)
      return false
    }

    //A是修仙者，B不是
    if (now_level_idAA >= 12 && now_level_idBB < 12) {
      e.reply(`不可欺负弱小！`)
      return false
    }

    if (A == B) {
      e.reply('咋the，自己弄自己啊？')
      return false
    }
    let playerA = data.getData('player', A)
    let playerB = data.getData('player', B)
    if (isNotNull(playerA.宗门) && isNotNull(playerB.宗门)) {
      let assA = data.getAssociation(playerA.宗门.宗门名称)
      let assB = data.getAssociation(playerB.宗门.宗门名称)
      if (assA.宗门名称 == assB.宗门名称) {
        e.reply('门派禁止内讧')
        return false
      }
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
        return false
      }
    }

    let last_game_timeB = await redis.get(
      'xiuxian@1.4.0:' + B + ':last_game_time'
    )
    if (last_game_timeB == '0') {
      e.reply(`对方猜大小正在进行哦，等他赚够了再打劫也不迟!`)
      return false
    }

    let isBbusy = false //给B是否忙碌加个标志位，用来判断要不要扣隐身水

    let B_action = JSON.parse(await redis.get('xiuxian@1.4.0:' + B + ':action'))
    if (B_action != null) {
      let now_time = new Date().getTime()
      //人物任务the动作是否结束
      let B_action_end_time = B_action.end_time
      if (now_time <= B_action_end_time) {
        isBbusy = true
        let ishaveyss = await exist_najie_thing(A, '隐身水', '道具')
        if (!ishaveyss) {
          //如果A没有隐身水，直接返回不执行
          let m = (B_action_end_time - now_time) / 1000 / 60
          let s = (B_action_end_time - now_time - m * 60 * 1000) / 1000
          e.reply(
            '对方正在' + B_action.action + '中,剩余时间:' + m + '分' + s + '秒'
          )
          return false
        }
      }
    }

    let now = new Date()
    let nowTime = now.getTime() //获取当前时间戳
    let last_dajie_time = Number(
      await redis.get('xiuxian@1.4.0:' + A + ':last_dajie_time')
    )
    const cf = getConfig('xiuxian', 'xiuxian')
    let robTimeout = 60000 * cf.CD.rob
    if (nowTime < last_dajie_time + robTimeout) {
      let waittime_m = Math.trunc(
        (last_dajie_time + robTimeout - nowTime) / 60 / 1000
      )
      let waittime_s = Math.trunc(
        ((last_dajie_time + robTimeout - nowTime) % 60000) / 1000
      )
      e.reply('打劫正在CD中，' + `剩余cd:  ${waittime_m}分 ${waittime_s}秒`)
      return false
    }
    let A_player = await Read_player(A)
    let B_player = await Read_player(B)
    if (A_player.now_exp < 0) {
      e.reply(`还是闭会关再打劫吧`)
      return false
    }
    if (B_player.now_bool < 20000) {
      e.reply(`${B_player.name} 重伤未愈,就不要再打他了`)
      return false
    }
    if (B_player.money < 30002) {
      e.reply(`${B_player.name} 穷得快赶上水脚脚了,就不要再打他了`)
      return false
    }
    let final_msg = [segment.at(A), segment.at(B), '\n']

    //这里前戏做完,确定要开打了

    if (isBbusy) {
      //如果B忙碌,自动扣一瓶隐身水强行打架,奔着人道主义关怀,提前判断了不是重伤
      final_msg.push(
        `${B_player.name}正在${B_action.action}，${A_player.name}利用隐身水悄然接近，但被发现。`
      )
      await Add_najie_thing(A, '隐身水', '道具', -1)
    } else {
      final_msg.push(`${A_player.name}向${B_player.name}发起了打劫。`)
    }
    //本次打劫时间存入缓存
    await redis.set('xiuxian@1.4.0:' + A + ':last_dajie_time', nowTime) //存入缓存
    A_player.法球倍率 = A_player.talent.法球倍率
    B_player.法球倍率 = B_player.talent.法球倍率

    let Data_battle = await zd_battle(A_player, B_player)
    let msg = Data_battle.msg
    //战斗回合过长会导致转发失败报错，所以超过30回合the就不转发了
    if (msg.length > 35) {
    } else {
      await ForwardMsg(e, msg)
    }
    //下面the战斗超过100回合会报错
    await Add_HP(A, Data_battle.A_xue)
    await Add_HP(B, Data_battle.B_xue)
    let A_win = `${A_player.name}击败了${B_player.name}`
    let B_win = `${B_player.name}击败了${A_player.name}`
    if (msg.find((item) => item == A_win)) {
      if (
        (await exist_najie_thing(B, '替身人偶', '道具')) &&
        B_player.魔道值 < 1 &&
        (B_player.talent.type == '转生' || B_player.level_id > 41)
      ) {
        e.reply(B_player.name + '使用了道具替身人偶,躲过了此次打劫')
        await Add_najie_thing(B, '替身人偶', '道具', -1)
        return false
      }
      let mdzJL = A_player.魔道值
      let lingshi = Math.trunc(B_player.money / 5)
      let qixue = Math.trunc(100 * now_level_idAA)
      let mdz = Math.trunc(lingshi / 10000)
      if (lingshi >= B_player.money) {
        lingshi = B_player.money / 2
      }
      A_player.money += lingshi
      B_player.money -= lingshi
      A_player.血气 += qixue
      A_player.魔道值 += mdz
      A_player.money += mdzJL
      await Write_player(A, A_player)
      await Write_player(B, B_player)
      final_msg.push(
        ` 经过一番大战,${A_win},成功抢走${lingshi}money,${A_player.name}获得${qixue}血气，`
      )
    } else if (msg.find((item) => item == B_win)) {
      if (A_player.money < 30002) {
        let qixue = Math.trunc(100 * now_level_idBB)
        B_player.血气 += qixue
        await Write_player(B, B_player)
        let time2 = 60 //时间（分钟）
        let action_time2 = 60000 * time2 //持续时间，单位毫秒
        let action2 = JSON.parse(
          await redis.get('xiuxian@1.4.0:' + A + ':action')
        )
        action2.action = '禁闭'
        action2.end_time = new Date().getTime() + action_time2
        await redis.set(
          'xiuxian@1.4.0:' + A + ':action',
          JSON.stringify(action2)
        )
        final_msg.push(
          `经过一番大战,${A_player.name}被${B_player.name}击败了,${B_player.name}获得${qixue}血气,${A_player.name} 真是偷鸡不成蚀把米,被关禁闭60分钟`
        )
      } else {
        let lingshi = Math.trunc(A_player.money / 4)
        let qixue = Math.trunc(100 * now_level_idBB)
        if (lingshi <= 0) {
          lingshi = 0
        }
        A_player.money -= lingshi
        B_player.money += lingshi
        B_player.血气 += qixue
        await Write_player(A, A_player)
        await Write_player(B, B_player)
        final_msg.push(
          `经过一番大战,${A_player.name}被${B_player.name}击败了,${B_player.name}获得${qixue}血气,${A_player.name} 真是偷鸡不成蚀把米,被劫走${lingshi}money`
        )
      }
    } else {
      e.reply(`战斗过程出错`)
      return false
    }
    e.reply(final_msg)
    return false
  }

  //比武
  async biwu(e) {
    let A = e.user_id
    //先判断
    let ifexistplay_A = await existplayer(A)
    if (!ifexistplay_A || e.isPrivate) {
      return false
    }
    let isat = e.message.some((item) => item.type === 'at')
    if (!isat) return false
    let atItem = e.message.filter((item) => item.type === 'at')
    let B = atItem[0].qq //后手

    if (A == B) {
      e.reply('你还跟自己修炼上了是不是?')
      return false
    }
    let ifexistplay_B = await existplayer(B)
    if (!ifexistplay_B) {
      e.reply('修仙者不可对凡人出手!')
      return false
    }
    //这里前戏做完,确定要开打了
    let final_msg = [segment.at(A), segment.at(B), '\n']
    let A_player = await Read_player(A)
    let B_player = await Read_player(B)
    final_msg.push(`${A_player.name}向${B_player.name}发起了切磋。`)
    A_player.法球倍率 = A_player.talent.法球倍率
    B_player.法球倍率 = B_player.talent.法球倍率
    A_player.now_bool = A_player.血量上限
    B_player.now_bool = B_player.血量上限
    let Data_battle = await zd_battle(A_player, B_player)
    let msg = Data_battle.msg
    await ForwardMsg(e, msg)
    //最后发送消息
    e.reply(final_msg)
    return false
  }
}
