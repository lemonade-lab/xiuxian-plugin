import { readdirSync } from 'fs'
import { data, getConfig } from '../../model/index.js'
import { AppName } from '../../../config.js'
import { common, plugin } from '../../../import.js'
export class GamesTask extends plugin {
  constructor() {
    super({
      name: 'GamesTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: []
    })
    this.task = {
      cron: data.test.GamesTask,
      name: 'GamesTask',
      fnc: () => this.Gamestask()
    }
  }

  async Gamestask() {
    //获取缓存中人物列表
    let playerList = []
    let files = readdirSync(
      './plugins/' + AppName + '/resources/data/xiuxian_player'
    ).filter((file) => file.endsWith('.json'))
    for (let file of files) {
      file = file.replace('.json', '')
      playerList.push(file)
    }
    for (let player_id of playerList) {
      //获取游戏状态
      let game_action = await redis.get(
        'xiuxian@1.4.0:' + player_id + ':game_action'
      )
      //防止继续其他娱乐行为
      if (game_action == '0') {
        await redis.set('xiuxian@1.4.0:' + player_id + ':game_action', 1)
        return false
      }
    }
  }
}
