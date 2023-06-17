import plugins from '../../../../lib/plugins/plugin.js'
import { BotApi } from './botapi.js'
import { GameApi } from './gameapi.js'
import { HomeApi } from './homeapi.js'
export class plugin extends plugins {
  constructor(data) {
    super({
      //辨识名
      name: data.name ?? 'xiuxian@2.1',
      //说明
      dsc: data.dsc ?? 'xiuxian@2.1',
      //优先级
      priority: data.priority ?? 900000,
      //扩展
      ...data
    })
  }
  //统一验证方法
  verify(e) {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    return true
  }
}
export { BotApi, GameApi, HomeApi }
