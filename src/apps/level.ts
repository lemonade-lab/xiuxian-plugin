import component from '@src/image/index.js'
import {
  LEVEL_PROBABILITY_RANGE,
  LEVEL_SIZE,
  LEVEL_UP_LIMIT
} from '@src/model/config.js'
import { getLevelById } from '@src/model/level.js'
import { getRandomNumber, getUserName } from '@src/model/utils.js'
import { clearBotTask, Messages, Segment, setBotTask } from 'yunzaijs'
import { DB } from '@src/model/db-system.js'
import RedisClient from '@src/model/redis.js'
import { LevelNameMap } from '@src/model/base.js'
import image from '@src/image/index.js'

const message = new Messages('message.group')
/**
 * 突破就是以三维为基，触发一定概率的事件
 */
message.use(
  async e => {
    // 获取账号
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    if (data.level_id === 37) {
      e.reply('须渡劫才能前往仙界')
      return
    }
    // 寻找下一个境界
    const level = getLevelById(data.level_id + 1)
    if (!level.name) {
      e.reply('已达巅峰')
      return
    }
    // 得到当前境界
    const NowLevel = getLevelById(data.level_id)

    // 得到当前三维 百分比值
    const obj = {
      attack: Math.floor(
        ((NowLevel.attack + data.base.attack) / level.attack) * 100
      ),
      defense: Math.floor(
        ((NowLevel.defense + data.base.defense) / level.defense) * 100
      ),
      blood: Math.floor(
        ((NowLevel.blood + data.base.blood) / level.blood) * 100
      )
    }
    /**
     * 可以突破的前提是，其中一个数值超过境界限制。
     */
    if (
      obj.attack < LEVEL_UP_LIMIT &&
      obj.defense < LEVEL_UP_LIMIT &&
      obj.blood < LEVEL_UP_LIMIT
    ) {
      // 对三维 进行 从大到小排序 sort((a, b) => b - a)
      // 从小到大为 sort((a, b) => a - b)
      const max = [obj.attack, obj.defense, obj.blood].sort((a, b) => b - a)
      // 瓶颈，指的是有一个数值最接近
      e.reply(`尚未感应到瓶颈(${max[0]}%/${LEVEL_UP_LIMIT}%)`)
      return
    }
    // 修正大于100的值。并削弱一定倍数。
    const $attack = Math.floor(
      (obj.attack > 100 ? 100 : obj.attack) / LEVEL_SIZE[0]
    )
    // 修正大于100的值。并削弱一定倍数。
    const $defense = Math.floor(
      (obj.defense > 100 ? 100 : obj.defense) / LEVEL_SIZE[1]
    )
    // 修正大于100的值。并削弱一定倍数。
    const $blood = Math.floor(obj.blood > 100 ? 100 : obj.blood / LEVEL_SIZE[2])
    // 最低 30？ 最大不过  75的概率。
    const p = $attack + $defense + $blood
    // 产生随机数  40 -100 之间
    const ran = getRandomNumber(
      LEVEL_PROBABILITY_RANGE[0],
      LEVEL_PROBABILITY_RANGE[1]
    )
    // 不管成功失败都全部清零
    data.base.attack = 0
    data.base.defense = 0
    data.base.blood = 0
    if (p < ran) {
      e.reply(`有${p}%的可能打破瓶颈，但是失败了呢`)
      DB.create(uid, data)
      return
    }
    // 境界+1
    data.level_id += 1
    // 存入数据
    DB.create(uid, data)
    // 修正名字
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.message(data, uid).then(img => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') {
        e.reply(Segment.image(img))
      } else {
        e.reply('图片生成失败~')
      }
    })
    return false
  },
  [/^(#|\/)?突破$/]
)

message.use(
  async e => {
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    if (data.level_id < 37) {
      e.reply('你不是渡劫期，怎么的，想挨批？')
      return
    }
    if (data.level_id > 37) {
      e.reply('你都已经成仙了，还想渡劫？')
      return
    }
    const level = getLevelById(data.level_id + 1)
    if (!level.name) {
      e.reply('已达巅峰')
      return
    }
    const taken = await RedisClient.get('taken', uid)
    if (taken.type) {
      e.reply('渡劫中，请稍等')
      return
    }
    // 得到当前境界
    const NowLevel = getLevelById(data.level_id)

    // 得到当前三维 百分比值
    const obj = {
      attack: Math.floor(
        ((NowLevel.attack + data.base.attack) / level.attack) * 100
      ),
      defense: Math.floor(
        ((NowLevel.defense + data.base.defense) / level.defense) * 100
      ),
      blood: Math.floor(
        ((NowLevel.blood + data.base.blood) / level.blood) * 100
      )
    }
    /**
     * 可以突破的前提是，其中一个数值超过境界限制。
     */
    if (
      obj.attack < LEVEL_UP_LIMIT &&
      obj.defense < LEVEL_UP_LIMIT &&
      obj.blood < LEVEL_UP_LIMIT
    ) {
      // 对三维 进行 从大到小排序 sort((a, b) => b - a)
      // 从小到大为 sort((a, b) => a - b)
      const max = [obj.attack, obj.defense, obj.blood].sort((a, b) => b - a)
      // 瓶颈，指的是有一个数值最接近
      e.reply(`尚未感应到瓶颈(${max[0]}%/${LEVEL_UP_LIMIT}%)`)
      return
    }
    const defense = data.base.defense

    // TODO: 渡劫
    const ran = getRandomNumber(0, 9)
    const a: any = {}
    switch (true) {
      case ran < 4:
        a.name = '一九天劫'
        a.num = 9
        break
      case ran < 7:
        a.name = '三九天劫'
        a.num = 27
        break
      case ran < 9:
        a.name = '七九天劫'
        a.num = 63
        break
      case ran < 10:
        a.name = '九九天劫'
        a.num = 81
        break
      default:
        a.name = '九九天劫'
        a.num = 81
        break
    }
    e.reply(`渡劫开始，你需要渡过${a.name}，一共${a.num}次攻击！`)

    await RedisClient.set('taken', uid, '渡劫中...', {
      time: Date.now()
    })
    let count = 0
    const task = setBotTask(async () => {
      count++

      const data = await DB.findOne(uid)
      if (!data) return

      if (count > a.num) {
        clearBotTask(task)
        e.reply(`渡劫成功！`)
        data.level_id += 1

        // 不管成功失败都全部清零
        data.base.attack = 0
        data.base.defense = 0
        data.base.blood = 0
        await DB.create(uid, data)
        await RedisClient.del('taken', uid)

        await e.reply(`你已成功突破到${LevelNameMap[data.level_id]}！`)
        return
      }

      // 计算伤害
      let dam =
        getRandomNumber(2000 + count * 100, 12000 + count * 250) -
        Math.floor(defense * 0.627)
      if (dam < 0) dam = 0
      data.blood -= dam
      await DB.create(uid, data)
      e.reply(`渡劫中...第${count}次攻击！\n受到伤害${dam}`)

      // 如果血量小于0，则失败
      if (data.blood <= 0) {
        e.reply(`渡劫失败！`)
        data.blood = 0

        // 不管成功失败都全部清零
        data.base.attack = 0
        data.base.defense = 0
        data.base.blood = 0
        await DB.create(uid, data)
        await RedisClient.del('taken', uid)
        clearBotTask(task)
        return
      }
    }, '0/5 * * * * ?')
  },
  [/^(#|\/)?渡劫$/]
)

message.use(
  async e => {
    const ran = getRandomNumber(0, 9)
    const a: any = {}
    switch (true) {
      case ran < 4:
        a.name = '一九天劫'
        a.num = 9
        break
      case ran < 7:
        a.name = '三九天劫'
        a.num = 27
        break
      case ran < 9:
        a.name = '七九天劫'
        a.num = 63
        break
      case ran < 10:
        a.name = '九九天劫'
        a.num = 81
        break
      default:
        a.name = '九九天劫'
        a.num = 81
        break
    }
    e.reply(`你需要渡过${a.name}`)
  },
  [/^(#|\/)?渡劫抽卡$/]
)

message.use(
  async e => {
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    const level = getLevelById(data.level_id + 1)
    if (!level.name) {
      e.reply('已达巅峰')
      return
    }
    const NowLevel = getLevelById(data.level_id)
    const obj = {
      attack: Math.floor(
        ((NowLevel.attack + data.base.attack) / level.attack) * 100
      ),
      defense: Math.floor(
        ((NowLevel.defense + data.base.defense) / level.defense) * 100
      ),
      blood: Math.floor(
        ((NowLevel.blood + data.base.blood) / level.blood) * 100
      )
    }
    if (
      obj.attack < LEVEL_UP_LIMIT &&
      obj.defense < LEVEL_UP_LIMIT &&
      obj.blood < LEVEL_UP_LIMIT
    ) {
      e.reply(
        ` 距离突破仍有一段距离\n 当前攻击：${obj.attack}%\n 当前防御：${obj.defense}%\n 当前血量：${obj.blood}%`
      )
      return
    }

    const $attack = Math.floor(
      (obj.attack > 100 ? 100 : obj.attack) / LEVEL_SIZE[0]
    )
    const $defense = Math.floor(
      (obj.defense > 100 ? 100 : obj.defense) / LEVEL_SIZE[1]
    )
    const $blood = Math.floor(obj.blood > 100 ? 100 : obj.blood / LEVEL_SIZE[2])
    const p = $attack + $defense + $blood

    e.reply(`当前突破概率: ${p}\nPS: 低于40%时不可能成功哦`)
    return false
  },
  [/^(#|)?查看突破概率$/]
)

message.use(
  async e => {
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    const level = getLevelById(data.level_id + 1)
    if (!level.name) {
      e.reply('已达巅峰')
      return
    }
    const levelList = []
    for (let i = 0; i < 10; i++) {
      if (LevelNameMap[data.level_id + i]) {
        levelList.push(data.level_id + i)
      }
    }

    const img = await image.levelList(levelList)
    if (img) await e.reply(Segment.image(img))
    return false
  },
  [/^(#|\/)?练气境界$/]
)

export default message
