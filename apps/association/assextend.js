import { plugin, BotApi, GameApi, AssociationApi } from '../../model/api/gameapi.js'
//汐颜
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
          fnc: 'showAssPlayer'
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
    let msg = e.msg.replace('#建好', '')
    msg = msg.trim()
    const code = msg.split('*')
    const [assName, buildName] = code
    const assRelation = AssociationApi.assUser.assRelationList.find((item) => item.name == assName)
    if (!assRelation) {
      return
    }
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assRelation.id)
    const location = AssociationApi.config.buildNameList.findIndex((item) => item == buildName)
    if (location == -1) {
      return
    }
    const buildNumList = [100, 500, 500, 200, 200, 200, 300]
    ass.facility[location].buildNum = buildNumList[location]
    await AssociationApi.assUser.checkFacility(ass)
  }

  async showAssPlayer(e) {
    const UID = e.user_id
    //无存档
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return
    }
    const assRelation = AssociationApi.assUser.assRelationList.find(
      (item) => item.id == assPlayer.assName
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
        assPlayer.assJob +
        '\n' +
        '修炼效率加成:' +
        assPlayer.effective +
        '\n' +
        '神兽好感度:' +
        assPlayer.favorability +
        '\n' +
        '当前贡献值:' +
        assPlayer.contributionPoints +
        '\n' +
        '历史贡献值:' +
        assPlayer.historyContribution
    )
    await BotApi.User.forwardMsg({ e, data: msg })
    return
  }

  async identify_token(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }

    let isExists = await GameApi.GameUser.userBagSearch({
      UID: UID,
      name: '宗门令牌'
    })
    if (!isExists) {
      e.reply(`没令牌你鉴定个锤子`)
      return
    }
    const random = Math.random()
    await GameApi.GameUser.userBag({
      UID: UID,
      name: isExists.name,
      ACCOUNT: Number(-1)
    })
    if (random < 0.1) {
      await GameApi.GameUser.userBag({
        UID: UID,
        name: '上等宗门令牌',
        ACCOUNT: Number(1)
      })
      e.reply(`你获得了上等宗门令牌`)
    } else if (random < 0.35) {
      await GameApi.GameUser.userBag({
        UID: UID,
        name: '中等宗门令牌',
        ACCOUNT: Number(1)
      })
      e.reply(`你获得了中等宗门令牌`)
    } else {
      await GameApi.GameUser.userBag({
        UID: UID,
        name: '下等宗门令牌',
        ACCOUNT: Number(1)
      })
      e.reply(`你获得了下等宗门令牌`)
    }
    return
  }
}
