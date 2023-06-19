import { GameApi, plugin } from '../../model/api/index.js'
export class BoxLevel extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)突破$/, fnc: 'levelUp' },
        { reg: /^(#|\/)破境$/, fnc: 'levelMaxUp' }
      ]
    })
  }

  async levelUp(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    const res = GameApi.Levels.enhanceRealm(UID, 0)
    const { msg } = res
    e.reply(msg)
    return false
  }

  async levelMaxUp(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    const res = GameApi.Levels.enhanceRealm(UID, 1)
    const { msg } = res
    e.reply(msg)
    return false
  }
}
