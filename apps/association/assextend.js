import { plugin, BotApi, GameApi, AssociationApi } from '#xiuxian-api'
// 汐颜
export class AssociationExtend extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)鉴定门派令牌$/,
          fnc: 'identifyToken'
        },
        {
          reg: /^(#|\/)门派信息$/,
          fnc: 'showAssGP'
        },
        {
          reg: /^(#|\/)建好.*$/,
          fnc: 'buildFactoryGood'
        }
      ]
    })
  }

  async buildFactoryGood(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    if (!e.isMaster) return false
    let msg = e.cmd_msg.replace(/^(#|\/)建好/, '')
    msg = msg.trim()
    const code = msg.split('*')
    const [AID, buildName] = code
    const assRelation = AssociationApi.assUser.assRelationList.find((item) => item.name == AID)
    if (!assRelation) {
      return false
    }
    const ass = GameApi.Data.controlAction({
      NAME: assRelation.id,
      CHOICE: 'assOciation'
    })
    const location = AssociationApi.assUser.buildNameList.findIndex((item) => item == buildName)
    if (location == -1) {
      return false
    }
    const buildNumList = [100, 500, 500, 200, 200, 200, 300]
    ass.facility[location].buildNum = buildNumList[location]
    AssociationApi.assUser.checkFacility(ass)
  }

  async showAssGP(e) {
    const UID = e.user_id
    // 无存档
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID == 0) {
      e.reply('一介散修')
      return false
    }
    const assRelation = AssociationApi.assUser.assRelationList.find((item) => item.id == assGP.AID)
    let msg = [`__[${UID}的门派存档]__`]
    msg.push('UID:' + UID)
    msg.push('所属门派:' + assRelation.name)
    msg.push('权限等级:' + assGP.assJob)
    msg.push('修炼效率加成:' + assGP.effective)
    msg.push('神兽好感度:' + assGP.favorability)
    msg.push('当前贡献值:' + assGP.contributionPoints)
    msg.push('历史贡献值:' + assGP.historyContribution)
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  async identifyToken(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    let isExists = GameApi.Bag.searchBagByName({
      UID,
      name: '门派令牌'
    })
    if (!isExists) {
      e.reply(`没令牌你鉴定个锤子`)
      return false
    }
    const random = Math.random()
    GameApi.Bag.addBagThing({
      UID,
      name: isExists.name,
      ACCOUNT: Number(-1)
    })
    if (random < 0.1) {
      GameApi.Bag.addBagThing({
        UID,
        name: '上等门派令牌',
        ACCOUNT: Number(1)
      })
      e.reply(`你获得了上等门派令牌`)
    } else if (random < 0.35) {
      GameApi.Bag.addBagThing({
        UID,
        name: '中等门派令牌',
        ACCOUNT: Number(1)
      })
      e.reply(`你获得了中等门派令牌`)
    } else {
      GameApi.Bag.addBagThing({
        UID,
        name: '下等门派令牌',
        ACCOUNT: Number(1)
      })
      e.reply(`你获得了下等门派令牌`)
    }
    return false
  }
}
