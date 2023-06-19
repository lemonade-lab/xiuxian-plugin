import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxBattleSite extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)击杀[\u4e00-\u9fa5]*$/, fnc: 'userKill' },
        { reg: /^(#|\/)探索怪物$/, fnc: 'userExploremonsters' }
      ]
    })
  }

  async userKill(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Wrap.Go(e.user_id)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const CDID = '10'
    const nowTime = new Date().getTime()
    const cf = GameApi.Defset.getConfig({
      name: 'cooling'
    })
    const CDTime = cf.CD.Kill ? cf.CD.Kill : 5
    const { state: coolingState, msg: coolingMsg } = GameApi.Wrap.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    const Mname = e.msg.replace(/^(#|\/)击杀/, '')
    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const monstersdata = GameApi.Monster.monsterscache(action.region)
    const mon = monstersdata[Mname]
    if (!mon) {
      e.reply(`这里没有[${Mname}],去别处看看吧`)
      return false
    }
    const MnameBuff = GameApi.Monster.add(action.region, Mname)
    const msgLeft = []
    const buff = {
      msg: 1
    }
    if (MnameBuff) {
      buff.msg = Math.floor(Math.random() * (5 - 2)) + Number(2)
      msgLeft.push('怪物突然变异了!')
    }
    const Levellist = GameApi.UserData.controlAction({
      NAME: 'gaspractice',
      CHOICE: 'fixed_levels'
    })
    const LevelMax = Levellist[mon.level + 1]
    const monsters = {
      nowblood: LevelMax.blood * buff.msg,
      attack: LevelMax.attack * buff.msg,
      defense: LevelMax.defense * buff.msg,
      blood: LevelMax.blood * buff.msg,
      burst: LevelMax.burst + LevelMax.id * buff.msg,
      burstmax: LevelMax.burstmax + LevelMax.id * buff.msg,
      speed: LevelMax.speed + buff.msg
    }
    const battle = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const talent = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    const mybuff = Math.floor(talent.talentsize / 100) + Number(1)
    const battleMsg = GameApi.Battle.monsterbattle({
      e,
      battleA: battle,
      battleB: monsters,
      battleNameB: Mname
    })
    for (let item of battleMsg.msg) {
      msgLeft.push(item)
    }
    const msgRight = []
    if (battleMsg.QQ != 0) {
      const m = Math.floor(Math.random() * (100 - 1)) + Number(1)
      if (m < (mon.level + 1) * 6) {
        const randomthinf = GameApi.GP.randomThing()
        let najie = GameApi.UserData.controlAction({
          NAME: UID,
          CHOICE: 'user_bag'
        })
        if (najie.thing.length <= najie.grade * 10) {
          GameApi.Bag.addBagThing({
            UID,
            name: randomthinf.name,
            ACCOUNT: randomthinf.acount
          })
          msgRight.push(`[${randomthinf.name}]*1`)
        } else {
          msgRight.push('储物袋已满')
        }
      }
      if (m < (mon.level + 1) * 7) {
        const SIZE = mon.level * 25 * mybuff
        msgRight.push(`[气血]*${SIZE}`)
        GameApi.GP.updataUser({
          UID,
          CHOICE: 'user_level',
          ATTRIBUTE: 'experiencemax',
          SIZE
        })
      }
      if (m < (mon.level + 1) * 8) {
        const lingshi = GameApi.Method.leastOne(mon.level * 2)
        msgRight.push(`[上品灵石]*${lingshi}`)
        GameApi.Bag.addBagThing({
          UID,
          name: '上品灵石',
          ACCOUNT: lingshi
        })
      }
      if (m < (mon.level + 1) * 9) {
        const lingshi = GameApi.Method.leastOne(mon.level * 20)
        msgRight.push(`[中品灵石]*${lingshi}`)
        GameApi.Bag.addBagThing({
          UID,
          name: '中品灵石',
          ACCOUNT: lingshi
        })
      }
      if (m >= (mon.level + 1) * 9) {
        const lingshi = GameApi.Method.leastOne(mon.level * 200)
        msgRight.push(`[下品灵石]*${lingshi}`)
        GameApi.Bag.addBagThing({
          UID,
          name: '下品灵石',
          ACCOUNT: lingshi
        })
      }
    }
    GameApi.Wrap.setRedis(UID, CDID, nowTime, CDTime)
    const { path, name, data } = GameApi.Information.showBattle({
      UID: e.user_id,
      msgLeft,
      msgRight
    })
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }

  async userExploremonsters(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = GameApi.Wrap.GoMini(e.user_id)
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const msg = []
    const monster = GameApi.Monster.monsterscache(action.region)
    for (let name in monster) {
      msg.push('怪名:' + name + '\n' + '等级:' + monster[name].level + '\n')
    }
    const isreply = await e.reply(
      await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } })
    )
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }
}
