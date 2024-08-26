import { Messages, EventType } from 'yunzai'
import { associationDB } from '../../model/association'
import { DB } from '../../model/db-system'

const message = new Messages('message.group')

message.use(
  async (e: EventType) => {
    const user = await DB.findOne(e.user_id)
    if (!user) {
      e.reply('数据繁忙')
      return
    }
    if (user.social.association?.id) {
      e.reply('您已经加入宗门')
      return
    }
    if (user.level_id < 25) {
      e.reply('您的修为不足')
      return
    }
    const name = e.msg.replace(/^(#|\/)?创建宗门/, '').trim()
    if (!name) {
      e.reply('请输入宗门名称')
      return
    }
    const can = await associationDB.checkName(name)
    if (can) {
      e.reply('宗门名称重复')
      return
    }
    const association = await associationDB.create(name, e.user_id)
    user.social.association = {
      id: association.id,
      standing: 4
    }
    await DB.create(e.user_id, user)
    e.reply(`宗门${name}创建成功`)
    return
  },
  [/^(#|\/)创建宗门/]
)

message.use(
  async (e: EventType) => {
    const user = await DB.findOne(e.user_id)
    if (!user) {
      e.reply('数据繁忙')
      return
    }
    if (!user.social.association?.id) {
      e.reply('您还没有宗门')
      return
    }
    const association = await associationDB.get(user.social.association.id)
    if (!association) {
      e.reply('宗门不存在')
      return
    }
    const newName = e.msg.replace(/^(#|\/)?宗门改名/, '').trim()
    if (!newName) {
      e.reply('请输入新的宗门名称')
      return
    }
    const can = await associationDB.checkName(newName)
    if (can) {
      e.reply('宗门名称重复')
      return
    }
    association.name = newName
    await associationDB.set(association.id, association)
    e.reply(`宗门改名${newName}`)
    return
  },
  [/^(#|\/)?宗门改名/]
)
export default message
