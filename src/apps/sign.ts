import { Messages,EventType } from 'yunzai/core'
import RedisClient from '../model/redis'
import { DB } from '../model/db-system'

const message = new Messages()

message.response(/(#|\/)?签到$/, async (e: EventType) => {
    const userData = await DB.findOne(e.user_id)
    if (!userData) {
        e.reply('操作频繁')
        return false
    }
    
    // 检查用户是否已经签到
    const exists = await RedisClient.exist('sign', e.user_id)
    const now = new Date().getTime()
    
    if (!exists) {
        const money = Math.floor(Math.random()*10) + 1
        RedisClient.set('sign', e.user_id, '今天已经签到过了',{time: now})
        userData.money += money
        await DB.create(e.user_id, userData)
        e.reply('签到成功，获得' + money + '灵石')
        return false
    }

    const data = await RedisClient.get('sign', e.user_id)
    const lastSignTime = data.time
    if (now - lastSignTime > 24 * 60 * 60 * 1000) {
        RedisClient.set('sign', e.user_id, '今天已经签到过了',{date: now})
        const money = Math.floor(Math.random()*10) + 1
        userData.money += money
        await DB.create(e.user_id, userData)
        e.reply('签到成功，获得' + money + '灵石')
        return false
    }
    
    e.reply('今天已经签到过了')
    return false
})

export default message