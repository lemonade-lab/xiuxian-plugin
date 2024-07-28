import { clearBotTask, Messages, setBotTask } from 'yunzai'
import RedisClient from '../model/redis'
import { attackBoss, Boss, getBossLevel } from '../model/boss'
import { LevelNameMap } from '../model/base'
import { DB } from '../model/db-system'
import utils from '../utils'

const message = new Messages('message.group')

// 战斗锁
let WorldBOSSBattleLock = 0
let WorldBOSSBattleUnLockTimer = null
let bossTask = null
message.use(
  async e => {
    if (!e.isMaster) return false
    const level_list = await RedisClient.get('leaderBoard', 'levelList')
    if (level_list == null) return false
    const bossData = await RedisClient.get('boss', 'defender')
    if (bossData.type && bossData.data.blood > 0) {
      e.reply('喵喵已开启')
      return false
    }
    const level = level_list.data[0].level_id
    const bossLevel = getBossLevel(level)
    await e.reply([`喵喵已被唤醒！\n 喵喵等级：${LevelNameMap[bossLevel]}`])
    const boss = new Boss('喵喵', bossLevel)
    RedisClient.set('boss', 'defender', '', boss)

    // 设置喵喵刷新任务
    bossTask = setBotTask(async () => {
      await RedisClient.delKeysWithPrefix('boss')
      const newBoss = new Boss('喵喵', bossLevel)
      RedisClient.set('boss', 'defender', '', newBoss)
      await e.reply([`喵喵已刷新! \n喵喵等级: ${LevelNameMap[bossLevel]}`])
    }, '0 0 21 * * ?')
  },
  [/^(#|\/)?开启喵喵$/]
)

message.use(
  async e => {
    let bossData = await RedisClient.get('boss', 'defender')
    if (!bossData.type) {
      e.reply('喵喵未开启')
      return false
    }
    if (bossData.data.blood <= 0) {
      e.reply('喵喵已死亡,请等待喵喵刷新')
      return false
    }
    let data = await DB.findOne(e.user_id)
    if (!data) {
      e.reply('请先创建角色')
      return false
    }
    if (data.blood <= 50) {
      e.reply('你的血量太低了，无法攻击喵喵')
      return false
    }
    // 闭关检测
    const ping = await RedisClient.get('door', e.user_id)
    if (ping.type) {
      e.reply(ping.msg)
      return
    }
    const cd = await RedisClient.get('boss', 'attack:' + e.user_id)
    if (cd.type) {
      e.reply('你已攻击过喵喵，请等待5分钟')
      return false
    }
    if (WorldBOSSBattleLock) return e.reply('喵喵战斗中，请等待战斗结束')
    WorldBOSSBattleLock = 1
    await SetWorldBOSSBattleUnLockTimer(e)
    const message = []
    let allDamage = 0
    while (data.blood > 0 && bossData.data.blood > 0) {
      const { msg, user, boss, damage } = attackBoss(data, bossData.data)
      allDamage += damage
      data = user
      bossData.data = boss
      if (msg) message.push(...msg)
      if (user.blood <= 0) {
        await RedisClient.set('boss', 'defender', '', boss)
        user.blood = 1
        await DB.create(e.user_id, user)
        await addToDamageLeaderBoard(e, data, allDamage)
        break
      }
      if (boss.blood <= 0) {
        e.reply('你击败了喵喵，额外获得1000灵石')
        user.money += 1000
        boss.blood = 0
        await RedisClient.set('boss', 'defender', '', boss)
        await DB.create(e.user_id, user)
        await addToDamageLeaderBoard(e, data, allDamage)
        await settleAccount(e)
        break
      }
    }

    await utils.forwardMsg(e, message)
    WorldBOSSBattleLock = 0
  },
  [/^(#|\/)?讨伐喵喵$/]
)

message.use(
  async e => {
    if (!e.isMaster) return false
    const boss = await RedisClient.get('boss', 'defender')
    if (!boss.type) {
      e.reply('喵喵未开启')
      return false
    }
    RedisClient.delKeysWithPrefix('boss')
    if (bossTask) clearBotTask(bossTask)
    e.reply('喵喵已关闭')
  },
  [/^(#|\/)?关闭喵喵$/]
)

message.use(
  async e => {
    const boss = await RedisClient.get('boss', 'defender')
    if (!boss.type) return false
    e.reply(
      `喵喵等级：${LevelNameMap[boss.data.level_id]}\n血量: ${
        boss.data.blood
      }\n攻击力: ${boss.data.attack}\n防御力: ${boss.data.defense}`
    )
  },
  [/^(#|\/)?喵喵状态$/]
)

message.use(
  async e => {
    const damageList = await RedisClient.get('boss', 'damage')
    if (!damageList.type) return false
    const leaderBoard = damageList.data.sort((a, b) => b.damage - a.damage)
    const msg = []
    for (const item of leaderBoard) {
      msg.push(
        `第${leaderBoard.indexOf(item) + 1}名  ${item.name} 伤害：${
          item.damage
        }`
      )
    }
    await utils.forwardMsg(e, msg)
  },
  [/^(#|\/)?喵喵排行榜$/]
)

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
/**
 * 按照伤害百分比结算
 * @param e
 * @returns
 */
async function settleAccount(e) {
  const allMoney = 5000
  const damageList = await RedisClient.get('boss', 'damage')
  const msg = []
  if (!damageList) return false
  const leaderBoard = damageList.data.sort((a, b) => b.damage - a.damage)
  const allDamage = damageList.data.reduce((a, b) => a + b.damage, 0)
  for (const item of leaderBoard) {
    const data = await DB.findOne(item.user_id)
    if (!data) continue
    data.money += Math.floor(allMoney * (item.damage / allDamage))
    msg.push(
      `${data.name}获得${Math.floor(allMoney * (item.damage / allDamage))}灵石`
    )
    await DB.create(item.user_id, data)
  }
  await utils.forwardMsg(e, msg)
  RedisClient.del('boss', 'damage')
  RedisClient.delKeysWithPrefix('boss:attack')
}

/**
 * 添加到伤害排行榜
 * @param e
 * @param data
 * @param allDamage
 */
async function addToDamageLeaderBoard(e, data, allDamage) {
  const dmg = await RedisClient.get('boss', 'damage')
  if (!dmg.type) dmg.data = []
  const userDmg = dmg.data.find(item => item.user_id == e.user_id)
  if (!userDmg) {
    dmg.data.push({ user_id: e.user_id, damage: allDamage, name: data.name })
  } else {
    userDmg.damage += allDamage
    userDmg.name = data.name
  }
  await RedisClient.set('boss', 'damage', '', dmg.data)

  await RedisClient.set('boss', 'attack:' + e.user_id, '', [], { EX: 300 })
}
export default message
