import { EventType, Messages, Segment } from 'yunzaijs'
import { DB } from '@src/model/db-system'
import { associationDB } from '@src/model/association'
import image from '@src/image'

const message = new Messages('message')

message.use(
  async (e: EventType) => {
    const associations = await associationDB.getList()
    const msg = []
    associations.map((item, index) => {
      msg.push(`${index + 1}. ${item.name}\n`)
    })
    const img = await image.msgList(msg)
    if (img) e.reply(Segment.image(img))
    return
  },
  [/^(#|\/)?宗门列表/]
)

message.use(
  async (e: EventType) => {
    const user = await DB.findOne(e.user_id)
    if (!user) {
      e.reply('数据繁忙')
      return
    }
    if (!user.social.association?.id) {
      e.reply('您还未加入宗门')
      return
    }
    const association = await associationDB.get(user.social.association.id)
    if (!association) {
      e.reply('宗门不存在')
      return
    }
    console.log(association)

    const img = await image.association(association)
    if (img) e.reply(Segment.image(img))
    return
  },
  [/^(#|\/)?宗门信息/]
)

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
    const name = e.msg.replace(/^(#|\/)?加入宗门/, '').trim()
    if (!name) {
      e.reply('请输入宗门名称')
      return
    }
    const association = await associationDB.getByName(name)
    console.log(association)

    if (!association) {
      e.reply('宗门不存在')
      return
    }
    user.social.association = {
      id: association.id,
      standing: 0
    }
    association.members.push(e.user_id)
    await associationDB.set(association.id, association)
    await DB.create(e.user_id, user)
    e.reply(`加入宗门${name}成功`)
    return
  },
  [/^(#|\/)?加入宗门/]
)

message.use(
  async (e: EventType) => {
    const user = await DB.findOne(e.user_id)
    if (!user) {
      e.reply('数据繁忙')
      return
    }
    if (!user.social.association?.id) {
      e.reply('您还未加入宗门')
      return
    }
    if (user.social.association.standing == 5) {
      e.reply('您是宗主，无法退出宗门')
      return
    }
    const association = await associationDB.get(user.social.association.id)
    if (!association) {
      e.reply('宗门不存在')
      return
    }
    association.members = association.members.filter(id => id !== e.user_id)
    await associationDB.set(association.id, association)
    user.social.association = null
    await DB.create(e.user_id, user)
    e.reply(`退出宗门${association.name}成功`)
    return
  },
  [/^(#|\/)?退出宗门/]
)

export default message
