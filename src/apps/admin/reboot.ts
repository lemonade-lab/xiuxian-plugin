import { exec } from 'child_process'
import { join } from 'path'
import { type Message, plugin, define } from '../../../import.js'
import { AppName, cwd } from '../../../config.js'
export class admin extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)修仙更新/,
          fnc: 'checkout'
        }
      ]
    })
  }
  /**
   * 修仙更新
   * @param e
   * @returns
   */
  async checkout(e: Message) {
    if (!e.isMaster) return false
    exec('git  pull', { cwd: join(cwd, AppName) }, (error, stdout, stderr) => {
      if (/(Already up[ -]to[ -]date|已经是最新the)/.test(stdout)) {
        e.reply('update ok')
        return false
      }
      if (error) {
        e.reply('Error code: ' + error.code + '\n' + error.stack + '\n')
        return false
      }
      e.reply('update ok')
    })
    return false
  }
}
