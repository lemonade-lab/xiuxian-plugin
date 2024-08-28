import { Messages, EventType } from 'yunzai'
import { associationDB } from '../../model/association'
import { DB } from '../../model/db-system'
import utils from '../../utils'
import { AssociationStanding } from '../../model/base'

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
      standing: 5
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
    const Id = utils.at(e)
    if (!Id) {
      e.reply('请艾特要踢出的成员')
      return
    }
    const target = await DB.findOne(Id)
    if (!target) {
      e.reply('对方数据不存在')
      return
    }
    if (!target.social.association?.id) {
      e.reply('对方没有宗门')
      return
    }
    if (target.social.association.id !== user.social.association.id) {
      e.reply('对方不在您的宗门')
      return
    }
    if (target.social.association.standing > user.social.association.standing) {
      e.reply('对方身份高于您')
      return
    }
    const association = await associationDB.get(user.social.association.id)
    if (!association) {
      e.reply('宗门不存在')
      return
    }
    association.members = association.members.filter(member => member !== Id)
    target.social.association = null
    await DB.create(Id, target)
    await associationDB.set(association.id, association)
    await e.reply(`踢出${target.name}`)
    return
  },
  [/^(#|\/)?踢出/]
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
    const level = e.msg.replace(/^(#|\/)?任命/, '').trim()
    let standing = 0
    for (const key in AssociationStanding) {
      if (AssociationStanding[key] === level) {
        standing = Number(key)
        break
      }
    }
    if (!standing) {
      e.reply('请输入正确的职位')
      return
    }
    if (standing >= user.social.association.standing) {
      e.reply('您的职位不足以任命')
      return
    }
    const Id = utils.at(e)
    if (!Id) {
      e.reply('请艾特要任命的成员')
      return
    }
    const target = await DB.findOne(Id)
    if (!target) {
      e.reply('对方数据不存在')
      return
    }
    if (!target.social.association?.id) {
      e.reply('对方没有宗门')
      return
    }
    if (target.social.association.id !== user.social.association.id) {
      e.reply('对方不在您的宗门')
      return
    }
    target.social.association.standing = standing
    await DB.create(Id, target)
    await e.reply(`任命${target.name}为${level}`)
    return
  },
  [/^(#|\/)?任命(外门弟子|内门弟子|长老|堂主|副宗主)/]
)
export default message
