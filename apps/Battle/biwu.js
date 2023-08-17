import { plugin, verc, data } from '../../api/api.js'
import {
  existplayer,
  Read_player,
  sleep,
  ifbaoji,
  Harm,
  baojishanghai,
  ForwardMsg
} from '../../model/xiuxian.js'
let A_QQ = []
let B_QQ = []
export class biwu extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_biwu',
      dsc: '修仙模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^切磋$',
          fnc: 'biwu'
        },
        {
          reg: '^#选择技能.*$',
          fnc: 'choice'
        },
        {
          reg: '^#释放技能.*$',
          fnc: 'release'
        }
      ]
    })
  }

  async biwu(e) {
    if (!e.isMaster) return false

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
      return false
    }
    let ifexistplay_B = await existplayer(B)
    if (!ifexistplay_B) {
      e.reply('修仙者不可对凡人出手!')
      return false
    }
    if (
      B_QQ.some((item) => item.QQ == A || item.QQ == B) ||
      A_QQ.some((item) => item.QQ == A || item.QQ == B)
    ) {
      e.reply('你或他已经在战斗中了')
      return false
    }
    A_QQ.push({
      QQ: A,
      技能: [
        '四象封印',
        '桃园结义',
        '长生诀',
        '祝水咒',
        '阴风蚀骨',
        '万年俱灰',
        '心烦意乱',
        '失魂落魄',
        '玄冰封印',
        '诛仙三剑'
      ],
      选择技能: []
    })
    B_QQ.push({
      QQ: B,
      技能: [
        '四象封印',
        '桃园结义',
        '长生诀',
        '祝水咒',
        '阴风蚀骨',
        '万年俱灰',
        '心烦意乱',
        '失魂落魄',
        '玄冰封印',
        '诛仙三剑'
      ],
      选择技能: []
    })
    this.battle(e, A_QQ.length - 1)
    return false
  }

  async battle(e, num) {
    let A_player = await Read_player(A_QQ[num].QQ)
    let B_player = await Read_player(B_QQ[num].QQ)
    //策划专用
    A_player.攻击 = B_player.攻击
    A_player.防御 = B_player.防御
    A_player.当前血量 = B_player.当前血量
    A_player.血量上限 = B_player.血量上限
    A_player.暴击率 = B_player.暴击率
    //记录初始属性
    const A = JSON.parse(JSON.stringify(A_player))
    const B = JSON.parse(JSON.stringify(B_player))
    let msg_A = [`指令样式:#选择技能1,2,3\n请选择你本局携带的技能:`]
    for (const i in A_QQ[num].技能) {
      const cd = data.jineng.find((item) => item.name == A_QQ[num].技能[i]).cd
      msg_A.push(`\n${i * 1 + 1}、${A_QQ[num].技能[i]} cd:${cd}`)
    }
    let msg_B = [`指令样式:#选择技能1,2,3\n请选择你本局携带的技能:`]
    for (const i in B_QQ[num].技能) {
      const cd = data.jineng.find((item) => item.name == B_QQ[num].技能[i]).cd
      msg_B.push(`\n${i * 1 + 1}、${B_QQ[num].技能[i]} cd:${cd}`)
    }
    //推送私人
    Bot.pickMember(e.group_id, A_QQ[num].QQ).sendMsg(msg_A)
    Bot.pickMember(e.group_id, B_QQ[num].QQ).sendMsg(msg_B)
    await sleep(40000)
    let cnt = 1
    let action_A = {
      cnt: cnt,
      技能: A_QQ[num].选择技能,
      use: -1
    }
    let action_B = {
      cnt: cnt,
      技能: B_QQ[num].选择技能,
      use: -1
    }
    await redis.set(
      'xiuxian@1.3.0:' + A_QQ[num].QQ + ':bisai',
      JSON.stringify(action_A)
    )
    await redis.set(
      'xiuxian@1.3.0:' + B_QQ[num].QQ + ':bisai',
      JSON.stringify(action_B)
    )
    let buff_A = {}
    let buff_B = {}
    let msgg = []
    while (A_player.当前血量 > 0 && B_player.当前血量 > 0) {
      msg_A = [`指令样式:#释放技能1\n第${cnt}回合,是否释放以下技能:`]
      for (const i in action_A.技能) {
        action_A.技能[i].cd++
        let cd =
          data.jineng.find((item) => item.name == action_A.技能[i].name).cd -
          action_A.技能[i].cd
        if (cd < 0) cd = 0
        msg_A.push(`\n${i * 1 + 1}、${action_A.技能[i].name} cd:${cd}`)
      }
      await redis.set(
        'xiuxian@1.3.0:' + A_QQ[num].QQ + ':bisai',
        JSON.stringify(action_A)
      )
      Bot.pickMember(e.group_id, A_QQ[num].QQ).sendMsg(msg_A)

      msg_B = [`指令样式:#释放技能1\n第${cnt}回合,是否释放以下技能:`]
      for (const i in action_B.技能) {
        action_B.技能[i].cd++
        let cd =
          data.jineng.find((item) => item.name == action_B.技能[i].name).cd -
          action_B.技能[i].cd
        if (cd < 0) cd = 0
        msg_B.push(`\n${i * 1 + 1}、${action_B.技能[i].name} cd:${cd}`)
      }
      await redis.set(
        'xiuxian@1.3.0:' + B_QQ[num].QQ + ':bisai',
        JSON.stringify(action_B)
      )
      Bot.pickMember(e.group_id, B_QQ[num].QQ).sendMsg(msg_B)
      await sleep(20000)
      let msg = []
      //A
      action_A = await JSON.parse(
        await redis.get('xiuxian@1.3.0:' + A_QQ[num].QQ + ':bisai')
      )
      //清空cd
      if (action_A.技能[action_A.use]) action_A.技能[action_A.use].cd = 0
      //优先判断buff效果
      if (buff_B.四象封印) {
        buff_B.四象封印--
        msg.push(
          `${A_player.名号}因为四象封印之力，技能失效,剩余回合${buff_B.四象封印}\n`
        )
        action_A.use = -1
      }
      if (buff_B.阴风蚀骨) {
        const atk = data.jineng.find((item) => item.name == `阴风蚀骨`).pr
        A_player.攻击 *= 1 - atk
        buff_B.阴风蚀骨--
        msg.push(
          `${A_player.名号}受到侵蚀,攻击力降低${atk * 100}%,剩余回合${
            buff_B.阴风蚀骨
          }\n`
        )
      }
      if (buff_B.万年俱灰) {
        const atk = data.jineng.find((item) => item.name == `万年俱灰`).pr
        A_player.攻击 *= 1 - atk
        buff_B.万年俱灰--
        msg.push(
          `${A_player.名号}受到对方立场影响,攻击力降低${atk * 100}%,剩余回合${
            buff_B.万年俱灰
          }\n`
        )
      }
      if (buff_B.玄冰封印) {
        const bj = data.jineng.find((item) => item.name == `玄冰封印`).pr
        A_player.暴击率 = bj
        buff_B.玄冰封印--
        msg.push(
          `${A_player.名号}因为玄冰封印之力,暴击率降至${bj * 100}%,剩余回合${
            buff_B.玄冰封印
          }\n`
        )
      }
      if (buff_A.心烦意乱) {
        const def = data.jineng.find((item) => item.name == `心烦意乱`).pr
        B_player.防御 *= 1 - def
        buff_A.心烦意乱--
        msg.push(
          `${B_player.名号}心态受到影响,防御力降低${def * 100}%,剩余回合${
            buff_A.心烦意乱
          }\n`
        )
      }
      if (buff_A.失魂落魄) {
        const def = data.jineng.find((item) => item.name == `失魂落魄`).pr
        B_player.防御 *= 1 - def
        buff_A.失魂落魄--
        msg.push(
          `${B_player.名号}丢了魂,防御力降低${def * 100}%,剩余回合${
            buff_A.失魂落魄
          }\n`
        )
      }
      if (buff_A.祝水咒) {
        const hp = data.jineng.find((item) => item.name == `祝水咒`).pr
        A_player.当前血量 += Math.trunc(A_player.血量上限 * hp)
        buff_A.祝水咒--
        msg.push(
          `${A_player.名号}受到水神的洗礼,血量回复${hp * 100}%,剩余回合${
            buff_A.祝水咒
          }\n`
        )
      }
      //伤害计算
      let A_baoji = baojishanghai(A_player.暴击率)
      let A_伤害 = Harm(A_player.攻击, B_player.防御)
      let A_法球伤害 = Math.trunc(A_player.攻击 * A_player.灵根.法球倍率)
      A_伤害 = Math.trunc(A_baoji * A_伤害 + A_法球伤害 + A_player.防御 * 0.1)
      //技能判断
      if (action_A.use != -1) {
        if (action_A.技能[action_A.use].name == '四象封印') {
          buff_A.四象封印 = action_A.技能[action_A.use].last
        } else if (action_A.技能[action_A.use].name == '桃园结义') {
          B_player.当前血量 += Math.trunc(
            B_player.当前血量 * action_A.技能[action_A.use].pr
          )
          A_player.当前血量 += Math.trunc(
            A_player.当前血量 * action_A.技能[action_A.use].pr
          )
        } else if (action_A.技能[action_A.use].name == '长生诀') {
          A_player.当前血量 += Math.trunc(
            A_player.血量上限 * action_A.技能[action_A.use].pr
          )
        } else if (action_A.技能[action_A.use].name == '祝水咒') {
          buff_A.祝水咒 = action_A.技能[action_A.use].last
        } else if (action_A.技能[action_A.use].name == '阴风蚀骨') {
          buff_A.阴风蚀骨 = action_A.技能[action_A.use].last
        } else if (action_A.技能[action_A.use].name == '万年俱灰') {
          buff_A.万年俱灰 = action_A.技能[action_A.use].last
        } else if (action_A.技能[action_A.use].name == '心烦意乱') {
          buff_A.心烦意乱 = action_A.技能[action_A.use].last
        } else if (action_A.技能[action_A.use].name == '失魂落魄') {
          buff_A.失魂落魄 = action_A.技能[action_A.use].last
        } else if (action_A.技能[action_A.use].name == '玄冰封印') {
          buff_A.玄冰封印 = action_A.技能[action_A.use].last
        } else if (action_A.技能[action_A.use].name == '诛仙三剑') {
          buff_A.诛仙三剑 = action_A.技能[action_A.use].last
        }
        msg.push(`${A_player.名号}${action_A.技能[action_A.use].msg}\n`)
      }
      if (buff_A.诛仙三剑) {
        const harm = data.jineng.find((item) => item.name == `诛仙三剑`).pr
        A_伤害 *= 1 + harm
        buff_A.诛仙三剑--
        msg.push(
          `${A_player.名号}携诛仙剑影,伤害提升${harm * 100}%,剩余回合${
            buff_A.诛仙三剑
          }\n`
        )
      }
      A_伤害 = Math.trunc(A_伤害)
      B_player.当前血量 -= A_伤害
      msg.push(
        `第${cnt}回合,${A_player.名号}普通攻击，${ifbaoji(
          A_baoji
        )}造成伤害${A_伤害}，${B_player.名号}剩余血量${B_player.当前血量}\n`
      )
      if (B_player.当前血量 <= 0) {
        msgg.push(msg)
        break
      }
      //B
      action_B = await JSON.parse(
        await redis.get('xiuxian@1.3.0:' + B_QQ[num].QQ + ':bisai')
      )
      //清空cd
      if (action_B.技能[action_B.use]) action_B.技能[action_B.use].cd = 0
      //优先判断buff效果
      if (buff_A.四象封印) {
        buff_A.四象封印--
        msg.push(
          `${B_player.名号}因为四象封印之力，技能失效,剩余回合${buff_A.四象封印}\n`
        )
        action_B.use = -1
      }
      if (buff_A.阴风蚀骨) {
        const atk = data.jineng.find((item) => item.name == `阴风蚀骨`).pr
        B_player.攻击 *= 1 - atk
        buff_A.阴风蚀骨--
        msg.push(
          `${B_player.名号}受到侵蚀,攻击力降低${atk * 100}%,剩余回合${
            buff_A.阴风蚀骨
          }\n`
        )
      }
      if (buff_A.万年俱灰) {
        const atk = data.jineng.find((item) => item.name == `万年俱灰`).pr
        B_player.攻击 *= 1 - atk
        buff_A.万年俱灰--
        msg.push(
          `${B_player.名号}受到对方立场影响,攻击力降低${atk * 100}%,剩余回合${
            buff_A.万年俱灰
          }\n`
        )
      }
      if (buff_A.玄冰封印) {
        const bj = data.jineng.find((item) => item.name == `玄冰封印`).pr
        B_player.暴击率 = bj
        buff_A.玄冰封印--
        msg.push(
          `${B_player.名号}因为玄冰封印之力,暴击率降至${bj * 100}%,剩余回合${
            buff_A.玄冰封印
          }\n`
        )
      }
      if (buff_B.心烦意乱) {
        const def = data.jineng.find((item) => item.name == `心烦意乱`).pr
        A_player.防御 *= 1 - def
        buff_B.心烦意乱--
        msg.push(
          `${A_player.名号}心态受到影响,防御力降低${def * 100}%,剩余回合${
            buff_B.心烦意乱
          }\n`
        )
      }
      if (buff_B.失魂落魄) {
        const def = data.jineng.find((item) => item.name == `失魂落魄`).pr
        A_player.防御 *= 1 - def
        buff_B.失魂落魄--
        msg.push(
          `${A_player.名号}丢了魂,防御力降低${def * 100}%,剩余回合${
            buff_B.失魂落魄
          }\n`
        )
      }
      if (buff_B.祝水咒) {
        const hp = data.jineng.find((item) => item.name == `祝水咒`).pr
        B_player.当前血量 += Math.trunc(B_player.血量上限 * hp)
        buff_B.祝水咒--
        msg.push(
          `${B_player.名号}受到水神的洗礼,血量回复${hp * 100}%,剩余回合${
            buff_B.祝水咒
          }\n`
        )
      }
      let B_baoji = baojishanghai(B_player.暴击率)
      let B_伤害 = Harm(B_player.攻击, A_player.防御)
      let B_法球伤害 = Math.trunc(B_player.攻击 * B_player.灵根.法球倍率)
      B_伤害 = Math.trunc(B_baoji * B_伤害 + B_法球伤害 + B_player.防御 * 0.1)
      if (action_B.use != -1) {
        if (action_B.技能[action_B.use].name == '四象封印') {
          buff_B.四象封印 = action_B.技能[action_B.use].last
        } else if (action_B.技能[action_B.use].name == '桃园结义') {
          B_player.当前血量 += Math.trunc(
            B_player.当前血量 * action_B.技能[action_B.use].pr
          )
          A_player.当前血量 += Math.trunc(
            A_player.当前血量 * (1 + action_B.技能[action_B.use].pr)
          )
        } else if (action_B.技能[action_B.use].name == '长生诀') {
          B_player.当前血量 += Math.trunc(
            B_player.血量上限 * action_B.技能[action_B.use].pr
          )
        } else if (action_B.技能[action_B.use].name == '祝水咒') {
          buff_B.祝水咒 = action_B.技能[action_B.use].last
        } else if (action_B.技能[action_B.use].name == '阴风蚀骨') {
          buff_B.阴风蚀骨 = action_B.技能[action_B.use].last
        } else if (action_B.技能[action_B.use].name == '万年俱灰') {
          buff_B.万年俱灰 = action_B.技能[action_B.use].last
        } else if (action_B.技能[action_B.use].name == '心烦意乱') {
          buff_B.心烦意乱 = action_B.技能[action_B.use].last
        } else if (action_B.技能[action_B.use].name == '失魂落魄') {
          buff_B.失魂落魄 = action_B.技能[action_B.use].last
        } else if (action_B.技能[action_B.use].name == '玄冰封印') {
          buff_B.玄冰封印 = action_B.技能[action_B.use].last
        } else if (action_B.技能[action_B.use].name == '诛仙三剑') {
          buff_B.诛仙三剑 = action_B.技能[action_B.use].last
        }
        msg.push(`${B_player.名号}${action_B.技能[action_B.use].msg}\n`)
      }
      if (buff_B.诛仙三剑) {
        const harm = data.jineng.find((item) => item.name == `诛仙三剑`).pr
        B_伤害 *= 1 + harm
        buff_B.诛仙三剑--
        msg.push(
          `${B_player.名号}携诛仙剑影,伤害提升${harm * 100}%,剩余回合${
            buff_B.诛仙三剑
          }\n`
        )
      }
      B_伤害 = Math.trunc(B_伤害)
      A_player.当前血量 -= B_伤害
      msg.push(
        `第${cnt}回合,${B_player.名号}普通攻击，${ifbaoji(
          B_baoji
        )}造成伤害${B_伤害}，${A_player.名号}剩余血量${A_player.当前血量}`
      )
      //持续回合减少
      cnt++
      //推送私人
      Bot.pickMember(e.group_id, A_QQ[num].QQ).sendMsg(msg)
      Bot.pickMember(e.group_id, B_QQ[num].QQ).sendMsg(msg)
      msgg.push(msg)
      action_A.use = -1
      action_B.use = -1
      await redis.set(
        'xiuxian@1.3.0:' + A_QQ[num].QQ + ':bisai',
        JSON.stringify(action_A)
      )
      await redis.set(
        'xiuxian@1.3.0:' + B_QQ[num].QQ + ':bisai',
        JSON.stringify(action_B)
      )
      //回复初始属性
      A_player.攻击 = A.攻击
      A_player.防御 = A.防御
      A_player.暴击率 = A.暴击率
      B_player.攻击 = B.攻击
      B_player.防御 = B.防御
      B_player.暴击率 = B.暴击率
    }
    await ForwardMsg(e, msgg)
    await sleep(200)
    if (A_player.当前血量 <= 0) {
      e.reply(`${B_player.名号}win!`)
    } else if (B_player.当前血量 <= 0) {
      e.reply(`${A_player.名号}win!`)
    }
    //删除配置
    action_A = null
    action_B = null
    A_QQ[num].QQ = null
    B_QQ[num].QQ = null
    await redis.set(
      'xiuxian@1.3.0:' + A_QQ[num].QQ + ':bisai',
      JSON.stringify(action_A)
    )
    await redis.set(
      'xiuxian@1.3.0:' + B_QQ[num].QQ + ':bisai',
      JSON.stringify(action_B)
    )
    return false
  }

  async choice(e) {
    let jineng_name = e.msg.replace('#选择技能', '')
    let code = jineng_name.split(',')
    let msg = []
    if (A_QQ.some((item) => item.QQ == e.user_id)) {
      for (let j of A_QQ) {
        if (j.QQ == e.user_id) {
          code = code.slice(0, 3)
          for (let m in code) {
            j[`选择技能`].push(
              JSON.parse(
                JSON.stringify(
                  data.jineng.find((item) => item.name == j.技能[code[m] - 1])
                )
              )
            )
            msg.push(j.技能[code[m] - 1])
          }
        }
      }
      e.reply(`本场战斗支持以下技能\n${msg}`)
      return false
    } else if (B_QQ.some((item) => item.QQ == e.user_id)) {
      for (let j of B_QQ) {
        if (j.QQ == e.user_id) {
          code = code.slice(0, 3)
          for (let m in code) {
            j[`选择技能`].push(
              JSON.parse(
                JSON.stringify(
                  data.jineng.find((item) => item.name == j.技能[code[m] - 1])
                )
              )
            )
            msg.push(j.技能[code[m] - 1])
          }
        }
      }
      e.reply(`本场战斗支持以下技能\n${msg}`)
      return false
    }
    return false
  }

  async release(e) {
    let action = await redis.get('xiuxian@1.3.0:' + e.user_id + ':bisai')
    action = await JSON.parse(action)
    if (!action) return false
    let jineng = e.msg.replace('#释放技能', '')
    jineng = Number(jineng) - 1
    if (!action.技能[jineng]) return false
    else {
      if (
        action.技能[jineng].cd <
        data.jineng.find((item) => item.name == action.技能[jineng].name).cd
      ) {
        e.reply(`${action.技能[jineng].name}技能cd中`)
        return false
      }
    }
    action.use = jineng
    await redis.set(
      'xiuxian@1.3.0:' + e.user_id + ':bisai',
      JSON.stringify(action)
    )
    e.reply(`选择成功,下回合释放技能:${action.技能[jineng].name}`)
    return false
  }
}
