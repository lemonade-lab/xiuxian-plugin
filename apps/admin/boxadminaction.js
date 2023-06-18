import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class boxadminaction extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)修仙更新$/, fnc: 'allForcecheckout' },
        { reg: /^(#|\/)修仙删除数据$/, fnc: 'deleteRedis' },
        { reg: /^(#|\/)修仙删除世界$/, fnc: 'deleteAllusers' },
        { reg: /^(#|\/)修仙重置全体寿命*$/, fnc: 'dataRelife' },
        { reg: /^(#|\/)修仙重置他人寿命.*$/, fnc: 'dataRelifehe' },
        { reg: /^(#|\/)修仙复原.*$/, fnc: 'dataRecovery' }
      ]
    })
  }

  async allForcecheckout(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    BotApi.Exec.execStart({ cmd: 'git  pull', e })
    return false
  }

  async deleteRedis(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    GameApi.Wrap.deleteReids()
    e.reply('删除完成')
    return false
  }

  async deleteAllusers(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    GameApi.UserData.controlAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: []
    })
    GameApi.Wrap.deleteReids()
    e.reply('删除完成')
    return false
  }

  async dataRecovery(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    BotApi.Robot.forwardMsg({
      e,
      data: GameApi.Schedule.backupRecovery({
        name: e.msg.replace(/^(#|\/)修仙复原/, '')
      })
    })
    return false
  }

  async dataRelife(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    let msg = BotApi.Robot.relife({})
    e.reply(`${msg}`)
    return false
  }

  async dataRelifehe(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    let B = BotApi.Robot.at({ e })
    let msg = BotApi.Robot.relifehe({ B })
    e.reply(`${B}的${msg}`)
    return false
  }
}
