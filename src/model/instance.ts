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
      money: 200,
      item: [
        { id: 0, num: 1, rate: 0.5, type: 'equipment' },
        { id: 1, num: 1, rate: 0.3, type: 'equipment' },
        { id: 2, num: 1, rate: 0.15, type: 'equipment' },
        { id: 3, num: 1, rate: 0.04, type: 'equipment' },
        { id: 4, num: 1, rate: 0.01, type: 'equipment' }
      ]
    }
  },
  {
    id: 2,
    name: '神秘森林',
    min_level: 10,
    price: 1000,
    failed_rate: 0.1,
    desc: '这是一个神秘的森林，据说里面隐藏着许多宝藏。',
    award: {
      money: 2000,
      item: [
        { id: 5, num: 1, rate: 0.4, type: 'equipment' },
        { id: 6, num: 1, rate: 0.2, type: 'equipment' },
        { id: 7, num: 1, rate: 0.15, type: 'equipment' },
        { id: 8, num: 1, rate: 0.07, type: 'equipment' },
        { id: 9, num: 1, rate: 0.04, type: 'equipment' },
        { id: 10, num: 1, rate: 0.02, type: 'equipment' },
        { id: 11, num: 1, rate: 0.01, type: 'equipment' }
      ]
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
  if (ran > instance.failed_rate + user.level_id * 0.1) {
    msg.push(`探索时遇到危险，未能成功逃离`)
    user.blood = 1
  } else {
    msg.push(`【${instance.name}】探索任务完成`)
    user.money += instance.award.money
    for (const index in instance.award.item) {
      if (Math.random() < instance.award.item[index].rate) {
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
      } else {
        const next = instance.award.item[index + 1]
        if (next) {
          next.rate += instance.award.item[index].rate
        }
      }
    }
  }
  return { msg, user }
}
