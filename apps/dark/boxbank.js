import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxBank extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)金银坊$/, fnc: 'moneyWorkshop' },
        { reg: /^(#|\/)金银置换\d+\*[\u4e00-\u9fa5]+\*[\u4e00-\u9fa5]+$/, fnc: 'substitution' }
      ]
    })
  }

  async moneyWorkshop(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const StorageList = GameApi.Data.readInitial('storage', 'playerBank', {})
    const WhiteBarList = GameApi.Data.readInitial('whiteBar', 'playerBank', {})
    const msg = []
    if (!Object.prototype.hasOwnProperty.call(StorageList, UID)) {
      msg.push('无存款记录')
    } else {
      msg.push(`存款:${StorageList[UID].account}`)
    }
    if (!Object.prototype.hasOwnProperty.call(StorageList, UID)) {
      msg.push('无白条记录')
    } else {
      msg.push(`借款:${WhiteBarList[UID].money}`)
    }
    const isreply = await e.reply(
      await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } })
    )
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async substitution(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const [account, LeftName, RightName] = e.msg.replace(/^(#|\/)金银置换/, '').split('*')
    const quantity = convertStoneQuantity(account, LeftName, RightName)
    if (!quantity) return
    const money = GameApi.Bag.searchBagByName({
      UID,
      name: LeftName
    })
    if (!money || money.acount < account) {
      e.reply(`[金银坊]金老三\n?哪儿来的穷鬼！`)
      return false
    }
    if (account < 2000) {
      e.reply(`[金银坊]金老三\n少于2000不换`)
      return false
    }
    // 先扣除
    GameApi.Bag.addBagThing({
      UID,
      name: LeftName,
      ACCOUNT: -account
    })
    // 再增加
    GameApi.Bag.addBagThing({
      UID,
      name: RightName,
      ACCOUNT: quantity
    })
    e.reply(`[${LeftName}]*${account}\n置换成\n[${RightName}]*${quantity}`)
    return false
  }
}

const stones = ['下品灵石', '中品灵石', '上品灵石', '极品灵石']

function convertStoneQuantity(quantity, sourceStone, targetStone) {
  const sourceIndex = stones.indexOf(sourceStone)
  const targetIndex = stones.indexOf(targetStone)
  const size = Math.abs(targetIndex - sourceIndex)
  const onSize = 10 ** size
  if (sourceIndex === -1 || targetIndex === -1) {
    // 如果输入的灵石名称不合法，则返回 null
    return false
  } else if (sourceIndex < targetIndex) {
    // 将左边的灵石转换为右边的灵石
    return Math.floor((quantity / onSize) * 0.9)
  } else if (sourceIndex > targetIndex) {
    // 将右边的灵石转换为左边的灵石
    return quantity * onSize
  } else {
    // 如果左右灵石相同，则直接返回原始数量
    return quantity
  }
}
