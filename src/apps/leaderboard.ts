import { Messages, Segment, setBotTask } from 'yunzaijs'
import { DB } from '@src/model/db-system'
import component from '@src/image/index'
import RedisClient from '@src/model/redis'
const message = new Messages('message.group')

message.use(
  async e => {
    if (e.msg.includes('灵榜')) {
      let moneyList = await RedisClient.get('leaderBoard', 'moneyList')
      if (moneyList.type == null) {
        await refreshLeaderBoard()
        moneyList = await RedisClient.get('leaderBoard', 'moneyList')
      }
      const img = await component.leaderBoard({
        type: '灵榜',
        list: moneyList.data
      })
      if (img) e.reply(Segment.image(img))
      return false
    }
    let levelList = await RedisClient.get('leaderBoard', 'levelList')
    if (levelList.type == null) {
      await refreshLeaderBoard()
      levelList = await RedisClient.get('leaderBoard', 'levelList')
    }

    const img = await component.leaderBoard({
      type: '天榜',
      list: levelList.data
    })

    if (img) e.reply(Segment.image(img))
    return false
  },
  [/(#|\/)?(灵榜)|(天榜)/]
)

const leaderBoardTask = setBotTask(refreshLeaderBoard, '0 0 0/1 * * ?')
leaderBoardTask.on('error', e => console.log('灵榜和天榜更新失败', e))

/**
 * 更新排行榜
 * @returns
 */
async function refreshLeaderBoard() {
  const all = await DB.findAll()
  if (!all || all.length == 0) return false
  const moneyList = all.sort((a, b) => b.money - a.money).slice(0, 10)
  const levelList = all.sort((a, b) => b.level_id - a.level_id).slice(0, 10)
  RedisClient.set('leaderBoard', 'moneyList', '灵榜', moneyList)
  RedisClient.set('leaderBoard', 'levelList', ' 天榜', levelList)
  console.log('灵榜和天榜更新成功')
}
export default message
