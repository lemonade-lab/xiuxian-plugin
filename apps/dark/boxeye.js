import { GameApi, plugin } from '../../model/api/index.js'
export class BoxEye extends plugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)虚空眼.*$/, fnc: 'darkEye' }]
    })
  }
  async darkEye(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const name = e.msg.replace(/^(#|\/)虚空眼/, '')
    const HistoryList = GameApi.UserData.controlActionInitial({
      NAME: 'history',
      CHOICE: 'fixed_history',
      INITIAL: {}
    })
    if (HistoryList.hasOwnProperty(name)) {
      e.reply(HistoryList[name])
      return false
    }
    e.reply('查无此项')
    return false
  }
}
