import { plugin, config } from '../../api/api.js';
import { Read_najie, __PATH } from '../../model/xiuxian.js';
import { AppName } from '../../app.config.js';
import fs from 'fs';
export class BackUptask extends plugin {
  constructor() {
    super({
      name: 'BackUptask',
      dsc: '存档备份',
      event: 'message',
      priority: 1000,
      rule: [],
    });
    this.set = config.getConfig('task', 'task');
    this.task = {
      cron: this.set.temp_task,
      name: 'BackUptask',
      fnc: () => this.saveBackUp(),
    };
  }

  async saveBackUp() {
    let playerList = [];
    let files = fs
      .readdirSync('./plugins/' + AppName + '/resources/data/xiuxian_player')
      .filter(file => file.endsWith('.json'));
    for (let file of files) {
      file = file.replace('.json', '');
      playerList.push(file);
    }
    for (let player_id of playerList) {
      let usr_qq = player_id;
      try {
        await Read_najie(usr_qq);
        fs.copyFileSync(
          `${__PATH.najie_path}/${usr_qq}.json`,
          `${__PATH.auto_backup}/najie/${usr_qq}.json`
        );
      } catch {
        continue;
      }
    }
  }
}
