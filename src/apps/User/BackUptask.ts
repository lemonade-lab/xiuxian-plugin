import { Read_najie, __PATH, data, getConfig } from '../../model/index.js'
import { AppName } from '../../../config.js'
import { copyFileSync, readdirSync } from 'fs'
import { plugin } from '../../../import.js'
export class BackUptask extends plugin {
  constructor() {
    super({
      name: 'BackUptask',
      dsc: '存档备份',
      event: 'message',
      priority: 1000,
      rule: []
    })
    this.task = {
      cron: data.test.temp_task,
      name: 'BackUptask',
      fnc: () => this.saveBackUp()
    }
  }

  async saveBackUp() {
    let playerList = []
    let files = readdirSync(
      './plugins/' + AppName + '/resources/data/xiuxian_player'
    ).filter((file) => file.endsWith('.json'))
    for (let file of files) {
      file = file.replace('.json', '')
      playerList.push(file)
    }
    for (let player_id of playerList) {
      let user_id = player_id
      try {
        await Read_najie(user_id)
        copyFileSync(
          `${__PATH.najie_path}/${user_id}.json`,
          `${__PATH.auto_backup}/najie/${user_id}.json`
        )
      } catch {
        continue
      }
    }
  }
}
