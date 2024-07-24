import { Messages, Segment } from 'yunzai'
import { DB } from '../model/db-system'
import component from '../image/index'
const message = new Messages('message.group')

message.use(
  async (e) => {
    const all = (await DB.findAll()) as Array<any>

    if (!all || all.length == 0) return false
    // 从大到小排序
    const list = all.sort((a, b) => b.money - a.money).slice(0, 10)
    const data = {
      type: '灵榜',
      list
    }
    const img = await component.leaderboard(data)
    if (img) e.reply(Segment.image(img))
    return false
  },
  [/(#|\/)?灵榜/]
)

export default message
