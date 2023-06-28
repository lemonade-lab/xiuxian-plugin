import plugins from './plugin.js'
import { BotApi } from './botapi.js'
import { GameApi } from './gameapi.js'
import { HomeApi } from './homeapi.js'
import { AssociationApi } from './assapi.js'
export class plugin extends plugins {
  // 统一验证方法
  verify(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    return true
  }
}
export { BotApi, GameApi, HomeApi, AssociationApi }
