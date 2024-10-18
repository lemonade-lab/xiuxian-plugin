import { Messages, setBotTask } from 'yunzaijs'
import RedisClient from '@src/model/redis'
import { DB } from '@src/model/db-system'

const message = new Messages('message.group')

message.use(
  async e => {
    const userData = await DB.findOne(e.user_id)
    if (!userData) {
      e.reply('操作频繁')
      return false
    }

    // 检查用户是否已经签到
    const exists = await RedisClient.exist('sign', e.user_id)
    const now = new Date().getTime()

    if (exists) {
      e.reply('今天已经签到过了')
      return false
    }
    const money = Math.floor(Math.random() * 10) + 1

    await RedisClient.set('sign', e.user_id, '签到', { time: now })
    userData.money += money
    await DB.create(e.user_id, userData)
    e.reply('签到成功,获得' + money + '灵石')
    return false
  },
  [/(#|\/)?签到$/]
)

//每天晚上12点清空签到记录
const job = setBotTask(async () => {
  await RedisClient.delKeysWithPrefix('sign')
  console.log('签到记录已清空')
}, '0 0 0 * * *')
job.on('error', err => {
  console.error('签到记录清空失败', err)
})

export default message
