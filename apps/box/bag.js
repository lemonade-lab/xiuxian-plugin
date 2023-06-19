import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxBag extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)储物袋$/, fnc: 'showBag' },
        { reg: /^(#|\/)储物袋升级$/, fnc: 'bagUp' }
      ]
    })
  }

  async showBag(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = GameApi.Information.userBagShow(UID)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }

  async bagUp(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.existUserSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Wrap.Go(e.user_id)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const najie = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_bag'
    })
    const najiePrice = GameApi.Defset.getConfig({
      name: 'cooling'
    }).najiePrice[najie.grade]
    if (!najiePrice) {
      return false
    }
    const thing = GameApi.Player.userBagSearch({
      UID,
      name: '下品灵石'
    })
    if (!thing || thing.acount < najiePrice) {
      e.reply(`灵石不足,需要准备${najiePrice}*[下品灵石]`)
      return false
    }
    najie.grade += 1
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_bag',
      DATA: najie
    })
    GameApi.Player.userBag({
      UID,
      name: '下品灵石',
      ACCOUNT: -Number(najiePrice)
    })
    e.reply(`花了${najiePrice}*[下品灵石]升级,目前储物袋为${najie.grade}`)
    return false
  }
}
