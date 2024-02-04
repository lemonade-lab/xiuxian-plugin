import { plugin } from '../../../import.js'
import {
  Write_Forum,
  Read_Forum,
  Add_money,
  getConfig
} from '../../model/index.js'

export class ForumTask extends plugin {
  constructor() {
    super({
      name: 'ForumTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: []
    })
    this.set = getConfig('task', 'task')
    this.task = {
      cron: this.set.AutoBackUpTask,
      name: 'ForumTask',
      fnc: () => this.Forumtask()
    }
  }
  async Forumtask() {
    let Forum
    try {
      Forum = await Read_Forum()
    } catch {
      //没有表要先建立一个！
      await Write_Forum([])
      Forum = await Read_Forum()
    }
    const now_time = new Date().getTime()
    for (let i = 0; i < Forum.length; i++) {
      const time = (now_time - Forum[i].now_time) / 24 / 60 / 60 / 1000
      if (time < 3) break
      const user_id = Forum[i].qq
      const lingshi = Forum[i].whole
      await Add_money(user_id, lingshi)
      Forum.splice(i, 1)
      i--
    }
    await Write_Forum(Forum)
    return false
  }
}
