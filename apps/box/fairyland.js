import { GameApi, plugin } from '#xiuxian-api'
export class Boxfairyland extends plugin {
  constructor() {
    super({
      name: 'xiuxian@fairyland',
      dsc: 'xiuxian@fairyland',
      rule: [
        { reg: /^(#|\/)渡劫$/, fnc: 'breakLevel' },
        { reg: /^(#|\/)望天$/, fnc: 'breakSky' }
      ]
    })
  }

  /** 成就仙人境 */
  async breakLevel(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = GameApi.Player.getUserLifeSatus(UID)
    if (!ifexistplay) {
      e.reply(`已仙鹤`)
      return false
    }
    e.reply('待世界升级~')
    return false
  }

  /** 仙人突破 */
  async breakSky(e) {
    if (!this.verify(e)) return false
    e.reply('待世界升级~')
    return false
  }
}
