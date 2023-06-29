import { BotApi, GameApi, plugin } from '#xiuxian-api'
export class BoxAction extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)服用[\u4e00-\u9fa5]+\*\d+$/, fnc: 'take' },
        { reg: /^(#|\/)学习[\u4e00-\u9fa5]*$/, fnc: 'study' },
        { reg: /^(#|\/)忘掉[\u4e00-\u9fa5]*$/, fnc: 'forget' },
        { reg: /^(#|\/)消耗[\u4e00-\u9fa5]*$/, fnc: 'consumption' }
      ]
    })
  }

  async take(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    let [thingName, thingAcount] = e.cmd_msg.replace(/^(#|\/)服用/, '').split('*')
    const najieThing = GameApi.Bag.searchBagByName({
      UID,
      name: thingName
    })
    if (!najieThing) {
      e.reply(`没有[${thingName}]`)
      return false
    }
    if (najieThing.acount < thingAcount) {
      e.reply('数量不足')
      return false
    }
    const id = najieThing.id.split('-')
    let x = 0 // 用于判断pa数组内是否存在id[0]
    let pa = [1, 2, 3, 4, 5, 6]
    for (let i = 0; i < pa.length; i++) {
      if (id[0] == pa[i]) {
        x = 1
      }
    }
    if (x != 1) {
      e.reply(`你看看${thingName}，想想怎么吞都吞不下去吧`)
      return false
    }
    const LevelData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    switch (id[1]) {
      case '1': {
        let size = parseInt(najieThing.blood)
        const blood = GameApi.Player.addBlood(UID, size)
        e.reply(`成功服用${thingName}\n恢复了${size}%的血量\n当前血量:${blood}`)
        break
      }
      case '2': {
        let experience = parseInt(najieThing.experience)
        if (id[0] == '6') {
          if (thingAcount > 2200) {
            thingAcount = 2200
          }
          const cf = GameApi.Defset.getConfig('cooling')
          const CDTime = cf.CD.Practice ? cf.CD.Practice : 5
          const CDID = 12
          const nowTime = new Date().getTime()
          const { state: coolingState, msg: msgCooling } = GameApi.Burial.cooling(e.user_id, CDID)
          if (coolingState == 4001) {
            experience = 0
            e.reply(msgCooling)
            return false
          }
          GameApi.Burial.set(UID, CDID, nowTime, CDTime)
          switch (id[2]) {
            case '1': {
              if (LevelData.gaspractice.realm >= 3) {
                experience = 0
              }
              break
            }
            case '2': {
              if (LevelData.gaspractice.real >= 5) {
                experience = 0
              }
              break
            }
            case '3': {
              if (LevelData.gaspractice.realm >= 7) {
                experience = 0
              }
              break
            }
            case '4': {
              if (LevelData.gaspractice.real >= 9) {
                experience = 0
              }
              break
            }
            default: {
              console.info('无')
            }
          }
        }
        if (experience > 0) {
          let experience = parseInt(najieThing.experience)
          let size = thingAcount * experience
          GameApi.Levels.addExperience(UID, 0, size)
          e.reply(`[修为]+${size}`)
        }
        break
      }
      case '3': {
        let experience = parseInt(najieThing.experiencemax)
        let size = thingAcount * experience
        GameApi.Levels.addExperience(UID, 1, size)
        e.reply(`[气血]+${size}`)
        break
      }
      default: {
        console.info('无')
      }
    }
    GameApi.Bag.addBagThing({
      UID,
      name: najieThing.name,
      ACCOUNT: -thingAcount
    })
    return false
  }

  async study(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.cmd_msg.replace(/^(#|\/)学习/, '')
    const najieThing = GameApi.Bag.searchBagByName({
      UID,
      name: thingName
    })
    if (!najieThing) {
      e.reply(`没有[${thingName}]`)
      return false
    }
    const id = najieThing.id.split('-')
    if (id[0] != 5) {
      return false
    }
    const talent = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerTalent'
    })
    const islearned = talent.AllSorcery.find((item) => item.id == najieThing.id)
    if (islearned) {
      e.reply('学过了')
      return false
    }
    if (talent.AllSorcery.length >= GameApi.Defset.getConfig('cooling').myconfig.gongfa) {
      e.reply('你反复看了又看,却怎么也学不进')
      return false
    }
    talent.AllSorcery.push(najieThing)
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerTalent',
      DATA: talent
    })
    GameApi.Talent.updataEfficiency(UID)
    GameApi.Bag.addBagThing({
      UID,
      name: najieThing.name,
      ACCOUNT: -1
    })
    e.reply(`学习[${thingName}]`)
    return false
  }

  async forget(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.cmd_msg.replace(/^(#|\/)忘掉/, '')
    const talent = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerTalent'
    })
    const islearned = talent.AllSorcery.find((item) => item.name == thingName)
    if (!islearned) {
      e.reply(`没学过[${thingName}]`)
      return false
    }
    talent.AllSorcery = talent.AllSorcery.filter((item) => item.name != thingName)
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerTalent',
      DATA: talent
    })
    GameApi.Talent.updataEfficiency(UID)
    GameApi.Bag.addBagThing({ UID, name: islearned.name, ACCOUNT: 1 })
    e.reply(`忘了[${thingName}]`)
    return false
  }

  async consumption(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.cmd_msg.replace(/^(#|\/)消耗/, '')
    const najieThing = GameApi.Bag.searchBagByName({
      UID,
      name: thingName
    })
    if (!najieThing) {
      e.reply(`没有[${thingName}]`)
      return false
    }
    GameApi.Bag.addBagThing({
      UID,
      name: najieThing.name,
      ACCOUNT: -1
    })
    const id = najieThing.id.split('-')
    if (id[0] != 6) {
      e.reply(`[${thingName}]损坏`)
      return false
    }
    if (id[1] == 1) {
      switch (id[2]) {
        case '1': {
          const LevelData = GameApi.Data.controlAction({
            NAME: UID,
            CHOICE: 'playerLevel'
          })
          if (LevelData.gaspractice.realm >= 20) {
            e.reply('[灵根]已定\n此生不可再洗髓')
            break
          }
          const talent = GameApi.Data.controlAction({
            NAME: UID,
            CHOICE: 'playerTalent'
          })
          talent.talent = GameApi.Talent.getTalent()
          GameApi.Data.controlAction({
            NAME: UID,
            CHOICE: 'playerTalent',
            DATA: talent
          })
          GameApi.Talent.updataEfficiency(UID)
          const { path, name, data } = GameApi.Information.showUserPlayer(e.user_id, e.user_avatar)
          const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
          BotApi.Robot.surveySet(e, isreply)
          break
        }
        case '2': {
          const talent = GameApi.Data.controlAction({
            NAME: UID,
            CHOICE: 'playerTalent'
          })
          talent.talentshow = 0
          GameApi.Data.controlAction({
            NAME: UID,
            CHOICE: 'playerTalent',
            DATA: talent
          })
          const { path, name, data } = GameApi.Information.showUserPlayer(e.user_id, e.user_avatar)
          const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
          BotApi.Robot.surveySet(e, isreply)
          break
        }
        default: {
          console.info('无')
        }
      }
    }
    return false
  }
}
