import { plugin, common, puppeteer, config, Show } from '../../api/api.js'
import { Read_temp, Write_temp } from '../../model/index.js'
export class msgTask extends plugin {
  constructor() {
    super({
      name: 'msgTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: []
    })
    this.set = config.getConfig('task', 'task')
    this.task = {
      cron: this.set.temp_task,
      name: 'msgTask',
      fnc: () => this.msgTask()
    }
  }

  async msgTask() {
    let temp
    try {
      temp = await Read_temp()
    } catch {
      await Write_temp([])
      temp = await Read_temp()
    }
    if (temp.length > 0) {
      let group = []
      group.push(temp[0].qq_group)
      f1: for (let i of temp) {
        for (let j of group) {
          if (i.qq_group == j) continue f1
        }
        group.push(i.qq_group)
      }
      for (let i of group) {
        let msg = []
        for (let j of temp) {
          if (i == j.qq_group) {
            msg.push(j.msg)
          }
        }
        let temp_data = {
          temp: msg
        }
        const data1 = await new Show().get_tempData(temp_data)
        let img = await puppeteer.screenshot('temp', {
          ...data1
        })
        await this.pushInfo(i, true, img)
      }
      await Write_temp([])
    }
  }

  /**
   * 推送消息，群消息推送群，或者推送私人
   * @param id
   * @param is_group
   * @return  falses {Promise<void>}
   */
  async pushInfo(id, is_group, msg) {
    if (is_group) {
      await Bot.pickGroup(id)
        .sendMsg(msg)
        .catch((err) => {
          console.error(err)
        })
    } else {
      await common.relpyPrivate(id, msg)
    }
  }
}
