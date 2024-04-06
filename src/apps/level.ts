import { type Event, plugin, define } from '../import.js'
import component from '../image/index.js'
import {
  LEVEL_PROBABILITY_RANGE,
  LEVEL_SIZE,
  LEVEL_UP_LIMIT
} from '../model/config.js'
import { writeArchiveData } from '../model/data.js'
import { getLevelById } from '../model/level.js'
import { getUserMessageByUid } from '../model/message.js'
import { getRandomNumber, getUserName } from '../model/utils.js'
export class level extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?突破$/,
          fnc: 'levelUp'
        }
      ]
    })
  }
  /**
   * 突破
   * @param e
   * @returns
   */
  async levelUp(e: Event) {
    // 获取账号
    const uid = e.user_id
    const data = getUserMessageByUid(uid)
    /**
     * 突破就是以三维为基，触发一定概率的事件
     */
    const level = getLevelById(data.level_id + 1)
    if (!level.name) {
      e.reply('已达巅峰')
      return
    }
    const NowLevel = getLevelById(data.level_id)
    // 计算概率
    const attack = Math.floor(
      ((NowLevel.attack + data.base.attack) / level.attack) * 100
    )
    const defense = Math.floor(
      ((NowLevel.defense + data.base.defense) / level.defense) * 100
    )
    const blood = Math.floor(
      ((NowLevel.blood + data.base.blood) / level.blood) * 100
    )
    // 可以突破的前提是。其中一个接近
    if (
      attack < LEVEL_UP_LIMIT &&
      defense < LEVEL_UP_LIMIT &&
      blood < LEVEL_UP_LIMIT
    ) {
      const max =
        attack > defense
          ? attack > blood
            ? attack
            : blood
          : defense > blood
          ? defense
          : blood
      e.reply(`尚未感应到瓶颈(${max}%/99%)`)
      return
    }
    const $attack = Math.floor((attack > 100 ? 100 : attack) / LEVEL_SIZE[0])
    const $defense = Math.floor((defense > 100 ? 100 : defense) / LEVEL_SIZE[1])
    const $blood = Math.floor(blood > 100 ? 100 : blood / LEVEL_SIZE[2])
    // 最低 30？ 最大不过  75的概率。
    const p = $attack + $defense + $blood
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
      writeArchiveData('player', uid, data)
      return
    }
    data.level_id += 1
    writeArchiveData('player', uid, data)
    // 修正名字
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.message(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}
