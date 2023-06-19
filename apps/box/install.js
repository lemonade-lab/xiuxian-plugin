import { GameApi, plugin } from '../../model/api/index.js'
export class BoxInstall extends plugin {
  constructor() {
    super({
      event: 'notice.group.increase',
      priority: 99999,
      rule: [
        {
          fnc: 'createinstall'
        }
      ]
    })
  }

  async createinstall(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const T = cf.switch ? cf.switch.come : true
    if (!T) {
      return false
    }
    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply([segment.at(UID), '您已仙鹤,需[(#|/)再入仙途]后步入轮回!'])
      return false
    }
    e.reply([
      segment.at(UID),
      '欢迎来到修仙世界\n请大喊[(#|/)修仙帮助]以获得\n《凡人是如何修仙成功的之修仙生存手册之先抱大腿》'
    ])
    return false
  }
}
