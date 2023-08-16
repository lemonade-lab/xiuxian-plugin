import { plugin, verc } from '../../api/api.js'
import { AppName } from '../../app.config.js'
import { exec } from 'child_process'
export class admin extends plugin {
  constructor() {
    super({
      name: '管理|更新插件',
      dsc: '管理和更新代码',
      event: 'message',
      priority: 400,
      rule: [
        {
          reg: '^#修仙更新',
          fnc: 'checkout'
        }
      ]
    })
  }
  async checkout(e) {
    if (!e.isMaster) return false
    if (!verc({ e })) return false
    exec(
      'git  pull',
      { cwd: `${process.cwd()}/plugins/${AppName}/` },
      function (error, stdout, stderr) {
        if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
          e.reply('目前已经是最新版xiuxian@1.3.0了~')
          return false
        }
        if (error) {
          e.reply(
            'xiuxian@1.3.0更新失败！\nError code: ' +
              error.code +
              '\n' +
              error.stack +
              '\n 请稍后重试。'
          )
          return false
        }
        e.reply('更新成功,请[#重启]')
      }
    )
    return false
  }
}