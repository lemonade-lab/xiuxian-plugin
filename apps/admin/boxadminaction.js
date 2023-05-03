import { BotApi, GameApi, plugin, name, dsc, verify } from '../../model/api/api.js'
export class boxadminaction extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: '^#修仙更新', fnc: 'allForcecheckout' },
        { reg: '^#修仙删除数据$', fnc: 'deleteRedis' },
        { reg: '^#修仙删除世界$', fnc: 'deleteAllusers' },
        { reg: '^#盒子复原.*$', fnc: 'dataRecovery' }
      ]
    })
  }
  allForcecheckout = async (e) => {
    if (!e.isMaster) return false
    if (!verify(e)) return false
    await BotApi.Exec.execStart({ cmd: 'git  pull', e })
    return false
  }
  deleteRedis = async (e) => {
    if (!e.isMaster) return false
    if (!verify(e)) return false
    await GameApi.GamePublic.deleteReids()
    e.reply('删除完成')
    return false
  }
  deleteAllusers = async (e) => {
    if (!e.isMaster) return false
    if (!verify(e)) return false
    await GameApi.UserData.listAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: []
    })
    await GameApi.GamePublic.deleteReids()
    e.reply('删除完成')
    return false
  }
  dataRecovery = async (e) => {
    if (!e.isMaster) return false
    if (!verify(e)) return false
    await BotApi.User.forwardMsg({
      e,
      data: GameApi.Schedule.backuprecovery({
        name: e.msg.replace('#盒子复原', '')
      })
    })
    return false
  }
}
