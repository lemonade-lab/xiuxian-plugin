import { type Event, plugin, define } from '../../../import'
import { existsArchiveSync, writeArchiveData } from '../../model/data'
import { getDataByType, getUserMessageByUid } from '../../model/message'
import RedisClient from '../../model/redis'
import { getUserName } from '../../model/utils'
import component from '../../image/index'
import {
  DOOR_CLOSE_SIZE,
  MINING,
  MINING_BLOOL,
  MINING_MONEY
} from '../../model/config'
import { getLevelById } from '../../model/level'
import {
  EquipmentNameMap,
  KillNameMap,
  ReverseKillNameMap,
  getType,
  isDateMap
} from '../../model/base'
import { getKillById } from '../../model/kills'
import { getEuipmentById } from '../../model/equipment'
export class ping extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?闭关$/,
          fnc: 'doorOpen'
        },
        {
          reg: /^(#|\/)?出关$/,
          fnc: 'doorClose'
        },
        {
          reg: /^(#|\/)?商店$/,
          fnc: 'shoping'
        },
        {
          reg: /^(#|\/)?购买(武器|功法)/,
          fnc: 'buy'
        },
        {
          reg: /^(#|\/)?采矿$/,
          fnc: 'mining'
        }
      ]
    })
  }

  /**
   *
   * @param e
   * @returns
   */
  async doorOpen(e: Event) {
    const uid = e.user_id
    if (!existsArchiveSync('player', uid)) {
      getUserMessageByUid(uid)
    }
    const message = await RedisClient.get('door', uid)
    if (message.type) {
      e.reply(message.msg)
      return
    }
    RedisClient.set('door', uid, '闭关中...', {
      time: Date.now()
    })
    e.reply('开始两耳不闻窗外事')
    return false
  }

  /**
   * 出关
   * @param e
   * @returns
   */
  async doorClose(e: Event) {
    const uid = e.user_id
    const data = getUserMessageByUid(uid)
    const message = await RedisClient.get('door', uid)
    if (!message.type) {
      e.reply('没有在闭关哦')
      return
    }
    const time = message.data.time
    const Now = Date.now()
    // 30 s 一次
    const size = Math.floor((Now - time) / (1000 * 30))
    await RedisClient.del('door', uid)
    if (size >= 1) {
      const blool = size * DOOR_CLOSE_SIZE
      const cur = data.blood + blool
      // 还没有装备
      // const equipment = getEuipmentById()
      const equipment = {
        blood: 0
      }
      const level = getLevelById(data.level_id)
      const max = data.base.blood + equipment.blood + level.blood
      data.blood = cur > max ? max : cur
      // 后得的血量上限
      const baseBlood = Math.floor((Now - time) / (1000 * 60))
      data.base.blood += baseBlood
      writeArchiveData('player', uid, data)
    }
    // 修正名字
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.message(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }

  /**
   * 采矿
   * @param e
   * @returns
   */
  async mining(e: Event) {
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)
    // 不能在闭关
    const Biguan = await RedisClient.get('door', uid)
    if (Biguan.type) {
      e.reply(Biguan.msg)
      return
    }
    // 当前身体空虚，精血不足。
    const Minibg = await RedisClient.get('mining', uid)
    const now = Date.now()
    const time = now - (Minibg.data?.time ?? 0)
    if (Minibg.type && time <= MINING) {
      e.reply(`采集频繁，先等等${Math.floor((MINING - time) / 1000)}秒`)
      return
    }
    // 看看精血
    if (data.blood <= MINING_BLOOL) {
      e.reply('精血不足,先休息休息吧')
      return
    }
    data.blood -= MINING_BLOOL
    data.money += MINING_MONEY
    RedisClient.set('mining', uid, '采集冷却', {
      time: now
    })
    writeArchiveData('player', uid, data)
    e.reply(`采得${MINING_MONEY}块灵石`)
    return false
  }

  /**
   * 商店
   * @param e
   * @returns
   */
  async shoping(e: Event) {
    const uid = e.user_id
    const data = getUserMessageByUid(uid)
    const arr: string[] = []
    for (const item in KillNameMap) {
      const kill = getKillById(Number(item))
      arr.push(
        `${kill.id}号功法:${kill.name}-灵石:${kill.price}-天赋值:${kill.efficiency}%`
      )
    }
    for (const item in EquipmentNameMap) {
      const Euipemt = getEuipmentById(Number(item))
      arr.push(
        `${Euipemt.id}号功法:${Euipemt.name}-灵石:${Euipemt.price}-攻击:${Euipemt.attack}%-防御:${Euipemt.defense}-血量:${Euipemt.blood}`
      )
    }
    const msg = arr.slice(0, (data.level_id + 1) * 2)
    e.reply(msg.join('\n'))
    return false
  }

  /**
   * 购买
   * @param e
   * @returns
   */
  async buy(e: Event) {
    const uid = e.user_id
    // 类型转换
    const type = getType(e.msg)
    const name = e.msg
      .replace(/^(#|\/)?购买(武器|功法)/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = isDateMap(type, name)
    if (!ID) {
      e.reply(`此方世界没有《${name}》`)
      return
    }
    const data = getUserMessageByUid(uid)
    // 看看money
    const sData = getDataByType(type, Number(ID))
    if (data.money < sData.price) {
      e.reply(`灵石不足${sData.price}`)
      return
    }
    if (type === 0) {
      data.money -= sData.price
      const count = data.bags.kills[ID]
      if (!count || count <= 0) {
        data.bags.kills[ID] = 1
      } else {
        data.bags.kills[ID] += 1
      }
    } else if (type === 1) {
      data.money -= sData.price
      const count = data.bags.equipments[ID]
      if (!count || count <= 0) {
        data.bags.equipments[ID] = 1
      } else {
        data.bags.equipments[ID] += 1
      }
    } else {
      return false
    }
    // 保存
    writeArchiveData('player', uid, data)
    e.reply(`购得${name}`)
    return false
  }
}
