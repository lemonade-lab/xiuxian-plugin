import { GameApi, plugin } from '../../model/api/index.js'
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
    const ifexistplay = GameApi.Player.existUserSatus(UID)
    if (!ifexistplay) {
      e.reply(`已仙鹤`)
      return
    }
    const UserLevel = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (UserLevel.levelId != 10) {
      /* 不是渡劫 */
      e.reply(`非渡劫期`)
      return
    }

    /**
     * 删除渡劫
     */

    return false
  }

  /** 仙人突破 */
  async breakSky(e) {
    if (!this.verify(e)) return false
    e.reply('待世界升级~')
    return false
  }
}
