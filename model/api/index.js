import plugins from '../../../../lib/plugins/plugin.js'
import cfg from '../../../../lib/config/config.js'
import { BotApi } from './botapi.js'
import { GameApi } from './gameapi.js'
import { HomeApi } from './homeapi.js'
import { AssociationApi } from './assapi.js'
export class plugin extends plugins {
  constructor(data) {
    data.name = data.name ?? 'xiuxian@2.1'
    data.dsc = data.dsc ?? 'xiuxian@2.1'
    data.priority = data.priority ?? 900000
    super(data)
  }

  // 统一验证方法
  verify(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.Robot.controlMessage(e)) return false
    return true
  }
}
export { BotApi, GameApi, HomeApi, AssociationApi, cfg }
