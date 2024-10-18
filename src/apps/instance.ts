import { Messages, setBotTask, Bot, Segment } from 'yunzaijs'
import { DB } from '@src/model/db-system'
import { InstanceList, InstanceSettleAccount } from '@src/model/instance'
import redisClient from '@src/model/redis'
import utils from '@src/utils'
import { LevelNameMap } from '@src/model/base'
import { INSTANCE_CD } from '@src/model/config'
import image from '@src/image/index'

const message = new Messages('message.group')

message.use(
  async e => {
    const msg = ['秘境列表']
    for (const item of InstanceList) {
      msg.push(
        `【${item.name}】 价格: ${item.price} \n 等级要求: ${
          LevelNameMap[item.min_level]
        } \n 描述: ${item.desc} `
      )
    }
    utils.forwardMsg(e, msg)
  },
  [/^(#|\/)?秘境/]
)
message.use(
  async e => {
    const [data, ping, status] = await Promise.all([
      DB.findOne(e.user_id),
      redisClient.get('door', e.user_id),
      redisClient.get('instance', e.user_id)
    ])

    if (!data) {
      e.reply('请先创建角色')
      return
    }
    if (data.blood <= 50) {
      e.reply('血量过低，无法探索秘境')
      return
    }
    if (ping.type) {
      e.reply(ping.msg)
      return
    }
    if (status.type) {
      e.reply(status.msg)
      return
    }
    const msg = e.msg.replace(/^(#|\/)?探索秘境/, '')
    if (!msg) {
      e.reply('请输入秘境名称')
      return
    }
    const instance = InstanceList.find(item => item.name === msg)
    if (!instance) {
      e.reply('秘境不存在')
      return
    }
    if (data.level_id < instance.min_level) {
      e.reply(`你的等级不足，无法探索【${instance.name}】`)
      return
    }
    if (data.money < instance.price) {
      e.reply(`你连门票钱都付不起！`)
      return
    }

    redisClient.set('instance', e.user_id, '探索中...', {
      instance_id: instance.id,
      time: Date.now(),
      group_id: e.group_id
    })
    data.money -= instance.price
    await DB.create(data.uid, data)
    e.reply(`开始探索【${instance.name}】`)
  },
  [/^(#|\/)?探索秘境/]
)

setBotTask(async () => {
  const list = await redisClient.keys('instance')
  const msgList = []

  if (!list.length) return
  for (const item of list) {
    const id = item.replace('instance:', '')
    const data = await redisClient.get('instance', id)
    if (!data.type) continue
    const player = await DB.findOne(id)
    if (!player) continue
    const instance = InstanceList.find(
      item => item.id === data.data.instance_id
    )
    if (Date.now() - data.data.time > INSTANCE_CD) {
      await redisClient.del('instance', id)
      const { msg, user } = InstanceSettleAccount(instance.name, player)
      await DB.create(user.uid, user)
      msgList.push({
        uid: user.uid,
        group: data.data.group_id,
        msg: user.name + msg.join('\n')
      })
    }
  }
  if (msgList.length === 0) return
  if (msgList.length > 1) {
    const groupList = [...new Set(msgList.map(item => item.group))]
    for (const group of groupList) {
      const msg = msgList.filter(item => item.group === group)
      if (msg.length > 1) {
        const img = await image.msgList(msg)
        const user = msg.map(item => item.uid)
        await Bot.pickGroup(group).sendMsg(user.map(item => Segment.at(item)))
        if (img) await Bot.pickGroup(group).sendMsg(Segment.image(img))
      } else {
        await Bot.pickGroup(group).sendMsg([Segment.at(msg[0].uid), msg[0].msg])
      }
    }
  } else {
    await Bot.pickGroup(msgList[0].group).sendMsg([
      Segment.at(msgList[0].uid),
      msgList[0].msg
    ])
  }
}, '0 0/1 * * * ? ')
export default message
