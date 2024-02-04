import { readdirSync } from 'fs'
import {
  Add_money,
  ForwardMsg,
  Add_HP,
  Harm,
  zd_battle,
  getConfig,
  data,
  __PATH
} from '../../model/index.js'
import { common, plugin } from '../../../import.js'
let WorldBOSSBattleCD = [] //CD
let WorldBOSSBattleLock = null //BOSS战斗锁，防止打架频率过高造成奖励多发
let WorldBOSSBattleUnLockTimer = null //防止战斗锁因意外锁死

export class BOSS extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_修仙_BOSS',
      dsc: 'BOSS模块',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: /^(#|\/)开启妖王$/,
          fnc: 'CreateWorldBoss'
        },
        {
          reg: /^(#|\/)关闭妖王$/,
          fnc: 'DeleteWorldBoss'
        },
        {
          reg: /^(#|\/)妖王状态$/,
          fnc: 'LookUpWorldBossStatus'
        },
        {
          reg: /^(#|\/)妖王贡献榜$/,
          fnc: 'ShowDamageList'
        },
        {
          reg: /^(#|\/)讨伐妖王$/,
          fnc: 'WorldBossBattle'
        }
      ]
    })
    this.task = {
      cron: data.test.BossTask,
      name: 'BossTask',
      fnc: () => this.InitWorldBoss()
    }
  }

  //妖王开启指令
  async CreateWorldBoss(e) {
    if (!e || e.isMaster) {
      await InitWorldBoss()
      return false
    }
  }

  //妖王结束指令
  async DeleteWorldBoss(e) {
    if (e.isMaster) {
      if (await BossIsAlive()) {
        await redis.del('Xiuxian:WorldBossStatus')
        await redis.del('xiuxian@1.4.0Record')
        e.reply('妖王挑战关闭！')
      } else e.reply('妖王未开启')
    } else return false
  }
  //妖王状态指令
  async LookUpWorldBossStatus(e) {
    if (await BossIsAlive()) {
      let WorldBossStatusStr = JSON.parse(
        await redis.get('Xiuxian:WorldBossStatus')
      )
      if (new Date().getTime() - WorldBossStatusStr.KilledTime < 86400000) {
        e.reply(`妖王正在刷新,21点开启`)
        return false
      } else if (WorldBossStatusStr.KilledTime != -1) {
        if ((await InitWorldBoss()) == false)
          await this.LookUpWorldBossStatus(e)
        return false
      }
      let ReplyMsg = [
        `----妖王状态----\n攻击:????????????\n防御:????????????\n血量:${WorldBossStatusStr.Health}\n奖励:${WorldBossStatusStr.Reward}`
      ]
      e.reply(ReplyMsg)
    } else e.reply('妖王未开启！')
    return false
  }

  //妖王伤害贡献榜
  async ShowDamageList(e) {
    if (await BossIsAlive()) {
      let WorldBossStatusStr = JSON.parse(
        await redis.get('Xiuxian:WorldBossStatus')
      )
      let PlayerRecord = JSON.parse(await redis.get('xiuxian@1.4.0Record'))
      let PlayerList = await SortPlayer(PlayerRecord)
      if (!PlayerRecord?.Name) {
        e.reply('还没人挑战过妖王')
        return false
      }
      let CurrentQQ
      let TotalDamage = 0
      for (
        let i = 0;
        i < (PlayerList.length <= 20 ? PlayerList.length : 20);
        i++
      )
        TotalDamage += PlayerRecord.TotalDamage[PlayerList[i]]
      let msg = ['****妖王周本贡献排行榜****']
      for (let i = 0; i < PlayerList.length; i++) {
        if (i < 20) {
          let Reward = Math.trunc(
            (PlayerRecord.TotalDamage[PlayerList[i]] / TotalDamage) *
              WorldBossStatusStr.Reward
          )
          Reward = Reward < 200000 ? 200000 : Reward
          msg.push(
            '第' +
              `${i + 1}` +
              '名:\n' +
              `名号:${PlayerRecord.Name[PlayerList[i]]}` +
              '\n' +
              `总伤害:${PlayerRecord.TotalDamage[PlayerList[i]]}` +
              `\n${
                WorldBossStatusStr.Health == 0 ? `已得到money` : `预计得到money`
              }:${Reward}`
          )
        }
        if (PlayerRecord.QQ[PlayerList[i]] == e.user_id) CurrentQQ = i + 1
      }
      await ForwardMsg(e, msg)
      await sleep(1000)
      if (CurrentQQ)
        e.reply(
          `你在妖王周本贡献排行榜中排名第${CurrentQQ}，造成伤害${
            PlayerRecord.TotalDamage[PlayerList[CurrentQQ - 1]]
          }，再接再厉！`
        )
    } else e.reply('妖王未开启！')
    return false
  }
  //与妖王战斗
  async WorldBossBattle(e) {
    if (e.isPrivate) return false

    if (!(await BossIsAlive())) {
      e.reply('妖王未开启！')
      return false
    }
    let user_id = e.user_id
    let Time = 5
    let now_Time = new Date().getTime() //获取当前时间戳
    Time = 60000 * Time
    let last_time = Number(
      await redis.get('xiuxian@1.4.0:' + user_id + 'BOSSCD')
    ) //获得上次的时间戳,
    if (now_Time < last_time + Time) {
      let Couple_m = Math.trunc((last_time + Time - now_Time) / 60 / 1000)
      let Couple_s = Math.trunc(((last_time + Time - now_Time) % 60000) / 1000)
      e.reply('正在CD中，' + `剩余cd:  ${Couple_m}分 ${Couple_s}秒`)
      return false
    }
    if (data.existData('player', user_id)) {
      let player = await data.getData('player', user_id)
      if (player.level_id < 42 && player.lunhui == 0) {
        e.reply('你在仙界吗')
        return false
      }
      let action = JSON.parse(
        await redis.get('xiuxian@1.4.0:' + user_id + ':action')
      )
      if (action != null) {
        let action_end_time = action.end_time
        let now_time = new Date().getTime()
        if (now_time <= action_end_time) {
          let m = (action_end_time - now_time) / 1000 / 60
          let s = (action_end_time - now_time - m * 60 * 1000) / 1000
          e.reply('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒')
          return false
        }
      }
      if (player.当前血量 <= player.血量上限 * 0.1) {
        e.reply('还是先疗伤吧，别急着参战了')
        return false
      }
      if (WorldBOSSBattleCD[user_id]) {
        let Seconds = Math.trunc(
          (300000 - (new Date().getTime() - WorldBOSSBattleCD[user_id])) / 1000
        )
        if (Seconds <= 300 && Seconds >= 0) {
          e.reply(
            `刚刚一战消耗了太多气力，还是先歇息一会儿吧~(剩余${Seconds}秒)`
          )
          return false
        }
      }
      let PlayerRecord = await redis.get('xiuxian@1.4.0Record')
      let WorldBossStatus = JSON.parse(
        await redis.get('Xiuxian:WorldBossStatus')
      )
      if (new Date().getTime() - WorldBossStatus.KilledTime < 86400000) {
        e.reply(`妖王正在刷新,21点开启`)
        return false
      } else if (WorldBossStatus.KilledTime != -1) {
        if ((await InitWorldBoss()) == false) await this.WorldBossBattle(e)
        return false
      }
      let PlayerRecordJSON, Userid
      if (PlayerRecord == '0') {
        let QQGroup = [],
          DamageGroup = [],
          Name = []
        QQGroup[0] = user_id
        DamageGroup[0] = 0
        Name[0] = player.名号
        PlayerRecordJSON = {
          QQ: QQGroup,
          TotalDamage: DamageGroup,
          Name: Name
        }
        Userid = 0
      } else {
        PlayerRecordJSON = JSON.parse(PlayerRecord)
        let i
        for (i = 0; i < PlayerRecordJSON.QQ.length; i++) {
          if (PlayerRecordJSON.QQ[i] == user_id) {
            Userid = i
            break
          }
        }
        if (!Userid && Userid != 0) {
          PlayerRecordJSON.QQ[i] = user_id
          PlayerRecordJSON.Name[i] = player.名号
          PlayerRecordJSON.TotalDamage[i] = 0
          Userid = i
        }
      }
      let TotalDamage = 0
      let Boss = {
        名号: '妖王幻影',
        攻击: player.攻击 * (0.8 + 0.6 * Math.random()),
        防御: player.防御 * (0.8 + 0.6 * Math.random()),
        当前血量: player.血量上限 * (0.8 + 0.6 * Math.random()),
        暴击率: player.暴击率,
        灵根: player.灵根,
        法球倍率: player.灵根.法球倍率
      }
      player.法球倍率 = player.灵根.法球倍率
      if (WorldBOSSBattleUnLockTimer) clearTimeout(WorldBOSSBattleUnLockTimer)
      SetWorldBOSSBattleUnLockTimer(e)
      if (WorldBOSSBattleLock != 0) {
        e.reply('好像有人正在和妖王激战，现在去怕是有未知的凶险，还是等等吧！')
        return false
      }
      WorldBOSSBattleLock = 1
      let Data_battle = await zd_battle(player, Boss)
      let msg = Data_battle.msg
      let A_win = `${player.名号}击败了${Boss.名号}`
      let B_win = `${Boss.名号}击败了${player.名号}`
      if (msg.length <= 60) await ForwardMsg(e, msg)
      else {
        let msgg = JSON.parse(JSON.stringify(msg))
        msgg.length = 60
        await ForwardMsg(e, msgg)
        e.reply('战斗过长，仅展示部分内容')
      }
      await sleep(1000)
      if (!WorldBossStatus.Healthmax) {
        e.reply('请联系管理员重新开启!')
        return false
      }
      if (msg.find((item) => item == A_win)) {
        TotalDamage = Math.trunc(
          WorldBossStatus.Healthmax * 0.05 +
            Harm(player.攻击 * 0.85, Boss.防御) * 6
        )
        WorldBossStatus.Health -= TotalDamage
        e.reply(
          `${player.名号}击败了[${Boss.名号}],重创[妖王],造成伤害${TotalDamage}`
        )
      } else if (msg.find((item) => item == B_win)) {
        TotalDamage = Math.trunc(
          WorldBossStatus.Healthmax * 0.03 +
            Harm(player.攻击 * 0.85, Boss.防御) * 4
        )
        WorldBossStatus.Health -= TotalDamage
        e.reply(
          `${player.名号}被[${Boss.名号}]击败了,只对[妖王]造成了${TotalDamage}伤害`
        )
      }
      await Add_HP(user_id, Data_battle.A_xue)
      await sleep(1000)
      let random = Math.random()
      if (random < 0.05 && msg.find((item) => item == A_win)) {
        e.reply('这场战斗重创了[妖王]，妖王使用了古典秘籍,血量回复了20%')
        WorldBossStatus.Health += Math.trunc(WorldBossStatus.Healthmax * 0.2)
      } else if (random > 0.95 && msg.find((item) => item == B_win)) {
        TotalDamage += Math.trunc(WorldBossStatus.Health * 0.15)
        WorldBossStatus.Health -= Math.trunc(WorldBossStatus.Health * 0.15)
        e.reply(
          `危及时刻,万先盟-韩立前来助阵,对[妖王]造成${Math.trunc(
            WorldBossStatus.Health * 0.15
          )}伤害,并治愈了你的伤势`
        )
        await Add_HP(user_id, player.血量上限)
      }
      await sleep(1000)
      PlayerRecordJSON.TotalDamage[Userid] += TotalDamage
      redis.set('xiuxian@1.4.0Record', JSON.stringify(PlayerRecordJSON))
      redis.set('Xiuxian:WorldBossStatus', JSON.stringify(WorldBossStatus))
      if (WorldBossStatus.Health <= 0) {
        e.reply('妖王被击杀！玩家们可以根据贡献获得奖励！')
        await sleep(1000)
        let msg2 =
          '【全服公告】' +
          player.名号 +
          '亲手结果了妖王的性命,为民除害,额外获得1000000money奖励！'
        const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
        const groupList = await redis.sMembers(redisGlKey)
        for (const group_id of groupList) {
          await pushInfo(group_id, true, msg2)
        }
        await Add_money(user_id, 1000000)
        console.error(`[妖王] 结算:${user_id}增加奖励1000000`)

        WorldBossStatus.KilledTime = new Date().getTime()
        redis.set('Xiuxian:WorldBossStatus', JSON.stringify(WorldBossStatus))
        let PlayerList = await SortPlayer(PlayerRecordJSON)
        e.reply(
          '正在进行存档有效性检测，如果长时间没有回复请联系主人修复存档并手动按照贡献榜发放奖励'
        )
        for (let i = 0; i < PlayerList.length; i++)
          await data.getData('player', PlayerRecordJSON.QQ[PlayerList[i]])
        let Show_MAX
        let Rewardmsg = ['****妖王周本贡献排行榜****']
        if (PlayerList.length > 20) Show_MAX = 20
        else Show_MAX = PlayerList.length
        let TotalDamage = 0
        for (
          let i = 0;
          i < (PlayerList.length <= 20 ? PlayerList.length : 20);
          i++
        )
          TotalDamage += PlayerRecordJSON.TotalDamage[PlayerList[i]]
        for (let i = 0; i < PlayerList.length; i++) {
          let CurrentPlayer = await data.getData(
            'player',
            PlayerRecordJSON.QQ[PlayerList[i]]
          )
          if (i < Show_MAX) {
            let Reward = Math.trunc(
              (PlayerRecordJSON.TotalDamage[PlayerList[i]] / TotalDamage) *
                WorldBossStatus.Reward
            )
            Reward = Reward < 200000 ? 200000 : Reward
            Rewardmsg.push(
              '第' +
                `${i + 1}` +
                '名:\n' +
                `名号:${CurrentPlayer.名号}` +
                '\n' +
                `伤害:${PlayerRecordJSON.TotalDamage[PlayerList[i]]}` +
                '\n' +
                `获得money奖励${Reward}`
            )
            CurrentPlayer.money += Reward
            data.setData(
              'player',
              PlayerRecordJSON.QQ[PlayerList[i]],
              CurrentPlayer
            )
            console.error(
              `[妖王周本] 结算:${
                PlayerRecordJSON.QQ[PlayerList[i]]
              }增加奖励${Reward}`
            )
            continue
          } else {
            CurrentPlayer.money += 200000
            console.error(
              `[妖王周本] 结算:${
                PlayerRecordJSON.QQ[PlayerList[i]]
              }增加奖励200000`
            )
            data.setData(
              'player',
              PlayerRecordJSON.QQ[PlayerList[i]],
              CurrentPlayer
            )
          }
          if (i == PlayerList.length - 1)
            Rewardmsg.push('其余参与的修仙者均获得200000money奖励！')
        }
        await ForwardMsg(e, Rewardmsg)
      }
      WorldBOSSBattleCD[user_id] = new Date().getTime()
      WorldBOSSBattleLock = 0
      return false
    } else {
      e.reply('区区凡人，也想参与此等战斗中吗？')
      return false
    }
  }
}

//初始化妖王
async function InitWorldBoss() {
  let AverageDamageStruct = await GetAverageDamage()
  let player_quantity = AverageDamageStruct.player_quantity
  let AverageDamage = AverageDamageStruct.AverageDamage
  let Reward = 12000000
  WorldBOSSBattleLock = 0
  if (player_quantity == 0) {
    return -1
  }
  if (player_quantity < 5) Reward = 6000000
  let X = AverageDamage * 0.01
  console.error(`[妖王] 化神玩家总数：${player_quantity}`)
  console.error(`[妖王] 生成基数:${X}`)
  let Health = Math.trunc(X * 150 * player_quantity * 2) //血量要根据人数来
  let WorldBossStatus = {
    Health: Health,
    Healthmax: Health,
    KilledTime: -1,
    Reward: Reward
  }
  let PlayerRecord = 0
  await redis.set('Xiuxian:WorldBossStatus', JSON.stringify(WorldBossStatus))
  await redis.set('xiuxian@1.4.0Record', JSON.stringify(PlayerRecord))
  let msg = '【全服公告】妖王已经苏醒,击杀者额外获得100wmoney'
  const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
  const groupList = await redis.sMembers(redisGlKey)
  for (const group_id of groupList) {
    await pushInfo(group_id, true, msg)
  }
  return false
}

async function pushInfo(id, is_group, msg) {
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

//获取妖王是否已开启
async function BossIsAlive() {
  return (
    (await redis.get('Xiuxian:WorldBossStatus')) &&
    (await redis.get('xiuxian@1.4.0Record'))
  )
}

//排序
async function SortPlayer(PlayerRecordJSON) {
  if (PlayerRecordJSON) {
    let Temp0 = JSON.parse(JSON.stringify(PlayerRecordJSON))
    let Temp = Temp0.TotalDamage
    let SortResult = []
    Temp.sort(function (a, b) {
      return b - a
    })
    for (let i = 0; i < PlayerRecordJSON.TotalDamage.length; i++) {
      for (let s = 0; s < PlayerRecordJSON.TotalDamage.length; s++) {
        if (Temp[i] == PlayerRecordJSON.TotalDamage[s]) {
          SortResult[i] = s
          break
        }
      }
    }
    return SortResult
  }
}
//设置防止锁卡死的计时器
async function SetWorldBOSSBattleUnLockTimer(e) {
  WorldBOSSBattleUnLockTimer = setTimeout(() => {
    if (WorldBOSSBattleLock == 1) {
      WorldBOSSBattleLock = 0
      e.reply('检测到战斗锁卡死，已自动修复')
      return false
    }
  }, 30000)
}

//sleep
async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

//获取玩家平均实力和化神以上人数
async function GetAverageDamage() {
  let File = readdirSync(__PATH.player)
  File = File.filter((file) => file.endsWith('.json'))
  let temp = []
  let TotalPlayer = 0
  for (let i = 0; i < File.length; i++) {
    let this_qq = File[i].replace('.json', '')
    this_qq = this_qq
    let player = await data.getData('player', this_qq)
    let level_id = data
      .Level_list()
      .find((item) => item.level_id == player.level_id).level_id
    if (level_id >= 42) {
      temp[TotalPlayer] = parseInt(player.攻击)
      console.error(`[妖王] ${this_qq}玩家攻击:${temp[TotalPlayer]}`)
      TotalPlayer++
    }
  }
  //排序
  temp.sort(function (a, b) {
    return b - a
  })
  let AverageDamage = 0
  if (TotalPlayer > 15)
    for (let i = 2; i < temp.length - 4; i++) AverageDamage += temp[i]
  else for (let i = 0; i < temp.length; i++) AverageDamage += temp[i]
  AverageDamage =
    TotalPlayer > 15
      ? AverageDamage / (temp.length - 6)
      : temp.length == 0
      ? 0
      : AverageDamage / temp.length
  let res = {
    AverageDamage: AverageDamage,
    player_quantity: TotalPlayer
  }
  return res
}
