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
        { reg: /^(#|\/)盒子复原.*$/, fnc: 'dataRecovery' }
      ]
    })
  }
  allForcecheckout = async (e) => {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    await BotApi.Exec.execStart({ cmd: 'git  pull', e })
    return false
  }
  deleteRedis = async (e) => {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    GameApi.GamePublic.deleteReids()
    e.reply('删除完成')
    return false
  }
  deleteAllusers = async (e) => {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    await GameApi.UserData.controlAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: []
    })
    GameApi.GamePublic.deleteReids()
    e.reply('删除完成')
    return false
  }
  dataRecovery = async (e) => {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    await BotApi.User.forwardMsg({
      e,
      data: GameApi.Schedule.backuprecovery({
        name: e.msg.replace(/^(#|\/)盒子复原/, '')
      })
    })
    return false
  }
  dataRelife = async (e) => {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    let msg = await BotApi.User.relife({})
    e.reply(`${msg}`)
    return false
  }
  dataRelifehe = async (e) => {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    let B = await BotApi.User.at({ e })
    let msg = await BotApi.User.relifehe({ B })
    e.reply(`${B}的${msg}`)
    return false
  }
}
