import { EquipmentNameMap } from './base'
import { UserMessageType } from './types'

export const InstanceList = [
  {
    id: 1,
    name: '试炼塔',
    min_level: 1,
    price: 100,
    failed_rate: 0.2,
    desc: '这是一个充满挑战的试炼塔，你可以在这里提升自己的实力。',
    award: {
      item: getAward(0, 8)
    }
  },
  {
    id: 2,
    name: '落日森林',
    min_level: 10,
    price: 300,
    failed_rate: 0.3,
    desc: '这是一个神秘的森林，据说里面隐藏着许多宝藏。',
    award: {
      item: getAward(8, 13)
    }
  },
  {
    id: 3,
    name: '遗迹废墟',
    min_level: 13,
    price: 800,
    failed_rate: 0.4,
    desc: '这是一个废弃的遗迹，里面充满了危险和宝藏。',
    award: {
      item: getAward(13, 17)
    }
  },
  {
    id: 4,
    name: '死亡沙漠',
    min_level: 17,
    price: 3500,
    failed_rate: 0.5,
    desc: '这是一个充满死亡气息的沙漠，只有最勇敢的人才能生存。',
    award: {
      item: getAward(17, 21)
    }
  },
  {
    id: 5,
    name: '神秘遗迹',
    min_level: 21,
    price: 6000,
    failed_rate: 0.55,
    desc: '这是一个古老的遗迹，据说里面隐藏着无尽的宝藏。',
    award: {
      item: getAward(21, 25)
    }
  },
  {
    id: 6,
    name: '龙鳞岛',
    min_level: 25,
    price: 10000,
    failed_rate: 0.6,
    desc: '传说曾有一座被称作“龙鳞岛”的岛屿，其中隐藏着无限的宝藏。',
    award: {
      item: getAward(25, 29)
    }
  },
  {
    id: 7,
    name: '破败神庙',
    min_level: 29,
    price: 15000,
    failed_rate: 0.6,
    desc: '不知是哪位神明的庙宇，竟破败到如此地步。',
    award: {
      item: getAward(29, 33)
    }
  }
]

export function InstanceSettleAccount(
  instance_name: string,
  user: UserMessageType
) {
  const ran = Math.random()
  const instance = InstanceList.find(i => i.name === instance_name)
  const msg = []
  if (!instance) {
    return
  }
  if (ran > instance.failed_rate + (user.level_id - instance.min_level) * 0.1) {
    msg.push(`探索时遇到危险，未能成功逃离`)
    user.blood = 1
  } else {
    msg.push(`【${instance.name}】探索任务完成`)
    // 保证有奖励
    let rate = 0
    for (const index in instance.award.item) {
      rate += instance.award.item[index].rate

      if (Math.random() < rate) {
        const item = instance.award.item[index]
        const id = item.id
        const item1 = user.bags.find(b => b.id === id)
        if (!item1 || item1.count === 0) {
          user.bags.push({
            id: id,
            count: item.num,
            type: item.type as any,
            name: EquipmentNameMap[id]
          })
        } else {
          item1.count += item.num
        }
        msg.push(`你获得了${item.num}个${EquipmentNameMap[id]}！`)
        break
      }
    }
    const ran = Math.random()
    if (ran < 0.3) {
      user.base.defense += Math.floor(instance.id ** 1.5 * 20)
    } else if (ran < 0.6) {
      user.base.attack += Math.floor(instance.id ** 1.5 * 60)
    } else {
      user.base.blood += Math.floor(instance.id ** 1.5 * 80)
    }
  }
  return { msg, user }
}

function getAward(start, end) {
  const list = []
  const n = end - start
  const r = 0.5 // 公比
  const a1 = (1 - r) / (1 - Math.pow(r, n)) // 首项

  for (let i = start; i < end; i++) {
    const rate = Number((a1 * Math.pow(r, i - start)).toFixed(4))
    list.push({ id: i, num: 1, rate: rate, type: 'equipment' })
  }

  return list
}
