import { BotApi, GameApi, plugin } from '#xiuxian-api'
export class Boxadminaction extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)修仙删除数据$/, fnc: 'deleteRedis' },
        { reg: /^(#|\/)修仙删除世界$/, fnc: 'deleteAllusers' },
        { reg: /^(#|\/)修仙复原.*$/, fnc: 'dataRecovery' }
      ]
    })
  }

  async deleteAllReids(e) {
    if (!e.isMaster) return false
    if (!super.verify(e)) return false
    e = super.escape(e)
    GameApi.Burial.deleteAll()
    e.reply('删除完成')
    return false
  }

  async deleteAllusers(e) {
    if (!e.isMaster) return false
    if (!super.verify(e)) return false
    e = super.escape(e)
    GameApi.Data.write('life', 'playerLife', {})
    GameApi.Burial.deleteAll()
    e.reply('删除完成')
    return false
  }

  async dataRecovery(e) {
    if (!e.isMaster) return false
    if (!super.verify(e)) return false
    e = super.escape(e)
    e.reply(
      BotApi.obtainingImages({
        path: 'msg',
        name: 'msg',
        data: {
          msg: GameApi.Schedule.backupRecovery(e.cmd_msg.replace(/^(#|\/)修仙复原/, ''))
        }
      })
    )
    return false
  }
}
