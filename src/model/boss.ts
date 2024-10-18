import { getBaseVal } from '@src/system/battle'
import { getLevelById } from '@src/model/level'
import { UserMessageType } from '@src/model/types'

export class Boss {
  name: string
  level_id: number
  blood: number
  attack: number
  defense: number
  constructor(name: string, level_id: number) {
    this.name = name
    this.level_id = level_id
    const { attack, defense, blood } = getLevelById(level_id)
    this.attack = attack
    this.defense = Math.floor(defense * 1.5)
    this.blood = Math.floor(blood * 5)
  }
}

export const getBossLevel = (user_Level: number) => {
  let level_id = 0
  //根据玩家等级获取boss等级
  switch (true) {
    case user_Level < 13:
      level_id = 13
      break
    case user_Level < 17:
      level_id = 17
      break
    case user_Level < 21:
      level_id = 21
      break
    case user_Level < 25:
      level_id = 25
      break
    case user_Level < 29:
      level_id = 29
      break
    case user_Level < 33:
      level_id = 33
      break
    case user_Level < 37:
      level_id = 37
      break
    case user_Level < 45:
      level_id = user_Level + 1
      break
    case user_Level < 99:
      level_id = user_Level + 2
      break
    default:
      level_id = 100
  }
  return level_id
}

export function attackBoss(user: UserMessageType, boss: Boss) {
  const { attack, defense } = getBaseVal(user)

  //攻击boss
  const msg = [`${user.name}向${boss.name}发起了攻击`]
  const damage =
    Math.floor(attack * 0.8 - boss.defense * 0.5) > 0
      ? Math.floor(attack * 0.8 - boss.defense * 0.5)
      : 0
  boss.blood -= damage
  if (damage > 0) msg.push(`${user.name}对${boss.name}造成了${damage}点伤害`)
  else msg.push(`${user.name}攻击无效`)
  if (boss.blood <= 0) {
    msg.push(`${user.name}击败了${boss.name}`)
    return { msg, user, boss, damage }
  }
  const boos_damage =
    Math.floor(boss.attack * 0.8 - defense * 0.5) > 0
      ? Math.floor(boss.attack * 0.8 - defense * 0.5)
      : 0
  user.blood -= boos_damage
  msg.push(`${boss.name}对${user.name}造成了${boos_damage}点伤害`)
  if (user.blood <= 0) msg.push(`${user.name}已无力再战，请休息后再来`)
  return { msg, user, boss, damage }
}
