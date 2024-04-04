import { type Event, plugin, define } from '../../../import.js'
import component from '../../image/index.js'
import { writeArchiveData } from '../../model/data.js'
import { getLevelById } from '../../model/level.js'
import { getRandomNumber, getUserName } from '../../model/utils.js'
import Level from '../../system/level.js'
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
    const data = Level.up(uid)
    /**
     * 突破就是以三维为基，触发一定概率的事件
     */
    const level = getLevelById(data.level_id + 1)
    if (!level.name) {
      e.reply('已达巅峰')
      return
    }
    // 计算概率
    const attack = (data.level.attack + data.base.attack) / level.attack
    const defense = (data.level.defense + data.base.defense) / level.defense
    const blood = (data.level.blood + data.base.blood) / level.blood
    // 可以突破的前提是。其中一个接近
    if (attack < 99 && attack < 99 && attack < 99) {
      e.reply('尚未感应到瓶颈')
      return
    }
    const $attack = Math.floor((attack > 100 ? 100 : attack) / 50)
    const $defense = Math.floor((defense > 100 ? 100 : defense) / 50)
    const $blood = Math.floor(blood > 100 ? 100 : blood / 50)
    const p = $attack + $defense + $blood
    const ran = getRandomNumber(40, 100)
    if (p < ran) {
      e.reply(`有${p}%的可能打破瓶颈，但是失败了~`)
      // 失败的时候,积累清0
      data.base.attack = 0
      data.base.defense = 0
      data.base.blood = 0
      writeArchiveData('player', uid, data)
      return
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
}
