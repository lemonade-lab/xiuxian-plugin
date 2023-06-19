import { plugin, BotApi, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
export class AssociationExtend extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)鉴定宗门令牌$/,
          fnc: 'identify_token'
        },
        {
          reg: /^(#|\/)宗门玩法存档$/,
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
    if (!this.verify(e)) return false
    if (!e.isMaster) return false
    let msg = e.msg.replace(/^(#|\/)建好/, '')
    msg = msg.trim()
    const code = msg.split('*')
    const [assName, buildName] = code
    const assRelation = AssociationApi.assUser.assRelationList.find((item) => item.name == assName)
    if (!assRelation) {
      return false
    }
    const ass = AssociationApi.assUser.getAssOrGP(2, assRelation.id)
    const location = AssociationApi.Config.buildNameList.findIndex((item) => item == buildName)
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
    if (!ifexistplay || !e.isGroup) {
      return false
    }
    const assGP = AssociationApi.assUser.getAssOrGP(1, UID)
    if (assGP.assName == 0) {
      return false
    }
    const assRelation = AssociationApi.assUser.assRelationList.find(
      (item) => item.id == assGP.assName
    )
    let msg = [`__[${UID}的宗门存档]__`]
    msg.push(
      'QQ:' +
        UID +
        '\n' +
        '所属宗门:' +
        assRelation.name +
        '\n' +
        '权限等级:' +
        assGP.assJob +
        '\n' +
        '修炼效率加成:' +
        assGP.effective +
        '\n' +
        '神兽好感度:' +
        assGP.favorability +
        '\n' +
        '当前贡献值:' +
        assGP.contributionPoints +
        '\n' +
        '历史贡献值:' +
        assGP.historyContribution
    )
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  async identify_token(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    let isExists = GameApi.Bag.searchBagByName({
      UID,
      name: '宗门令牌'
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
        name: '上等宗门令牌',
        ACCOUNT: Number(1)
      })
      e.reply(`你获得了上等宗门令牌`)
    } else if (random < 0.35) {
      GameApi.Bag.addBagThing({
        UID,
        name: '中等宗门令牌',
        ACCOUNT: Number(1)
      })
      e.reply(`你获得了中等宗门令牌`)
    } else {
      GameApi.Bag.addBagThing({
        UID,
        name: '下等宗门令牌',
        ACCOUNT: Number(1)
      })
      e.reply(`你获得了下等宗门令牌`)
    }
    return false
  }
}
