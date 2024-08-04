import { Messages } from 'yunzai'
import { DB } from '../model/db-system'

const message = new Messages('message.group')
message.use(
  async e => {
    const msg = [
      '\tversion:1.0.0',
      '更新内容：',
      '1.去除交易系统',
      '2.新增boss喵喵',
      '3.新增每日签到',
      '4.新增锻体，可增加攻击及防御',
      '5.新增连续采矿',
      '6.新增秘境探索',
      '7.新增物品出售',
      '8.调整boss收益'
    ]
    e.reply(msg.join('\n'))
  },
  [/^(#|\/)?全服更新公告$/]
)

message.use(
  async e => {
    const num = await DB.count()
    e.reply(`当前有${num}个用户注册`)
    return false
  },
  [/^(#|\/)?修仙世界$/]
)

message.use(
  async e => {
    if (!e.isMaster) return false
    const all = await DB.findAll()
    for (const user of all) {
      for (const key in user.equipment) {
        if (user.equipment[key] != null) {
          const num = Number(user.equipment[key])
          if (num < 10000) continue
          const id = num % 10000
          user.equipment[key] = String(id)
        }
      }
      for (const item of user.bags) {
        if (item.id >= 10000) item.id = String(item.id % 10000)
      }
      if (Object.keys(user.skill).length > 0) {
        for (const key in user.skill) {
          const num = Number(user.skill[key])
          if (num < 10000) continue
          const id = num % 10000
          user.skill[id] = true
        }
      }
      if (Object.keys(user.kills).length > 0) {
        for (const key in user.kills) {
          const num = Number(user.kills[key])
          if (num < 10000) {
            user.skill[key] = true
            continue
          }
          const id = num % 10000
          user.skill[id] = true
        }
        delete user.kills
      }
      await DB.create(user.uid, user)
    }
    e.reply('已重置所有用户的装备')
  },
  [/^(#|\/)?修复数据$/]
)
export default message
