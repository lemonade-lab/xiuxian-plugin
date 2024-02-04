import {
  Read_temp,
  Show,
  Write_temp,
  data,
  pushInfo
} from '../../model/index.js'
import { common, plugin, puppeteer } from '../../../import.js'
export class msgTask extends plugin {
  constructor() {
    super({
      name: 'msgTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: []
    })
    this.task = {
      cron: data.test.temp_task,
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
        await pushInfo(i, true, img)
      }
      await Write_temp([])
    }
  }
}
