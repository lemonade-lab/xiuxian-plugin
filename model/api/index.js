import plugins from '../../../../lib/plugins/plugin.js'
import { BotApi } from './botapi.js'
import { GameApi } from './gameapi.js'
import { HomeApi } from './homeapi.js'
export class plugin extends plugins {
  constructor(data) {
    super({
      name: data.name ?? 'xiuxian@2.1',
      dsc: data.dsc ?? 'xiuxian@2.1',
      ...data
    })
  }
}
function verify(e) {
  if (!e.isGroup || e.user_id == 80000000) return false
  if (!BotApi.User.controlMessage({ e })) return false
  return true
}
export { BotApi, GameApi, HomeApi, verify }
