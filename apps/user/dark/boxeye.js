import { GameApi, plugin, name, dsc, verify } from '../../../model/api/api.js'
export class BoxEye extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [{ reg: /^(#|\/)虚空眼.*$/, fnc: 'darkEye' }]
    })
  }
  darkEye = async (e) => {
    if (!verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const name = e.msg.replace('#虚空眼', '').replace('/虚空眼', '')
    const HistoryList = await GameApi.UserData.listActionInitial({
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
