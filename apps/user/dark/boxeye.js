import { GameApi, plugin, name, dsc } from '../../../model/api/api.js'
export class BoxEye extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [{ reg: '^#虚空眼.*$', fnc: 'darkEye' }]
    })
  }
  darkEye = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return false
    }
    const name = e.msg.replace('#虚空眼', '')
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
