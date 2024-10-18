import { Messages } from 'yunzaijs'
import { DB } from '@src/model/db-system'

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
    await redis.del('xiuxian:association:all')
    const all = await DB.findAll()
    for (const user of all) {
      delete user.association
      user.social = {
        friends: [],
        association: {}
      }
      await DB.create(user.uid, user)
    }
    e.reply('清空数据')
  },
  [/^(#|\/)?修复用户数据$/]
)
export default message
