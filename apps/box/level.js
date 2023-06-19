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
    if (!GameApi.Player.existUserSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    e.reply('待更新')
    return false
  }

  async levelMaxUp(e) {
    if (!this.verify(e)) return false
    if (!GameApi.Player.existUserSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    e.reply('待更新')
    return false
  }
}
