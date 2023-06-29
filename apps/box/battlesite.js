import { BotApi, GameApi, plugin } from '#xiuxian-api'
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
    if (!super.verify(e)) return false
    e = super.escape(e)
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
    const CDID = 10
    const nowTime = new Date().getTime()
    const cf = GameApi.Defset.getConfig('cooling')
    const CDTime = cf.CD.Kill ? cf.CD.Kill : 5
    const { state: coolingState, msg: coolingMsg } = GameApi.Burial.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    const Mname = e.cmd_msg.replace(/^(#|\/)击杀/, '')
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const monstersdata = GameApi.Monster.monsterscache(action.region)
    const mon = monstersdata[Mname]
    if (!mon) {
      e.reply(`这里没有[${Mname}],去别处看看吧`)
      return false
    }
    const Levellist = GameApi.Data.controlAction({
      NAME: 'gaspractice',
      CHOICE: 'fixed_levels'
    })
    const LevelMax = Levellist[mon.level]
    const battle = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
    })
    const LifeData = GameApi.Data.readInitial('life', 'playerLife', {})
    const BMSG = GameApi.Fight.start(
      { battleA: battle, UIDA: UID, NAMEA: LifeData[UID].name },
      {
        battleB: {
          nowblood: LevelMax.blood,
          attack: LevelMax.attack,
          defense: LevelMax.defense,
          blood: LevelMax.blood,
          burst: mon.level + 13,
          burstmax: LevelMax.burstmax + mon.level,
          speed: LevelMax.speed + 5
        },
        UIDB: 1,
        NAMEB: Mname
      }
    )
    const firstArray = BMSG.msg.slice(0, 16)
    const secondArray = BMSG.msg.slice(16)
    // 保存信息
    GameApi.Data.write(UID, 'playerBattle', BMSG.battleA)
    if (BMSG.victory == 0 || BMSG.victory == 1) {
      /** 跟怪物打平手了 或者 被打败了~ 丢人 */

      if (firstArray.length != 0) {
        BotApi.Robot.surveySet(
          e,
          await e.reply(
            await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: firstArray } })
          )
        )
      }
      if (secondArray.length != 0) {
        BotApi.Robot.surveySet(
          e,
          await e.reply(
            await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: secondArray } })
          )
        )
      }
      return false
    }
    let msgRight = []
    const talent = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerTalent'
    })
    const mybuff = Math.floor(talent.talentsize / 100) + Number(1)
    const m = Math.floor(Math.random() * (100 - 1)) + Number(1)
    const p = generateRandomNumber(mon.level)
    if (m < p + 3) {
      const randomthinf = GameApi.GP.getRandomThing()
      let najie = GameApi.Data.controlAction({
        NAME: UID,
        CHOICE: 'playerBag'
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
    if (m < p + 6) {
      const SIZE = mon.level * 25 * mybuff
      msgRight.push(`[气血]*${SIZE}`)
      GameApi.Levels.addExperience(UID, 1, SIZE)
    }
    if (m < p + 9) {
      const lingshi = GameApi.Method.leastOne(mon.level * 2)
      msgRight.push(`[上品灵石]*${lingshi}`)
      GameApi.Bag.addBagThing({
        UID,
        name: '上品灵石',
        ACCOUNT: lingshi
      })
    }
    if (m < p + 10) {
      const lingshi = GameApi.Method.leastOne(mon.level * 20)
      msgRight.push(`[中品灵石]*${lingshi}`)
      GameApi.Bag.addBagThing({
        UID,
        name: '中品灵石',
        ACCOUNT: lingshi
      })
    }
    if (m >= p + 5) {
      const lingshi = GameApi.Method.leastOne(mon.level * 200)
      msgRight.push(`[下品灵石]*${lingshi}`)
      GameApi.Bag.addBagThing({
        UID,
        name: '下品灵石',
        ACCOUNT: lingshi
      })
    }
    GameApi.Burial.set(UID, CDID, nowTime, CDTime)
    if (firstArray.length != 0) {
      BotApi.Robot.surveySet(
        e,
        await e.reply(
          await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: firstArray } })
        )
      )
    }
    const { path, name, data } = GameApi.Information.showUserBattle({
      UID: e.user_id,
      msgLeft: secondArray,
      msgRight
    })
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async userExploremonsters(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = GameApi.Action.miniGo(UID)
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const msg = []
    const monster = GameApi.Monster.monsterscache(action.region)
    for (let name in monster) {
      msg.push('怪名:' + name + '\n' + '等级:' + monster[name].level + '\n')
    }
    const isreply = await e.reply(
      await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } })
    )
    BotApi.Robot.surveySet(e, isreply)
    return false
  }
}

function generateRandomNumber(n) {
  var lowerBound = (n - 1) * 10 + 1 // 下限
  var upperBound = n * 10 // 上限
  var randomNumber = Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound // 随机生成数字
  return randomNumber
}
