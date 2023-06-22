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
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = GameApi.Information.showUserBag(UID)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async bagUp(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Action.Go(UID)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const najie = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag'
    })
    const najiePrice = GameApi.Defset.getConfig('cooling').najiePrice[najie.grade]
    if (!najiePrice) {
      return false
    }
    const thing = GameApi.Bag.searchBagByName({
      UID,
      name: '下品灵石'
    })
    if (!thing || thing.acount < najiePrice) {
      e.reply(`灵石不足,需要准备${najiePrice}*[下品灵石]`)
      return false
    }
    najie.grade += 1
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag',
      DATA: najie
    })
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: -Number(najiePrice)
    })
    e.reply(`花了${najiePrice}*[下品灵石]升级,目前储物袋为${najie.grade}`)
    return false
  }
}
